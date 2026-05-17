# Contributing to Synapse Agentic GTM

We love your input! We want to make contributing to this project as easy and transparent as possible.

## How to Contribute

1. **Fork the repo** and create your branch from `main`.
2. **Add tests** if you are adding new functionality (e.g. update `goldenDataset.ts`).
3. **Ensure the eval suite passes** by running `npm run test` (or `npx tsx src/scripts/run_eval_suite.ts`).
4. **Create a Pull Request** with a detailed description of your changes.

## Adding a New Agent
To add a new specialized agent to the organization:
1. Add their class in `src/lib/agents/` extending `BaseAgent`.
2. Register the agent in the `AGENT_REGISTRY` in `src/app/api/agents/[agentId]/run/route.ts`.
3. Add a test case for them in `goldenDataset.ts`.
4. Update `synapse.config.ts` if they need to be active by default.

## Adding a New Tool Integration
To integrate a new SaaS tool (e.g., Salesforce, Slack):
1. Define the tool configuration and method in `src/lib/tools/gateway.ts`.
2. Handle the "mock" fallback behavior if live credentials aren't present.
3. Ensure the tool name is documented in the Agent's `tools` array.

## Code of Conduct
Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.
