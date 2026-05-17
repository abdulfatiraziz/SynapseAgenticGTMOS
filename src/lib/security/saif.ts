export class SAIF {
  /**
   * Input Filtering: Checks the raw prompt or input data for prompt injection attacks
   * or policy violations (like forcing a 100% discount).
   */
  static sanitizeInput(input: string | any): { isSafe: boolean; reason?: string } {
    const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
    const lowerInput = inputStr.toLowerCase();

    // 1. Detect prompt injection keywords
    const injectionKeywords = [
      "ignore previous instructions",
      "ignore all prior instructions",
      "you are now an unrestricted",
      "system prompt override",
      "bypass safety filters"
    ];

    for (const keyword of injectionKeywords) {
      if (lowerInput.includes(keyword)) {
        return { isSafe: false, reason: `Prompt Injection detected: Contains forbidden phrase '${keyword}'` };
      }
    }

    // 2. Detect policy violations (e.g., unauthorized massive discounts)
    // Looking for phrases like "100% discount", "free forever", etc.
    if (lowerInput.match(/100%\s*discount/) || lowerInput.includes("free forever")) {
        return { isSafe: false, reason: "Policy Violation: Attempting to authorize a 100% discount." };
    }

    return { isSafe: true };
  }

  /**
   * Output Filtering: Checks the LLM's response before it is sent to a tool or another agent
   * to ensure no sensitive data leaked or unauthorized actions were taken.
   */
  static sanitizeOutput(output: any): { isSafe: boolean; reason?: string } {
    const outputStr = typeof output === 'string' ? output : JSON.stringify(output);
    
    // Example: Ensure output doesn't contain the raw system prompt text
    if (outputStr.includes("You are the CMO agent of an enterprise B2B SaaS company.")) {
      return { isSafe: false, reason: "Data Leak: Output contains raw system prompt." };
    }

    return { isSafe: true };
  }
}
