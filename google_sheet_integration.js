/**
 * ==============================================================================
 * URIDE BOSTON — GOOGLE SHEET & EMAIL AUTOMATION SCRIPT
 * For Account: brandaovicente4@gmail.com
 * ==============================================================================
 * 
 * HOW TO SET THIS UP IN 1 MINUTE:
 * 
 * 1. Log in to Google with brandaovicente4@gmail.com
 * 2. Open Google Sheets (https://sheets.new) and name the spreadsheet: "Uride Boston Driver Pilot Roster"
 * 3. In Row 1 of Sheet1, add these column headers:
 *    [A: Timestamp] [B: Full Name] [C: Phone Number] [D: Email] [E: Boston Area] [F: Vehicle] [G: Background] [H: Notes]
 * 4. In the top menu, click: Extensions -> Apps Script
 * 5. Delete any code in the editor and paste ALL the code below.
 * 6. Click "Deploy" (top right) -> "New deployment"
 * 7. Click the gear icon next to "Select type" -> choose "Web app"
 * 8. Set:
 *    - Description: "Uride Driver Pilot Form Endpoint"
 *    - Execute as: "Me (brandaovicente4@gmail.com)"
 *    - Who has access: "Anyone"
 * 9. Click "Deploy" -> Click "Authorize access" with brandaovicente4@gmail.com.
 * 10. Copy the "Web app URL" (looks like: https://script.google.com/macros/s/AKfycb.../exec).
 * 
 * Paste that URL in your browser console:
 *   localStorage.setItem('uride_google_sheet_webhook', 'YOUR_WEB_APP_URL');
 * 
 * Done! Every driver who registers will now automatically appear in your Google Sheet AND you will receive an email notification.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Append the driver record to the Google Sheet
    sheet.appendRow([
      data["Submitted At"] || new Date().toLocaleString(),
      data["Full Name"] || data.name || "",
      data["Phone Number"] || data.phone || "",
      data["Email Address"] || data.email || "",
      data["Boston Area"] || data.area || "",
      data["Vehicle"] || data.vehicle || "",
      data["Driving Background"] || data.background || "",
      data["Notes / Availability"] || data.notes || ""
    ]);

    // Optional email notification to brandaovicente4@gmail.com
    var recipient = "brandaovicente4@gmail.com";
    var subject = "New Uride Boston Pilot Driver: " + (data["Full Name"] || data.name || "New Applicant");
    var body = "A new driver has registered for the Uride Boston pilot!\n\n" +
               "Name: " + (data["Full Name"] || data.name) + "\n" +
               "Phone: " + (data["Phone Number"] || data.phone) + "\n" +
               "Email: " + (data["Email Address"] || data.email) + "\n" +
               "Boston Area: " + (data["Boston Area"] || data.area) + "\n" +
               "Vehicle: " + (data["Vehicle"] || data.vehicle) + "\n" +
               "Background: " + (data["Driving Background"] || data.background) + "\n" +
               "Notes: " + (data["Notes / Availability"] || data.notes) + "\n\n" +
               "View full spreadsheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl();

    MailApp.sendEmail(recipient, subject, body);

    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
