# Tool Connection Guide: HubSpot (The GTM Source of Truth)

This guide details how to configure **HubSpot** as the central brain for your multi-motion GTM strategy.

## 1. Overview
HubSpot serves as the system of record for leads, deals, and partner overlaps. Every agent in the 17-agent hierarchy reads from or writes to HubSpot to ensure alignment.

## 2. Partner-Led Setup (MANUAL ACTION REQUIRED)
To enable the **Partner-Led Wave (Wave 5)**, you must manually create/update the following fields in your HubSpot instance:

### A. Lead Status (Contact Property)
Add the following options to your **Lead Status** dropdown:
- `evangelist`: For leads introduced by brand ambassadors.
- `partner_referral`: For leads coming from your ecosystem partners (AWS, Snowflake, etc.).

### B. Partner Influence (Deal Property)
Create a new **Custom Property** for Deals:
- **Label:** `Partner Influence`
- **Internal Name:** `partner_influence`
- **Type:** Dropdown or Single Line Text
- **Purpose:** To track which partner is collaborating on the deal.

## 3. Core Actions

| Action | Purpose | Agent Use Case |
| :--- | :--- | :--- |
| `get_contacts` | Triage | **SDR (03a):** "Find all new 'MQL' contacts from today." |
| `get_partner_deals` | Co-selling | **Partnerships (02d):** "Find all deals with 'Evangelist' status." |
| `update_deal` | Pipeline Mgmt | **RevOps (03e):** "Update deal stage to 'Negotiation' after contract sent." |

## 4. Auth & Scopes
Ensure your OAuth integration has the following scopes:
- `crm.objects.contacts.read/write`
- `crm.objects.deals.read/write`
- `crm.schemas.deals.read`

## 5. Verification Mission
Run the Partner Co-sell mission to verify the agent can see your partner data:
```bash
npx tsx --env-file=.env.local src/scripts/mission_partner_cosell.ts
```
