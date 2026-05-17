# Tool Connection Guide: Make.com (MCP Toolbox)

This guide explains how to connect the Synapse AI ecosystem to **Make.com MCP Toolboxes** for autonomous GTM workflows.

## 1. Setup in Make.com
1. **Prepare Scenarios:** Create your scenarios and ensure they use the **"Start Scenario"** and **"Return Output"** modules. 
2. **On-Demand:** Set the scenario schedule to **On-demand** and set it to **Active**.
3. **MCP Toolbox:** Go to **MCP Toolboxes** in the sidebar. Create a new Toolbox and add your active scenarios as **Actions**.
4. **Retrieve Credentials:** 
   - Copy the **MCP Server URL** (e.g., `https://eu1.make.com/mcp/server/...`).
   - Create a **Key** and copy it (e.g., `klU...`). This is your `MAKE_TOOLBOX_ID`.

## 2. Environment Variables
Add the following keys to your [`.env.local`](file:///Users/abdulfatiraziz/Synpase/Synpase%20Agentic%20GTM%20System/synapse-app/.env.local):
- `MAKE_API_TOKEN`: Your Personal Access Token (for management).
- `MAKE_TOOLBOX_ID`: The unique **Key** from your Toolbox.

## 3. How it Works (The Loop)
Our `ToolGateway` uses the **MCP Stateless** protocol to trigger scenarios:
1. **Trigger:** The agent sends inputs (e.g., `linkedin_url`).
2. **Execution:** Make receives the data, runs the logic (Clay, HubSpot, etc.).
3. **Response:** Make returns the result to the agent via the `Return Output` module.

## 4. Discovering Tool Names
Make often prefixes your scenario names (e.g., `t3044_scenario_name`). To find the exact name your agents must use, run:
```bash
npx tsx --env-file=.env.local src/scripts/list_make_tools.ts
```

## 5. Strategic Use Cases
| Agent | Scenario | Result |
| :--- | :--- | :--- |
| **SDR Manager (03a)** | Lead Personalization | Uses Clay + AI to write opening lines. |
| **RevOps (03e)** | Lead Routing | Automatically assigns leads to AEs in HubSpot. |

## 6. Verification
Test the connection at any time using:
```bash
npm run test:make
```
