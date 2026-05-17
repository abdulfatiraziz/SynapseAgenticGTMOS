# Tool Connection Guide: Market Intelligence (MarketIntel)

This guide details the integration of the **Strategic Intelligence Layer**, powered by the native capabilities of **Gemini 3 Flash**.

## 1. Overview
The `MarketIntel` tool provides your strategy agents with "eyes" on the market. Unlike traditional tools that require expensive APIs, this tool leverages Gemini 3's **Search Grounding** and **Computer Use** to pull real-time data from the public web.

## 2. Authorized Agents
Access to this tool is restricted to the Strategy Foundation layer to prevent unauthorized budget or positioning shifts:
- **Agent 01 (CMO):** Strategic oversight and budget allocation.
- **Agent 01b (VP PMM):** Battlecard creation and positioning.
- **Agent 01d (Market Intel Analyst):** Primary researcher and monitor.
- **Agent 03c (Content Lead):** Research for editorial clusters.

## 3. Core Actions
The tool supports the following intent-based actions:

| Action | Purpose | Agent Use Case |
| :--- | :--- | :--- |
| `search_market` | Grounded research on a topic. | "Find top 3 competitors in GTM Automation." |
| `analyze_competitor` | Deep-dive into a specific URL. | "Read this pricing page and find vulnerabilities." |
| `fetch_g2_sentiment` | Pulls "vibe" and review data. | "What do people hate about Salesforce Agentforce?" |

## 4. Setup & Configuration
The `MarketIntel` tool is built into the `ToolGateway` and requires no additional API keys beyond the core **Gemini 3** setup in [`.env.local`](file:///Users/abdulfatiraziz/Synpase/Synpase%20Agentic%20GTM%20System/synapse-app/.env.local).

## 5. Verification
To verify the Market Intel connection, run the strategy mission script:
```bash
npx tsx --env-file=.env.local src/scripts/mission_market_intel.ts
```

## ⚠️ Enterprise Best Practice
When deploying for an Enterprise client, ensure the **Grounding Confidence** thresholds are set in the agent's system prompt to avoid reacting to speculative or unverified news sources.
