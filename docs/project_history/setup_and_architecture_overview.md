# Project Overview: Synapse Agentic GTM Infrastructure

This document provides a historical record of the setup, architecture, and development milestones of the Synapse Agentic GTM System.

## 🏗️ 1. The Foundation: GCP & Gemini
We began by establishing a secure enterprise backbone on **Google Cloud Platform (GCP)**.
- **Project Identity:** `level-up-life-j44w4`.
- **Primary Model:** **Gemini 1.5 Pro** (via Google AI SDK), chosen for its massive context window (2M tokens) and native tool-calling capabilities.
- **Security:** Implemented a **Service Account** (`synapse-enterprise-agent@...`) as the primary identity for all server-side operations, ensuring agents act with a persistent, non-expiring workplace identity.

## 🤖 2. The 17-Agent Organizational Structure
We moved away from "single-bot" automation to a structured, role-based organizational hierarchy:
- **Architecture:** 4 Layers (Strategy, Ops, Execution, Support).
- **Identity Registry:** Each agent (e.g., `01` CMO, `03a` SDR Manager) is registered in a **Supabase** backend.
- **RBAC:** Every agent has a `tools_required` array that dictates which APIs they can touch, preventing unauthorized data access across roles.

## 🗺️ 3. The 15-Day Integration Roadmap
We categorized the build into four high-impact sprints:
- **Sprint 1 (Communication & Strategy):** Wiring Slack, Notion, HubSpot, and Google Workspace.
- **Sprint 2 (Execution & Performance):** Implementing Make.com (MCP), Google Ads, Meta Ads, and SEO APIs (Ahrefs).
- **Sprint 3 (Social & Community):** Scaling brand voice via LinkedIn and X APIs.
- **Sprint 4 (Voice of Customer):** Integrating Gong and Zendesk for deep feedback loops.

## 🔌 4. Tool Connection & Gateway Logic
The core engine of the system is the **Unified Tool Gateway** (`src/lib/tools/gateway.ts`).
- **MCP Integration:** We transitioned from basic API calls to the **Make.com MCP (Model Context Protocol)**. This allows agents to "call" visual Make scenarios as modular functions using the `stateless` execution endpoint.
- **Ads Integration:** Demand Gen agents now have live "Read" access to **Google Ads** and **Meta Ads** for real-time spend and ROI monitoring.
- **Safety First:** Every tool call includes **Credit Safety Logic** (e.g., Apollo page limits) and **RBAC checks** to ensure enterprise-grade security.

## 🧪 5. Transition: Prototype to Production
The project moved from theory to reality via the **"Manifesto Smoke Test"**:
1. **Discovery:** Agent 01d (Market Intel) searched Apollo for leads.
2. **Reasoning:** Agent 01 (CMO) validated the leads against Notion ICP guidelines.
3. **Execution:** Agent 03e (RevOps) dispatched data to Clay for enrichment.
4. **Reporting:** Agent 03a (SDR Manager) alerted the human team via Slack.

## 📊 Summary Table
| Phase | Milestone | Tech Stack |
| :--- | :--- | :--- |
| **I** | Core Identity | GCP, Gemini, Service Accounts |
| **II** | Agent Registry | Supabase, RBAC, 17-Agent Schema |
| **III** | Comms Stack | Slack, Notion, G-Workspace |
| **IV** | Performance Stack | Make (MCP), Google Ads, Meta Ads |
| **V** | Security Stack | GitHub (Private), .env protection |

---
**Documented on:** May 16, 2026
**Current Version:** 1.5 (Production Ready)
