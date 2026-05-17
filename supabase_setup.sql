-- Supabase Schema for Synapse 17-Agent GTM System

-- 1. Agents Table: Tracks the status and configuration of your 17 specialized agents
DROP TABLE IF EXISTS logs;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS agents;

CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT UNIQUE NOT NULL, -- e.g., '01', '01b', '02a'
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    layer INTEGER NOT NULL, -- 1: Strategy, 2: Motions, 3: Channels, 4: CS & Expansion
    reports_to TEXT, -- references agent_id
    core_objective TEXT,
    system_prompt TEXT,
    knowledge_inputs TEXT[],
    tools_required TEXT[],
    kpis TEXT[],
    status TEXT DEFAULT 'idle', -- idle, thinking, acting, error
    last_action TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Leads Table: Your local CRM for tracking prospects
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    website TEXT,
    industry TEXT,
    tech_stack TEXT[],
    intent_score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'identified', -- identified, enriched, qualified, outreach_sent, demo_booked
    owner_agent_id UUID REFERENCES agents(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tasks Table: Manages the Agent-to-Agent (A2A) communication queue
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_agent_id UUID REFERENCES agents(id),
    receiver_agent_id UUID REFERENCES agents(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending', -- pending, in_progress, completed, failed
    priority TEXT DEFAULT 'medium',
    input_data JSONB DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    parent_task_id UUID REFERENCES tasks(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Logs Table: The "Medical Chart" (Agent Ops) for every decision
CREATE TABLE logs (
    id BIGSERIAL PRIMARY KEY,
    agent_id UUID REFERENCES agents(id),
    task_id UUID REFERENCES tasks(id),
    event_type TEXT NOT NULL, -- thought, action, observation, error
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Initial 17 Agents
INSERT INTO agents (agent_id, name, role, layer, reports_to, core_objective, system_prompt, tools_required, kpis) VALUES
('01', 'Chief Marketing Officer', 'CMO', 1, 'CEO', 'Own the unified GTM strategy. Ensure ICP, messaging, budget, and motion are locked.', 'You are the CMO agent of an enterprise B2B SaaS company. You define and maintain the overall GTM strategy. Reason from data before making recommendations.', ARRAY['Salesforce', 'Tableau', 'Notion', 'Klue', 'Gartner APIs'], ARRAY['Marketing-sourced pipeline', 'CAC', 'Brand SOV']),
('01b', 'VP Product Marketing', 'VP PMM', 1, '01', 'Own product positioning, competitive differentiation, and sales enablement content.', 'You are the VP Product Marketing agent. You translate product capabilities into buyer-facing narratives. Lead with pain, follow with proof.', ARRAY['Klue', 'Notion', 'Highspot', 'Gong', 'Figma', 'UserTesting'], ARRAY['Win rate vs named competitors', 'Sales cycle length reduction', 'Content utilization rate']),
('01c', 'Pricing & Packaging Manager', 'Pricing Manager', 1, '01', 'Design and maintain pricing tiers, packaging, and discount governance.', 'You are the Pricing & Packaging agent. You model LTV, CAC, and payback periods. You are data-driven and skeptical of intuition-based pricing decisions.', ARRAY['ProfitWell', 'Excel', 'Typeform', 'Stripe', 'Tableau'], ARRAY['ARR per customer by tier', 'Expansion MRR', 'Blended discount rate']),
('01d', 'Market Intelligence Analyst', 'Market Intel', 1, '01b', 'Research and maintain the ICP definition, TAM models, competitive landscape, and intent signals.', 'You are the Market Intelligence agent. You continuously monitor the market. Always cite your source and flag confidence levels.', ARRAY['Apollo.io', 'Bombora', 'G2', 'LinkedIn Sales Navigator', 'Crayon'], ARRAY['ICP match rate', 'Competitive win rate trend', 'Intent signal to opportunity conversion']),

('02a', 'VP Sales', 'VP Sales (SLG)', 2, 'CRO', 'Own the enterprise Sales-Led Growth motion. Drive pipeline coverage and quota attainment.', 'You are the VP Sales agent. You lead the SLG motion. You think in pipeline math: coverage ratios, conversion rates, and ACV.', ARRAY['Salesforce', 'Gong', 'Outreach', 'Clari', 'Highspot'], ARRAY['Quota attainment', 'Pipeline coverage ratio', 'Win rate']),
('02b', 'Head of PLG', 'Head of PLG', 2, '01', 'Own the product-led acquisition and expansion engine.', 'You are the Head of PLG agent. You own the product as a distribution channel. You think in funnels and experiments.', ARRAY['Amplitude', 'Pendo', 'Appcues', 'Segment', 'LaunchDarkly'], ARRAY['Activation rate', 'PQL to SQL conversion', 'Product-sourced revenue']),
('02c', 'Head of Community', 'Community Lead', 2, '01', 'Build the brand community as a revenue channel.', 'You are the Head of Community agent. You measure community as a revenue motion. Every activity should be tied to pipeline influence.', ARRAY['Circle.so', 'Slack', 'Influitive', 'Zapier', 'Tribe'], ARRAY['Community DAU/MAU', 'Community-sourced pipeline', 'Referral conversion rate']),
('02d', 'VP Partnerships', 'VP Partnerships', 2, 'CRO', 'Build and manage the partner ecosystem. Drive partner-sourced revenue.', 'You are the VP Partnerships agent. You own the partner-led GTM motion. Use Crossbeam for account mapping before any co-sell motion.', ARRAY['PartnerStack', 'Crossbeam', 'Salesforce', 'Impartner', 'Slack'], ARRAY['Partner-sourced revenue %', 'Partner attach rate', 'Partner NPS']),

('03a', 'SDR Manager', 'SDR Manager', 3, '02a', 'Own the outbound pipeline engine. Drive SQL generation.', 'You are the SDR Manager agent. You oversee a team of SDR agents. You think in conversion rates from open to meeting booked.', ARRAY['Outreach', 'Apollo.io', 'LinkedIn Sales Navigator', 'Gong', 'Salesforce', 'Clay'], ARRAY['SQLs per SDR', 'Meeting booked rate', 'Pipeline generated']),
('03b', 'Demand Generation Manager', 'Demand Gen', 3, '01', 'Own the inbound and paid acquisition funnel.', 'You are the Demand Gen agent. You generate MQLs at the right cost. Optimize for Cost per Opportunity.', ARRAY['HubSpot', '6sense', 'Google Ads', 'LinkedIn Campaign Manager', 'Triple Whale'], ARRAY['MQL volume', 'Cost per Opportunity', 'ROAS by channel']),
('03c', 'Content & SEO Lead', 'Content & SEO', 3, '01', 'Own organic search strategy and editorial content.', 'You are the Content & SEO Lead agent. You think in keyword clusters and buyer journey stages. Map content to ICP intent.', ARRAY['Ahrefs', 'Clearscope', 'Webflow', 'Contentful', 'Beehiiv'], ARRAY['Organic traffic growth', 'Keyword ranking', 'Organic-sourced MQLs']),
('03d', 'Field & Events Manager', 'Events Manager', 3, '01', 'Plan and execute field events, webinars, and conferences.', 'You are the Events Manager agent. Every event decision should be evaluated on pipeline ROI.', ARRAY['Splash', 'Goldcast', 'Cvent', 'Salesforce', 'Bizzabo'], ARRAY['Event-sourced pipeline', 'Cost per opportunity from events']),
('03e', 'Head of Revenue Operations', 'RevOps', 3, 'CRO', 'Own the GTM nervous system: CRM, lead routing, tech stack, and forecasting.', 'You are the RevOps agent. You are the operational backbone. You are the final authority on pipeline attribution.', ARRAY['Salesforce', 'Clay', 'LeanData', 'Clari', 'Zapier', 'Tableau'], ARRAY['CRM data accuracy', 'Lead routing speed', 'Forecast accuracy']),

('04a', 'VP Customer Success', 'VP CS', 4, 'CRO', 'Own NRR across all customer tiers. Define health score model.', 'You are the VP CS agent. Your north-star metric is NRR at 110%+. You manage CSM agents and run QBRs for strategic accounts.', ARRAY['Gainsight', 'Salesforce', 'Zendesk', 'Looker', 'Gong'], ARRAY['NRR', 'GRR', 'Churn rate']),
('04b', 'Customer Success Manager', 'CSM', 4, '04a', 'Own a book of 20-50 accounts. Drive onboarding and adoption.', 'You are a CSM agent. You ensure every customer reaches value. Flag expansion signals immediately.', ARRAY['Gainsight', 'Intercom', 'Loom', 'Notion', 'Salesforce'], ARRAY['Renewal rate', 'Customer health score', 'Time-to-value']),
('04c', 'Expansion Account Executive', 'Expansion AE', 4, '02a', 'Own the expansion pipeline across the existing customer base.', 'You are the Expansion AE agent. You partner with CSMs to identify growth signals. Open commercial conversations based on usage data.', ARRAY['Salesforce', 'Gong', 'Clari', 'Gainsight', 'DocuSign'], ARRAY['Expansion ARR booked', 'Upsell win rate', 'Average expansion deal size']),
('04d', 'Renewals Manager', 'Renewals Manager', 4, '04a', 'Own the renewal pipeline 90-180 days out. Defend NRR.', 'You are the Renewals Manager agent. You ensure accounts renew on time. Pull health scores and churn predictions daily.', ARRAY['ChurnZero', 'Gainsight', 'Salesforce', 'Clari', 'DocuSign'], ARRAY['Gross logo renewal rate', 'On-time renewal rate', 'Churn prevention save rate']);

-- 6. Integrations Table: Stores tokens and config for tools like HubSpot, Apollo, etc.
CREATE TABLE integrations (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
