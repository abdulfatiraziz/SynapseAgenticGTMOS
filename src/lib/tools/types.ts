// ─────────────────────────────────────────────────────────────────────────────
// Synapse ToolGateway — Typed Tool Parameter Interfaces
// Every tool in gateway.ts has a strict input type.
// Replace `params: any` with these interfaces for type safety + LLM guidance.
// ─────────────────────────────────────────────────────────────────────────────

// ── Google Workspace ──────────────────────────────────────────────────────────

export interface GoogleParams {
  action:
    | 'read_spreadsheet'
    | 'create_doc'
    | 'create_sheet'
    | 'update_doc'
    | 'copy_file'
    | 'list_files';
  spreadsheetId?: string;
  range?: string;
  resource?: {
    title?: string;
    parent_id?: string;
    document_id?: string;
    text?: string;
    file_id?: string;
    new_title?: string;
    query?: string;
  };
}

// ── Apollo.io ─────────────────────────────────────────────────────────────────

export interface ApolloParams {
  /** HTTP method. Defaults to POST */
  method?: 'GET' | 'POST';
  /** Apollo API endpoint. Defaults to /v1/mixed_people/api_search */
  endpoint?: string;
  /** Search page (max 5 to conserve credits) */
  page?: number;
  /** Person title filters e.g. ["VP Sales", "Head of Marketing"] */
  person_titles?: string[];
  /** Organization industry e.g. ["SaaS", "FinTech"] */
  organization_industry_tag_ids?: string[];
  /** Minimum company size */
  organization_num_employees_ranges?: string[];
  q_organization_domains?: string[];
}

// ── HubSpot ───────────────────────────────────────────────────────────────────

export interface HubSpotParams {
  /**
   * High-level action. Controls which CRM operation is invoked.
   * - get_partner_deals: returns evangelist/partner-influenced deals
   * - defaults to raw API passthrough via `method` + `endpoint`
   */
  action?: 'get_partner_deals' | 'raw';
  /** HTTP method for raw passthrough */
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  /** CRM API endpoint e.g. /crm/v3/objects/contacts */
  endpoint?: string;
  /** Request body for POST/PATCH calls */
  body?: Record<string, unknown>;
}

// ── Slack ─────────────────────────────────────────────────────────────────────

export interface SlackParams {
  action: 'send_message' | 'list_channels' | 'create_channel' | 'list_messages' | 'monitor_intent';
  /** Slack channel ID (required for send_message, list_messages, monitor_intent) */
  channel?: string;
  /** Message text (required for send_message) */
  text?: string;
  /** Channel name (required for create_channel) */
  channel_name?: string;
}

// ── Notion ────────────────────────────────────────────────────────────────────

export interface NotionParams {
  method?: 'GET' | 'POST' | 'PATCH';
  endpoint?: string;
  body?: Record<string, unknown>;
}

// ── Clay ──────────────────────────────────────────────────────────────────────

export interface ClayParams {
  /** Lead or enrichment data to push to Clay table via webhook */
  lead?: Record<string, unknown>;
  [key: string]: unknown;
}

// ── Make.com (MCP) ────────────────────────────────────────────────────────────

export interface MakeParams {
  /** The Make scenario tool name exposed via MCP toolbox */
  action_id: string;
  /** Inputs for the scenario */
  inputs?: Record<string, unknown>;
}

// ── Google Ads ────────────────────────────────────────────────────────────────

export interface GoogleAdsParams {
  /** GAQL query string e.g. "SELECT campaign.name, metrics.clicks FROM campaign" */
  query: string;
}

// ── Meta Ads ──────────────────────────────────────────────────────────────────

export interface MetaAdsParams {
  /** Graph API endpoint segment e.g. 'insights' */
  endpoint?: string;
  /** Comma-separated fields e.g. 'impressions,clicks,spend' */
  fields?: string;
  /** Date range e.g. { since: "2025-01-01", until: "2025-01-31" } */
  time_range?: { since: string; until: string };
}

// ── Ahrefs ────────────────────────────────────────────────────────────────────

export interface AhrefsParams {
  action: 'keyword_research' | 'site_audit';
  keyword?: string;
  target_url?: string;
}

// ── LinkedIn ──────────────────────────────────────────────────────────────────

export interface LinkedInParams {
  action: 'create_post' | 'get_engagement';
  content?: string;
  post_id?: string;
}

// ── Instagram ─────────────────────────────────────────────────────────────────

export interface InstagramParams {
  action: 'publish_media';
  media_url?: string;
  caption?: string;
}

// ── Zoom ──────────────────────────────────────────────────────────────────────

export interface ZoomParams {
  action: 'get_webinar_attendees';
  webinar_id?: string;
}

// ── PostHog ───────────────────────────────────────────────────────────────────

export interface PostHogParams {
  action: 'identify_pqls';
  user_email?: string;
  event_name?: string;
}

// ── Google Analytics (GA4) ────────────────────────────────────────────────────

export interface GoogleAnalyticsParams {
  action: 'get_traffic_sources';
  dimension?: string;
  metric?: string;
}

// ── MarketIntel ───────────────────────────────────────────────────────────────

export interface MarketIntelParams {
  action: 'search_market' | 'analyze_competitor' | 'fetch_g2_sentiment';
  query?: string;
  competitor_url?: string;
}

// ── Union type for all tool params ────────────────────────────────────────────

export type ToolParams =
  | GoogleParams
  | ApolloParams
  | HubSpotParams
  | SlackParams
  | NotionParams
  | ClayParams
  | MakeParams
  | GoogleAdsParams
  | MetaAdsParams
  | AhrefsParams
  | LinkedInParams
  | InstagramParams
  | ZoomParams
  | PostHogParams
  | GoogleAnalyticsParams
  | MarketIntelParams;

// ── Tool Result envelope ──────────────────────────────────────────────────────

export interface ToolResult {
  status: 'success' | 'error';
  source?: 'live' | 'mock' | string;
  data?: unknown;
  message?: string;
}
