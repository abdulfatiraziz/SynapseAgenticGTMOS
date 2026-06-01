import * as dotenv from 'dotenv';
import path from 'path';
import http from 'http';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { VpPartnershipsAgent } from '../lib/agents/VpPartnershipsAgent';
import { toA2a } from '../lib/agents/a2aWrapper';

async function runA2aHandoffSimulation() {
  console.log("=== Agent-to-Agent (A2A) Collaborative Co-Selling Handoff Simulation ===\n");

  // 1. Instantiate the Partnerships Agent (02d)
  const partnershipsAgent = new VpPartnershipsAgent();
  await partnershipsAgent.initialize();

  // 2. Expose the Partnerships Agent as a microservice on port 4005 using the A2A Wrapper
  const port = 4005;
  const server = toA2a(partnershipsAgent, port);

  // Helper to perform HTTP GET requests natively
  const getAgentCard = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:${port}/.well-known/agent-card.json`, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse agent card response: ${data}`));
          }
        });
      }).on('error', reject);
    });
  };

  // Helper to perform HTTP POST requests natively
  const executeMission = (mission: string, schema?: any): Promise<any> => {
    const payload = JSON.stringify({ mission, schema });
    
    return new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: port,
        path: '/a2a/execute',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse execution response: ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.write(payload);
      req.end();
    });
  };

  try {
    // Give the server a small moment to bind
    await new Promise(resolve => setTimeout(resolve, 500));

    // 3. CSO Agent (01b) discovers Partnerships Agent (02d)'s capabilities via its Agent Card
    console.log("\n[CSO Agent (01b)] Querying Partnerships Agent (02d) discovery metadata...");
    const agentCard = await getAgentCard();
    console.log("-----------------------------------------------------------------");
    console.log("🔍 [DISCOVERED AGENT CARD]");
    console.log(`Name:        ${agentCard.name}`);
    console.log(`Version:     ${agentCard.version}`);
    console.log(`Skills:      ${JSON.stringify(agentCard.skills)}`);
    console.log(`API URL:     ${agentCard.url}`);
    console.log("-----------------------------------------------------------------\n");

    // 4. CSO Agent (01b) delegates a collaborative co-selling mission to Partnerships Agent (02d)
    const coSellMission = `
      Perform a co-selling overlap audit for high-value prospect 'Stripe' with strategic alliance partner 'Snowflake'.
      Identify if Snowflake's active customer relationship provides a warm intro path and outline suggested joint value tactics.
    `;
    
    const targetSchema = {
      type: "OBJECT",
      properties: {
        partnerOverlapMatch: { type: "BOOLEAN" },
        warmIntroFeasible: { type: "BOOLEAN" },
        introChannel: { type: "STRING" },
        coSellValueProposition: { type: "STRING" },
        recommendedNextStep: { type: "STRING" }
      },
      required: ["partnerOverlapMatch", "warmIntroFeasible", "introChannel", "coSellValueProposition", "recommendedNextStep"]
    };

    console.log(`[CSO Agent (01b)] Sending collaborative A2A mission request to Partnerships Agent (02d) at ${agentCard.url}...`);
    console.log(`Mission Details: ${coSellMission.trim()}`);
    
    const response = await executeMission(coSellMission, targetSchema);

    console.log("\n-----------------------------------------------------------------");
    console.log("🎉 [CO-SELLING MISSION ACCOMPLISHED]");
    if (response.success) {
      console.log("Status:      SUCCESS");
      console.log("Result Payload:", JSON.stringify(response.result, null, 2));
    } else {
      console.log("Status:      FAILED");
      console.log("Error:", response.error);
    }
    console.log("-----------------------------------------------------------------\n");

  } catch (error: any) {
    console.error("❌ A2A Simulation Failed:", error.message);
  } finally {
    // 5. Tear down A2A HTTP Server
    console.log("[A2A Wrapper] Shutting down Partnerships Agent (02d) server...");
    server.close(() => {
      console.log("✅ Server closed successfully. Simulation Finished.");
    });
  }
}

runA2aHandoffSimulation();
