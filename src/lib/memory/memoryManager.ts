/**
 * MemoryManager — Long-term RAG Memory for Synapse Agents
 * ────────────────────────────────────────────────────────
 * Provides store/recall/forget operations backed by Supabase pgvector.
 * Embeddings are generated via Vertex AI text-embedding-004 (768 dimensions).
 *
 * Controlled by SynapseConfig.memory:
 *   enabled       → true/false master switch
 *   top_k         → how many memories to retrieve
 *   min_similarity → cosine similarity threshold (0–1)
 */

import { createClient } from '@supabase/supabase-js';
import { SynapseConfig } from '../../../synapse.config';

// ─── Types ────────────────────────────────────────────────────────────────────

export type MemoryType =
  | 'lead_signal'
  | 'agent_decision'
  | 'icp_learning'
  | 'tool_result'
  | 'market_intel'
  | 'conversation';

export interface MemoryEntry {
  id: string;
  agent_id: string;
  session_id?: string;
  memory_type: MemoryType;
  content: string;
  metadata: Record<string, unknown>;
  similarity?: number;  // Populated on recall()
  created_at: string;
}

export interface StoreMemoryOptions {
  agentId: string;
  sessionId?: string;
  type: MemoryType;
  content: string;
  metadata?: Record<string, unknown>;
  /** Optional TTL — null means never expires */
  expiresAt?: Date | null;
}

// ─── Supabase admin client ────────────────────────────────────────────────────
// Uses service-role key so we can write embeddings server-side
const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key'
);

// ─── Embedding helper ─────────────────────────────────────────────────────────

async function embed(text: string): Promise<number[]> {
  try {
    const { aiClient } = await import('../vertexai');

    // Vertex AI text-embedding-004: 768 dimensions, optimised for retrieval
    const response = await aiClient.models.embedContent({
      model: 'text-embedding-004',
      contents: text.slice(0, 2000), // Cap at 2k chars to control cost
    });

    return response.embeddings?.[0]?.values ?? [];
  } catch (err: any) {
    // If Vertex AI is unavailable (e.g., CI environment), return null vector
    console.warn(`[MemoryManager] Embedding failed: ${err.message}. Memory will be stored without embedding.`);
    return [];
  }
}

