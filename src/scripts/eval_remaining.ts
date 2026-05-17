import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { PricingManagerAgent } from '../lib/agents/PricingManagerAgent';
import { CommunityAgent } from '../lib/agents/CommunityAgent';
import { VpPartnershipsAgent } from '../lib/agents/VpPartnershipsAgent';
import { FieldEventsAgent } from '../lib/agents/FieldEventsAgent';

async function runEvaluation() {
  console.log("=== Final Blueprint Agents Evaluation (CI/CD Quality Gate) ===\n");

  const pricingAgent = new PricingManagerAgent();
  const communityAgent = new CommunityAgent();
  const partnershipsAgent = new VpPartnershipsAgent();
  const eventsAgent = new FieldEventsAgent();
  
  // 1. Pricing Mock Data
  const badDiscount = {
    opportunity_id: 'opp-101',
    company_name: 'Acme Corp',
    requested_discount_percent: 35,
    margin_after_discount: 60
  };

  // 2. Community Mock Data
  const powerUser = {
    contact_id: 'usr-999',
    user_name: 'Jane Doe',
    company_name: 'TechGiant',
    is_target_icp: true,
    activity: 'Answered 15 advanced API integration questions in the Slack channel this week.'
  };

  // 3. Partnerships Mock Data
  const partnerOverlap = {
    account_id: 'acct-777',
    company_name: 'Globex',
    partner_name: 'AWS',
    overlap_status: 'active_customer_for_partner'
  };

  // 4. Events Mock Data
  const eventList = {
    event_id: 'evt-2026',
    event_name: 'SaaStr Annual',
    attendees: [
      { contact_id: 'c-1', role: 'VP Sales', engagement: 'Watched full demo' },
      { contact_id: 'c-2', role: 'Student', engagement: 'Grabbed a pen' }
    ]
  };

  try {
    console.log("Test 1: Pricing Manager evaluating a 35% discount request");
    const pricingEval = await pricingAgent.evaluateDiscountRequest(badDiscount);
    console.log(`✅ Decision: ${pricingEval.decision}`);
    if (pricingEval.decision !== 'reject_and_escalate') throw new Error("Pricing Agent approved a bad discount.");
    console.log("\n-----------------------------------\n");

    console.log("Test 2: Community Agent evaluating a Power User");
    const commEval = await communityAgent.processCommunitySignal(powerUser);
    console.log(`✅ Decision: ${commEval.decision}`);
    if (commEval.decision !== 'alert_sales_for_expansion') throw new Error("Community Agent missed an expansion signal.");
    console.log("\n-----------------------------------\n");

    console.log("Test 3: VP Partnerships evaluating an AWS co-sell overlap");
    const partnerEval = await partnershipsAgent.processPartnerOverlap(partnerOverlap);
    console.log(`✅ Decision: ${partnerEval.decision}`);
    if (partnerEval.decision !== 'co_sell_motion') throw new Error("VP Partnerships missed a co-sell opportunity.");
    console.log("\n-----------------------------------\n");

    console.log("Test 4: Field & Events Manager evaluating attendee list");
    const eventEval = await eventsAgent.processEventAttendees(eventList);
    console.log(`✅ Priority Contacts Identified: ${eventEval.priority_contacts.length}`);
    if (eventEval.priority_contacts.length !== 1) throw new Error("Events agent failed to filter out the student attendee.");
    console.log("\n🎉 Final 4 Agents Evaluation Passed!");

  } catch (error: any) {
    console.error("❌ Evaluation Failed:", error.message);
  }
}

runEvaluation();
