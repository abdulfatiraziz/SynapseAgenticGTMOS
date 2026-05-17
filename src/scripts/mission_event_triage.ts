import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runEventMission() {
  console.log('--- [Field & Events 03d] Webinar-to-Pipeline Mission ---');
  
  try {
    // 1. Read Registrants from Google Sheet (Actual API call)
    console.log('\nStep 1: Reading Registrant List from Google Sheets...');
    const sheetResult = await ToolGateway.executeTool('03d', 'Google', { 
      action: 'read_spreadsheet',
      spreadsheetId: 'MOCK_SPREADSHEET_ID', // Replace with your live Sheet ID
      range: 'Sheet1!A:D'
    });

    if (sheetResult.status === 'success') {
      const registrants = sheetResult.data.values;
      console.log(`✅ Success: Found ${registrants.length - 1} registrants in the Sheet.`);

      // 2. Cross-check with Zoom Attendance
      console.log('\nStep 2: Cross-referencing with Zoom Attendance Data...');
      const zoomResult = await ToolGateway.executeTool('03d', 'Zoom', { 
        action: 'get_webinar_attendees',
        webinar_id: '123456789'
      });

      if (zoomResult.status === 'success') {
        const attendees = zoomResult.data.attendees;
        
        // 3. Triage Strategy
        console.log('\nStep 3: Executing Autonomous Lead Triage...');
        
        for (const attendee of attendees) {
          if (attendee.duration_minutes >= 45) {
            console.log(`🔥 HIGH INTENT: ${attendee.email} stayed for ${attendee.duration_minutes} mins. Flagging for SDR Call.`);
          } else if (attendee.duration_minutes > 0) {
            console.log(`🟡 WARM: ${attendee.email} attended partially. Sending Webinar Recording.`);
          } else {
            console.log(`⚪ NO SHOW: Sending "Sorry we missed you" sequence.`);
          }
        }
      }
    }
  } catch (err: any) {
    console.error('❌ Mission Failed:', err.message);
  }
}

runEventMission();
