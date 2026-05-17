# Synapse Agentic GTM System

**The first open-source, multi-agent Go-To-Market operating system.** 
Synapse deploys a 17-agent AI organization (CMO, SDR, Market Intel, RevOps, etc.) to autonomously manage your entire revenue lifecycle. 

Built with Next.js, Supabase, and Google Gemini 3 Flash.

## 🚀 Key Features

- **17-Agent Hierarchy:** A complete digital RevOps org out-of-the-box.
- **Agent-to-Agent (A2A) Protocol:** Agents delegate tasks to each other seamlessly.
- **Secure AI Framework (SAIF):** Built-in guardrails against prompt injection and data leaks.
- **Human-in-the-Loop (HITL):** High-stakes actions (emails, deals) pause for Slack approval.
- **RAG Memory:** Agents remember past decisions and context using `pgvector`.
- **Live Monitoring Dashboard:** Real-time metrics, trace waterfalls, and cost budgeting.

## 🧠 Core Architecture (Google ADK & Vertex AI)

Synapse is built strictly adhering to the [Google/Kaggle Agent Engineering Guidelines](https://www.kaggle.com/whitepaper-agents). It implements a **Level 3 Collaborative Multi-Agent System**.

Instead of using consumer APIs, Synapse is powered by **Google Cloud Platform (GCP) Vertex AI** using the official Google Gen AI SDK (Agent Development Kit / ADK). 
This architectural choice provides three enterprise-grade benefits:
1. **Zero Data Training:** Your proprietary CRM data and GTM strategies sent to the model are NEVER used to train Google's foundational models.
2. **Enterprise Scale:** Handles the massive token throughput required for 17 agents running concurrent asynchronous `think()` loops.
3. **IAM Security:** Authenticates securely via GCP Service Accounts rather than static API keys.

## 🛠️ Quickstart (Mock Mode)

You can run the entire 17-agent ecosystem locally without connecting any real APIs using our hybrid "Mock Mode".

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/synapse-agentic-gtm.git
cd synapse-agentic-gtm/synapse-app
npm install
```

### 2. Database Setup (Supabase)
1. Create a free project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy and paste the contents of `init.sql` (found in the root) and run it.

### 3. Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```
Fill in the following:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (for internal A2A auth)
- `VERTEX_PROJECT_ID` & `VERTEX_LOCATION`: Google Cloud Vertex AI settings (optional, defaults provided)

### 4. Run the System
```bash
npm run dev
```
Navigate to [http://localhost:3000/dashboard/monitoring](http://localhost:3000/dashboard/monitoring) to view the live agent dashboard!

## ⚙️ Customization

Synapse is built with a strict **"Config-over-Code"** philosophy. 
To customize the system for your company, simply edit `synapse.config.ts`. 

You can define your ICP, connect live API keys, adjust token budgets, and activate/deactivate specific agents without touching core logic.

## 📜 License
MIT License. See `LICENSE` for more information.

## 🤝 Contributing
Please see `CONTRIBUTING.md` for guidelines on how to build new agents and integrations.
