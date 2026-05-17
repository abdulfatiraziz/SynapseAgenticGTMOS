# Slack Protocol: 17-Agent GTM Org Mapping

This document defines the specific identity, channel, and trigger events for each agent in the Synapse AI ecosystem.

## Layer 1: Strategy Foundation
| Agent | Role | Channel | Trigger Events |
| :--- | :--- | :--- | :--- |
| **01 | CMO** | `#gtm-strategy` | Strategic pivots, quarterly health checks, board updates. |
| **01b | VP PMM** | `#marketing-ops` | Messaging alignment alerts, launch readiness reports. |
| **01c | Pricing Manager** | `#gtm-finance` | Discount approval requests, pricing competitive intel. |
| **01d | Market Intel** | `#market-intelligence` | Competitor news, TAM expansion signals, industry trends. |

## Layer 2: GTM Motions (Engines)
| Agent | Role | Channel | Trigger Events |
| :--- | :--- | :--- | :--- |
| **02a | VP Sales** | `#sales-leadership` | Large deal alerts (>$50k), pipeline gap warnings. |
| **02b | Head of PLG** | `#product-growth` | PQL (Product Qualified Lead) alerts, onboarding friction. |
| **02c | Community Lead** | `#community-pulse` | Viral social mentions, community growth milestones. |
| **02d | VP Partnerships** | `#ecosystem-partners` | Partner-sourced lead alerts, co-selling overlaps. |

## Layer 3: Channels & Levers (Execution)
| Agent | Role | Channel | Trigger Events |
| :--- | :--- | :--- | :--- |
| **03a | SDR Manager** | `#sales-execution` | Daily outbound stats, top-performing sequence alerts. |
| **03b | Demand Gen** | `#demand-gen` | Ad spend anomalies (GAds/Meta), CPL spikes. |
| **03c | Content Lead** | `#content-review` | New content performance, backlink wins. |
| **03d | Events Manager** | `#event-ops` | Registration milestones, post-event lead sync status. |
| **03e | Head of RevOps** | `#ops-notifications` | Data hygiene warnings, tool connection status/errors. |

## Layer 4: NRR & Expansion (Retention)
| Agent | Role | Channel | Trigger Events |
| :--- | :--- | :--- | :--- |
| **04a | VP CS** | `#customer-success` | Churn risk alerts, renewal forecast updates. |
| **04b | CSM Manager** | `#account-management` | Account health drops, expansion triggers. |
| **04c | Expansion Lead** | `#expansion-growth` | Upsell opportunities identified in current accounts. |
| **04d | Renewals Lead** | `#renewal-ops` | 90/60/30-day renewal countdowns, "Renewal Secured" wins. |

## Slack Interaction Rules
1. **Thread First:** Agents should always reply in threads to keep channels clean.
2. **Mentions:** Use `@user` for approvals and `@channel` for critical system failures (RevOps only).
3. **Structured Data:** Use Slack Blocks (sections, fields, buttons) for clear reporting.
