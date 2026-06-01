export class SAIF {
  /**
   * PII Scanner & Masking: Detects and masks/redacts sensitive data like emails,
   * phone numbers, authorization bearer keys, API keys, and credentials in URLs.
   */
  static maskPII(text: string): string {
    if (typeof text !== 'string') return text;

    let result = text;

    // 1. Mask Auth Bearer keys / API Keys (e.g. bearer xy123, api_key: xy123, sk-12345, etc.)
    const bearerRegex = /(bearer\s+)[a-zA-Z0-9_\-\.\~+\/]+=*/gi;
    result = result.replace(bearerRegex, '$1[AUTH_KEY_REDACTED]');

    const genericKeyRegex = /(?:key|secret|token|password|auth|api-key|apikey|access_token|private_key)\s*[:=]\s*["']?([a-zA-Z0-9_\-\.\~]{10,})["']?/gi;
    result = result.replace(genericKeyRegex, (match, prefix, keyVal) => {
      // If matching key/secret prefix, mask the value part
      return match.replace(keyVal || '', '[API_KEY_REDACTED]');
    });

    const openAiKeyRegex = /sk-[a-zA-Z0-9]{20,}/g;
    result = result.replace(openAiKeyRegex, '[OPENAI_KEY_REDACTED]');

    // 2. Mask Emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    result = result.replace(emailRegex, '[EMAIL_REDACTED]');

    // 3. Mask Phone Numbers (matches standard formats like +1-555-555-5555, (555) 555-5555, +44 20 7946 0958, etc.)
    const phoneRegex = /(\+?\d{1,4}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
    result = result.replace(phoneRegex, '[PHONE_REDACTED]');

    // 4. Mask sensitive API URLs (redacting queries and credentials in urls)
    const apiHubspotUrlRegex = /https:\/\/api\.hubspot\.com\/[^\s"']*/gi;
    result = result.replace(apiHubspotUrlRegex, (url) => {
      return url.replace(/([\?&])(hapikey|key|apikey|secret|token)=([^&\s"']*)/gi, '$1$2=[URL_PARAM_REDACTED]');
    });

    // General URL with potential passwords or keys in query parameters
    const generalUrlRegex = /https?:\/\/[^\s"']+/gi;
    result = result.replace(generalUrlRegex, (url) => {
      if (url.includes('?') || url.includes('@')) {
        let cleanedUrl = url.replace(/(https?:\/\/)[^/:\s"']+:[^/:\s"']+@/gi, '$1[CREDENTIALS_REDACTED]@');
        cleanedUrl = cleanedUrl.replace(/([\?&])(hapikey|key|apikey|secret|token|auth|pass|password)=([^&\s"']*)/gi, '$1$2=[URL_PARAM_REDACTED]');
        return cleanedUrl;
      }
      return url;
    });

    return result;
  }

  /**
   * Input Filtering: Checks the raw prompt or input data for prompt injection attacks
   * or policy violations (like forcing a 100% discount).
   * Also performs automatic PII masking to secure downstream systems.
   */
  static sanitizeInput(input: string | any): { isSafe: boolean; reason?: string; sanitizedInput?: any } {
    const isString = typeof input === 'string';
    const inputStr = isString ? input : JSON.stringify(input);
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
    if (lowerInput.match(/100%\s*discount/) || lowerInput.includes("free forever")) {
        return { isSafe: false, reason: "Policy Violation: Attempting to authorize a 100% discount." };
    }

    // 3. Apply Model Armor PII Masking
    const masked = SAIF.maskPII(inputStr);
    const sanitizedInput = isString ? masked : JSON.parse(masked);

    return { isSafe: true, sanitizedInput };
  }

  /**
   * Output Filtering: Checks the LLM's response before it is sent to a tool or another agent
   * to ensure no sensitive data leaked or unauthorized actions were taken.
   * Also applies PII masking on outputs.
   */
  static sanitizeOutput(output: any): { isSafe: boolean; reason?: string; sanitizedOutput?: any } {
    const isString = typeof output === 'string';
    const outputStr = isString ? output : JSON.stringify(output);
    
    // Example: Ensure output doesn't contain the raw system prompt text
    if (outputStr.includes("You are the CMO agent of an enterprise B2B SaaS company.")) {
      return { isSafe: false, reason: "Data Leak: Output contains raw system prompt." };
    }

    // Apply Model Armor PII Masking on outputs
    const masked = SAIF.maskPII(outputStr);
    const sanitizedOutput = isString ? masked : JSON.parse(masked);

    return { isSafe: true, sanitizedOutput };
  }
}
