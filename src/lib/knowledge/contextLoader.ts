import fs from 'fs';
import path from 'path';

export class ContextLoader {
  private static KB_PATH = path.resolve(process.cwd(), 'src/data/knowledge_base');

  /**
   * Loads the entire knowledge base as a formatted string for LLM ingestion.
   */
  static getFullContext(): string {
    try {
      const companyProfile = this.readFile('company_profile.md');
      const icpPersonas = this.readFile('icp_personas.md');

      return `
=== SYSTEM CONTEXT: COMPANY KNOWLEDGE BASE ===
${companyProfile}

=== SYSTEM CONTEXT: ICP & PERSONAS ===
${icpPersonas}
==============================================
`;
    } catch (error) {
      console.error("Error loading knowledge base context:", error);
      return "";
    }
  }

  private static readFile(filename: string): string {
    const filePath = path.join(this.KB_PATH, filename);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
    console.warn(`Knowledge base file not found: ${filename}`);
    return "";
  }
}