function vectorToString(vec: number[]): string {
  return `[${vec.join(',')}]`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export class MemoryManager {
  /**
   * Store a new memory. Generates embedding and writes to pgvector.
   * Returns the memory ID (useful for later forget() calls).
   */
  static async store(options: StoreMemoryOptions): Promise<string | null> {
    if (!SynapseConfig.memory.enabled) return null;

    const { agentId, sessionId, type, content, metadata, expiresAt } = options;

    try {
      // Generate embedding
      const vec = await embed(content);
      const embeddingStr = vec.length > 0 ? vectorToString(vec) : null;

      const { data, error } = await sbAdmin
        .from('agent_memory')
        .insert({
          agent_id: agentId,
          session_id: sessionId ?? null,
          memory_type: type,
          content: content.slice(0, 5000), // Safety cap
          embedding: embeddingStr,
          metadata: metadata ?? {},
          expires_at: expiresAt === undefined ? null : expiresAt?.toISOString() ?? null,
        })
        .select('id')
        .single();

      if (error) {
        console.warn(`[MemoryManager] Store failed: ${error.message}`);
        return null;
      }

      console.log(`[Memory] Stored ${type} for agent=${agentId} (id: ${data.id})`);
      return data.id;
    } catch (err: any) {
      console.warn(`[MemoryManager] Store error: ${err.message}`);
      return null;
    }
  }

  /**
   * Recall the most similar memories to a query string.
   * Uses pgvector cosine similarity via the match_memories() Supabase function.
   */
  static async recall(
    agentId: string,
    query: string,
    options?: {
      topK?: number;
      minSimilarity?: number;
      memoryType?: MemoryType;
    }
  ): Promise<MemoryEntry[]> {
    if (!SynapseConfig.memory.enabled) return [];

    const topK = options?.topK ?? SynapseConfig.memory.top_k;
    const minSimilarity = options?.minSimilarity ?? SynapseConfig.memory.min_similarity;

    try {
      const vec = await embed(query);
      if (vec.length === 0) return [];

      const { data, error } = await sbAdmin.rpc('match_memories', {
        query_embedding: vectorToString(vec),
        match_count: topK,
        match_threshold: minSimilarity,
        filter_agent_id: agentId,
      });

      if (error) {
        console.warn(`[MemoryManager] Recall failed: ${error.message}`);
        return [];
      }

      // Filter by memory_type if specified
      const results = (data as MemoryEntry[]) ?? [];
      if (options?.memoryType) {
        return results.filter(m => m.memory_type === options.memoryType);
      }

      return results;
    } catch (err: any) {
      console.warn(`[MemoryManager] Recall error: ${err.message}`);
      return [];
    }
  }

  /**
   * Format recalled memories as a context block for LLM injection.
   * Inject the result into the agent's system prompt or think() input.
   */
  static formatForPrompt(memories: MemoryEntry[]): string {
    if (memories.length === 0) return '';

    const lines = [
      '=== RELEVANT MEMORIES FROM PAST SESSIONS ===',
      ...memories.map((m, i) =>
        `[Memory ${i + 1} | ${m.memory_type} | similarity: ${(m.similarity ?? 0).toFixed(2)}]\n${m.content}`
      ),
      '=============================================',
    ];

    return lines.join('\n\n');
  }

  /**
   * Delete a specific memory by ID (GDPR compliance / data hygiene).
   */
  static async forget(memoryId: string): Promise<boolean> {
    const { error } = await sbAdmin
      .from('agent_memory')
      .delete()
      .eq('id', memoryId);

    if (error) {
      console.warn(`[MemoryManager] Forget failed: ${error.message}`);
      return false;
    }

    console.log(`[Memory] Forgotten memory id=${memoryId}`);
    return true;
  }

  /**
   * Delete all memories for a specific agent (e.g., full reset).
   */
  static async forgetAll(agentId: string): Promise<number> {
    const { data, error } = await sbAdmin
      .from('agent_memory')
      .delete()
      .eq('agent_id', agentId)
      .select('id');

    if (error) {
      console.warn(`[MemoryManager] ForgetAll failed: ${error.message}`);
      return 0;
    }

    const count = data?.length ?? 0;
    console.log(`[Memory] Cleared ${count} memories for agent=${agentId}`);
    return count;
  }

  /**
   * Purge expired memories (run this as a cron job / Supabase Edge Function).
   */
  static async purgeExpired(): Promise<number> {
    const { data, error } = await sbAdmin
      .from('agent_memory')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .not('expires_at', 'is', null)
      .select('id');

    if (error) {
      console.warn(`[MemoryManager] PurgeExpired failed: ${error.message}`);
      return 0;
    }

    return data?.length ?? 0;
  }

  /**
   * Context Compaction — Recursive Summarization
   * ─────────────────────────────────────────────
   * Per Google's Context Engineering whitepaper (p.24), when an agent's
   * conversation history grows too long, we summarize the oldest memories
   * into a single condensed "compaction" entry. This prevents context rot,
   * reduces token cost, and keeps recall fast.
   *
   * Called automatically by BaseAgent when memory count > SynapseConfig.memory.compaction_threshold.
   * Runs ASYNCHRONOUSLY (fire-and-forget) — never blocks the agent's hot path.
   *
   * @param agentId   The agent whose memories to compact
   * @param keepLatest How many recent memories to preserve verbatim (default: 10)
   * @returns         The new summary memory ID, or null if no compaction needed
   */
  static async compact(agentId: string, keepLatest = 10): Promise<string | null> {
    if (!SynapseConfig.memory.enabled) return null;

    // 1. Fetch all memories for this agent, oldest first
    const { data: allMemories, error } = await sbAdmin
      .from('agent_memory')
      .select('id, content, memory_type, created_at')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: true });

    if (error || !allMemories) {
      console.warn(`[MemoryManager.compact] Fetch failed: ${error?.message}`);
      return null;
    }

    // 2. Only compact if we have more memories than keepLatest
    if (allMemories.length <= keepLatest) {
      console.log(`[Memory] compact: only ${allMemories.length} memories for agent=${agentId}, no compaction needed`);
      return null;
    }

    // 3. Split: memories to summarize (oldest) vs memories to keep verbatim (newest)
    const toSummarize = allMemories.slice(0, allMemories.length - keepLatest);
    const toKeep = allMemories.slice(allMemories.length - keepLatest);

    console.log(`[Memory] compact: summarizing ${toSummarize.length} old memories, keeping ${toKeep.length} recent ones for agent=${agentId}`);

    // 4. Build the compaction prompt from old memories
    const compactionInput = toSummarize
      .map((m, i) => `[${i + 1}] [${m.memory_type} @ ${m.created_at}]\n${m.content}`)
      .join('\n\n');

    // 5. Use Gemini to recursively summarize — runs async, won't block agent
    try {
      const { aiClient } = await import('../vertexai');
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a memory compaction system for an AI GTM agent.
Summarize the following past agent memories into a single, concise knowledge summary.
Preserve all key facts, decisions, and outcomes. Discard redundant details.
Output a clean, prose paragraph — no bullet points, no headers.

MEMORIES TO SUMMARIZE:
${compactionInput.slice(0, 8000)}

COMPACTED SUMMARY:`,
        config: { temperature: 0.1, systemInstruction: 'You are a concise technical summarizer.' },
      });

      const summary = response.text?.trim() ?? '';
      if (!summary) throw new Error('Empty summary returned');

      // 6. Store the summary as a new 'conversation' memory with a compaction marker
      const summaryId = await MemoryManager.store({
        agentId,
        type: 'conversation',
        content: `[COMPACTED SUMMARY of ${toSummarize.length} memories]\n${summary}`,
        metadata: {
          compacted_from_count: toSummarize.length,
          compacted_at: new Date().toISOString(),
          oldest_memory_id: toSummarize[0].id,
          newest_summarized_id: toSummarize[toSummarize.length - 1].id,
        },
      });

      // 7. Delete the now-summarized memories to keep the store clean
      const idsToDelete = toSummarize.map(m => m.id);
      await sbAdmin.from('agent_memory').delete().in('id', idsToDelete);

      console.log(`[Memory] compact: done — stored summary id=${summaryId}, deleted ${idsToDelete.length} old memories for agent=${agentId}`);
      return summaryId;

    } catch (err: any) {
      console.warn(`[MemoryManager.compact] Summarization failed: ${err.message}. Memories not compacted.`);
      return null;
    }
  }

  /**
   * Count total memories for an agent (used to decide if compaction is needed).
   */
  static async count(agentId: string): Promise<number> {
    const { count, error } = await sbAdmin
      .from('agent_memory')
      .select('id', { count: 'exact', head: true })
      .eq('agent_id', agentId);

    if (error) return 0;
    return count ?? 0;
  }
}

