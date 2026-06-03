import { BaseAgent } from './BaseAgent';

export class FieldEventsAgent extends BaseAgent {
  constructor(sessionId?: string) {
    super('03d', sessionId); // 03d is the Field & Events Manager
  }

  /**
   * Evaluates post-event attendee lists to identify high-value follow-ups.
   */
  async processEventAttendees(eventData: any) {
    console.log(`[Field & Events Agent] Processing attendees for event: ${eventData.event_name}...`);

    const prompt = `
      You are the Field & Events Manager. Your job is to maximize pipeline ROI from events.
      You have the list of attendees who visited our booth at an event.
      
      Event Data:
      ${JSON.stringify(eventData, null, 2)}
      
      Analyze the attendee list. Identify the attendees who fit our ICP and had a 'high' engagement level (e.g., watched a demo, requested contact).
      Output a list of priority contacts to be pushed to the SDR Manager (03a) for immediate follow-up.
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        priority_contacts: { 
          type: "ARRAY", 
          items: { type: "STRING" },
          description: "List of contact IDs that should be prioritized." 
        },
        event_roi_estimate: { type: "STRING", description: "Estimated pipeline generation from this event." }
      },
      required: ["priority_contacts", "event_roi_estimate"]
    };

    const evaluation = await this.think(prompt, schema);
    console.log(`[Field & Events Agent] Found ${evaluation.priority_contacts.length} priority contacts. Estimated ROI: ${evaluation.event_roi_estimate}`);

    // Update Event CRM (e.g., Salesforce Campaigns)
    await this.useTool('Salesforce', {
      action: 'UPDATE_CAMPAIGN_MEMBERS',
      event_id: eventData.event_id,
      priority_contacts: evaluation.priority_contacts
    });

    return evaluation;
  }
}
