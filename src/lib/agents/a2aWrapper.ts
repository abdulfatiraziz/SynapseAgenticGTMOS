import http from 'http';
import { BaseAgent } from './BaseAgent';

export function toA2a(agent: BaseAgent, port: number) {
  console.log(`[A2A Wrapper] Exposing agent ${agent.agentId} via A2A protocol on port ${port}...`);

  const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // Serve Agent Card metadata at .well-known or /metadata
    if (req.method === 'GET' && (req.url === '/.well-known/agent-card.json' || req.url === '/metadata')) {
      if (!agent.name) {
        await agent.initialize();
      }
      
      const card = {
        name: agent.name.toLowerCase().replace(/\s+/g, '_'),
        version: '1.0.0',
        description: agent.systemPrompt,
        capabilities: { tools: agent.tools },
        securitySchemes: { agent_oauth_2_0: { type: 'oauth2' } },
        skills: [{ id: 'general', name: 'General GTM Skill', description: 'Executes standard tasks.' }],
        url: `http://localhost:${port}/a2a/execute`
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(card));
      return;
    }

    // Handle standard execution request via POST
    if (req.method === 'POST' && req.url === '/a2a/execute') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const payload = JSON.parse(body);
          const { mission, schema } = payload;
          
          if (!mission) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing required field: mission' }));
            return;
          }

          console.log(`[A2A Wrapper] executing mission for agent=${agent.agentId}: ${mission}`);
          const result = await agent.think(mission, schema);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, result }));
        } catch (err: any) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found. A2A Server endpoints: GET /.well-known/agent-card.json, POST /a2a/execute');
  });

  server.listen(port, () => {
    console.log(`[A2A Wrapper] Agent ${agent.agentId} is live on http://localhost:${port}`);
  });

  return server;
}
