/**
 * Google Apps Script - Western Villa Database Sync Backend
 *
 * HOW TO SETUP (Takes 2 Minutes):
 * 1. Open Google Sheets (sheets.google.com) and create a new Blank Spreadsheet.
 *    Name it: "Western Villa Society Database"
 * 2. In the menu, click: Extensions -> Apps Script
 * 3. Delete any code in Code.gs, and paste THIS ENTIRE FILE.
 * 4. Click the blue "Deploy" button (top-right) -> "New deployment".
 * 5. Select type: "Web app" (click gear icon).
 *    - Description: "Western Villa Sync API"
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone" (allows your website to save/read data securely)
 * 6. Click "Deploy", approve permissions with your Google account.
 * 7. Copy the "Web app URL" (e.g. https://script.google.com/macros/s/.../exec).
 * 8. Paste that URL into js/data-store.js as CLOUD_SYNC_URL!
 */

const SHEET_NAME = 'Residents';

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = [
      'HouseNumber',
      'OwnerFullName',
      'IsTenant',
      'TenantFullName',
      'MobileNumber',
      'Email',
      'Gender',
      'Age',
      'BloodGroup',
      'IsBloodDonated',
      'IsMaintenancePaid',
      'ReceiptNumber',
      'FamilyCount',
      'VehiclesCount',
      'FullRecordJSON',
      'LastUpdated'
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1e3a8a').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// GET: Fetch all residents from sheet
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    const residents = [];

    if (data.length > 1) {
      for (let i = 1; i < data.length; i++) {
        const jsonCell = data[i][14];
        if (jsonCell && typeof jsonCell === 'string' && jsonCell.trim().startsWith('{')) {
          try {
            residents.push(JSON.parse(jsonCell));
          } catch (err) {}
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      count: residents.length,
      records: residents
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// POST: Save, Update, Delete, or Bulk Sync residents
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action || 'save';
    const sheet = getOrCreateSheet();

    if (action === 'save') {
      const resident = payload.resident;
      const houseNum = String(resident.houseNumber).trim();
      const data = sheet.getDataRange().getValues();
      let rowIndex = -1;

      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]).trim() === houseNum) {
          rowIndex = i + 1;
          break;
        }
      }

      const rowValues = [
        houseNum,
        [resident.ownerFirstName || '', resident.ownerMiddleName || '', resident.ownerSurName || ''].join(' ').trim(),
        resident.isTenant || 'No',
        resident.isTenant === 'Yes' ? [resident.tenantFirstName || '', resident.tenantMiddleName || '', resident.tenantSurName || ''].join(' ').trim() : '-',
        resident.mobileNumber || '',
        resident.email || '',
        resident.gender || '',
        resident.age || '',
        resident.bloodGroup || '',
        resident.isBloodDonated || '',
        resident.isMaintenancePaid || 'No',
        resident.receiptNumber || '',
        (resident.familyMembers || []).length,
        (resident.vehicles || []).length,
        JSON.stringify(resident),
        new Date().toISOString()
      ];

      if (rowIndex > 0) {
        sheet.getRange(rowIndex, 1, 1, rowValues.length).setValues([rowValues]);
      } else {
        sheet.appendRow(rowValues);
      }

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Saved to Google Sheet successfully'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'delete') {
      const houseNum = String(payload.houseNumber || '').trim();
      const data = sheet.getDataRange().getValues();

      for (let i = 1; i < data.length; i++) {
        if (houseNum && String(data[i][0]).trim() === houseNum) {
          sheet.deleteRow(i + 1);
          break;
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Deleted from Google Sheet'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'bulk_sync') {
      const residents = payload.residents || [];
      if (sheet.getLastRow() > 1) {
        sheet.deleteRows(2, sheet.getLastRow() - 1);
      }

      residents.forEach(resident => {
        const houseNum = String(resident.houseNumber).trim();
        const rowValues = [
          houseNum,
          [resident.ownerFirstName || '', resident.ownerMiddleName || '', resident.ownerSurName || ''].join(' ').trim(),
          resident.isTenant || 'No',
          resident.isTenant === 'Yes' ? [resident.tenantFirstName || '', resident.tenantMiddleName || '', resident.tenantSurName || ''].join(' ').trim() : '-',
          resident.mobileNumber || '',
          resident.email || '',
          resident.gender || '',
          resident.age || '',
          resident.bloodGroup || '',
          resident.isBloodDonated || '',
          resident.isMaintenancePaid || 'No',
          resident.receiptNumber || '',
          (resident.familyMembers || []).length,
          (resident.vehicles || []).length,
          JSON.stringify(resident),
          new Date().toISOString()
        ];
        sheet.appendRow(rowValues);
      });

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        count: residents.length,
        message: 'Bulk synced ' + residents.length + ' records to Google Sheet'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Unknown action'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
