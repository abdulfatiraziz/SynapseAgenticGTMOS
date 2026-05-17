# ICP & Buyer Personas

<!--
  CUSTOMIZATION: Replace all content below with your actual ICPs and personas.
  This file is injected into every agent's context before each LLM call.
  Agents use this to score leads, write outreach, and make routing decisions.
-->

## Ideal Customer Profile (ICP)

### Firmographic Criteria

| Attribute | Ideal Range | Disqualify If |
|---|---|---|
| **Company Size** | [e.g., 50–500 employees] | [e.g., <10 or >5,000] |
| **Annual Revenue** | [e.g., $5M–$100M ARR] | [e.g., <$1M] |
| **Industry** | [e.g., B2B SaaS, FinTech, MarTech] | [e.g., Consumer, Government] |
| **Geography** | [e.g., US, UK, Canada] | [e.g., APAC for now] |
| **Funding Stage** | [e.g., Series A–C] | [e.g., Pre-seed] |

### Technographic Signals (Tools They Use)

**Strong fit:**
- CRM: [e.g., HubSpot, Salesforce]
- Marketing: [e.g., Marketo, Pardot]
- Data: [e.g., Segment, Amplitude]

**Weak fit:**
- [e.g., Uses spreadsheets only]
- [e.g., All-in-one SMB tools like Monday.com]

### Behavioral / Intent Signals

**High-intent triggers (score 80+):**
- [e.g., Hiring a VP of Revenue Operations]
- [e.g., Recent Series A or B funding]
- [e.g., Searching for "[competitor] alternative"]

**Medium-intent triggers (score 50–79):**
- [e.g., Downloaded a GTM-related whitepaper]
- [e.g., Attended a webinar on RevOps automation]

**Low-intent (score <50):**
- [e.g., Visited homepage only]
- [e.g., Consumer-focused company]

---

## Buyer Personas

### Persona 1: [Primary Persona Name]

**Job Titles:** [e.g., VP of Revenue Operations, Head of RevOps, Revenue Operations Manager]

**Seniority:** [e.g., Director / VP]

**What they care about:**
- [Pain point 1]
- [Pain point 2]
- [Success metric they're measured on]

**Messaging that resonates:**
> "[Example message or value prop that lands with this persona]"

**Common objections:**
- "[Objection 1]" → Respond with: "[Response]"
- "[Objection 2]" → Respond with: "[Response]"

**Preferred outreach channel:** [e.g., LinkedIn > Email]

---

### Persona 2: [Secondary Persona Name]

**Job Titles:** [e.g., Chief Marketing Officer, VP Marketing, Growth Lead]

**Seniority:** [e.g., C-Suite / VP]

**What they care about:**
- [Pain point 1]
- [Pain point 2]
- [Success metric]

**Messaging that resonates:**
> "[Example message]"

**Preferred outreach channel:** [e.g., Email > LinkedIn]

---

### Persona 3: [Economic Buyer / Champion]

**Job Titles:** [e.g., CEO, CRO, Founder]

**Role in deal:** [e.g., Final sign-off, budget owner]

**What they care about:**
- Revenue impact, not features
- Time-to-value
- Risk mitigation

**Messaging:**
> "[Board-level / business outcome framing]"

---

## Anti-ICP (Who We Don't Sell To)

- [e.g., B2C companies]
- [e.g., Companies with <10 employees]
- [e.g., Non-profits]
- [e.g., Companies in regulated industries where AI is restricted]

Agents should mark these leads as `disqualified` and NOT route them to SDR.
