/**
 * WesternVilla Static Data Store
 * Manages local storage persistence, Title Case sanitization,
 * duplicate validations, multi-sheet Excel workbook export (.xlsx),
 * CSV export with UTF-8 BOM, and automated backup generation.
 */

const STORAGE_KEY = 'western_villa_residents_db_v2';
const MAX_HOUSE_NUMBER = 181;
const CONTACT_PERSON = 'Hiren Patel - Home 13';
const CONTACT_PHONE = '9876543210';

// Default initial data: Started as EMPTY so live demo has 0 pre-existing records
const DEFAULT_SEED_DATA = [];

/* =========================================================
 * STRING SANITIZATION & TITLE CASING HELPERS
 * ========================================================= */

// Capitalize / Title Case words (e.g., "ramesh kanti patel" -> "Ramesh Kanti Patel")
function toTitleCase(str) {
    if (!str || typeof str !== 'string') return '';
    return str.trim()
        .toLowerCase()
        .replace(/(?:^|\s|-|\/)\S/g, function(a) { return a.toUpperCase(); });
}

// Convert string to uppercase (for vehicle registration plates & receipt numbers)
function toUpper(str) {
    if (!str || typeof str !== 'string') return '';
    return str.trim().toUpperCase();
}

// Sort any list strictly numerically by House Number (1 to 181)
function sortByHouseNumber(list) {
    return (list || []).slice().sort((a, b) => {
        const numA = parseInt(a.houseNumber, 10) || 0;
        const numB = parseInt(b.houseNumber, 10) || 0;
        return numA - numB;
    });
}

// Deep sanitize resident record before saving
function sanitizeResident(record) {
    if (!record) return record;
    const clean = JSON.parse(JSON.stringify(record));

    clean.houseNumber = String(clean.houseNumber || '').trim();
    clean.ownerFirstName = toTitleCase(clean.ownerFirstName);
    clean.ownerMiddleName = toTitleCase(clean.ownerMiddleName);
    clean.ownerSurName = toTitleCase(clean.ownerSurName);
    clean.gender = clean.gender || 'Male';
    clean.age = clean.age ? Number(clean.age) : null;
    clean.ownerOccupationType = clean.ownerOccupationType || 'None';
    clean.ownerOccupationDetails = toTitleCase(clean.ownerOccupationDetails);

    clean.isTenant = clean.isTenant === 'Yes' ? 'Yes' : 'No';
    if (clean.isTenant === 'Yes') {
        clean.tenantFirstName = toTitleCase(clean.tenantFirstName);
        clean.tenantMiddleName = toTitleCase(clean.tenantMiddleName);
        clean.tenantSurName = toTitleCase(clean.tenantSurName);
        clean.tenantAge = clean.tenantAge ? Number(clean.tenantAge) : null;
        clean.tenantOccupationType = clean.tenantOccupationType || 'None';
        clean.tenantOccupationDetails = toTitleCase(clean.tenantOccupationDetails);
    } else {
        clean.tenantFirstName = '';
        clean.tenantMiddleName = '';
        clean.tenantSurName = '';
        clean.tenantAge = null;
        clean.tenantOccupationType = 'None';
        clean.tenantOccupationDetails = '';
    }

    clean.mobileNumber = String(clean.mobileNumber || '').trim();
    clean.email = String(clean.email || '').trim().toLowerCase();
    clean.bloodGroup = clean.bloodGroup || '';
    clean.isBloodDonated = clean.isBloodDonated === 'Yes' ? 'Yes' : 'No';
    clean.isMaintenancePaid = clean.isMaintenancePaid === 'Yes' ? 'Yes' : 'No';
    clean.isReceiptReceived = clean.isMaintenancePaid === 'Yes' && clean.isReceiptReceived === 'Yes' ? 'Yes' : 'No';
    clean.receiptNumber = clean.isReceiptReceived === 'Yes' ? toUpper(clean.receiptNumber) : '';

    // Family Members Sanitization
    const defaultSur = clean.isTenant === 'Yes' ? (clean.tenantSurName || clean.ownerSurName) : clean.ownerSurName;
    if (Array.isArray(clean.familyMembers)) {
        clean.familyMembers = clean.familyMembers
            .filter(m => m && m.firstName && m.firstName.trim().length > 0)
            .map(m => ({
                firstName: toTitleCase(m.firstName),
                middleName: toTitleCase(m.middleName),
                surName: toTitleCase(m.surName || defaultSur),
                gender: m.gender || 'Male',
                age: m.age ? Number(m.age) : null,
                mobileNumber: String(m.mobileNumber || '').trim(),
                occupationType: m.occupationType || 'None',
                occupationDetails: toTitleCase(m.occupationDetails),
                bloodGroup: m.bloodGroup || '',
                isBloodDonated: m.isBloodDonated === 'Yes' ? 'Yes' : 'No'
            }));
    } else {
        clean.familyMembers = [];
    }

    // Vehicles Sanitization
    if (Array.isArray(clean.vehicles)) {
        clean.vehicles = clean.vehicles
            .filter(v => v && (v.vehicleNumber || (v.vehicleType && v.fuelType)))
            .map(v => ({
                vehicleType: v.vehicleType || 'Two',
                fuelType: v.fuelType || 'Petrol',
                vehicleNumber: toUpper(v.vehicleNumber)
            }));
    } else {
        clean.vehicles = [];
    }

    if (!Array.isArray(clean.interests)) {
        clean.interests = [];
    }

    return clean;
}

/* =========================================================
 * DATASTORE CORE ENGINE
 * ========================================================= */

const DataStore = {
    CONTACT_PERSON: CONTACT_PERSON,
    CONTACT_PHONE: CONTACT_PHONE,
    MAX_HOUSE_NUMBER: MAX_HOUSE_NUMBER,

    // Initialize local storage (starts empty if never set)
    init() {
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DATA));
        }
    },

    // Get all residents strictly sorted by house number ascending (1 to 181)
    getAllResidents() {
        this.init();
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const list = raw ? JSON.parse(raw) : [];
            return sortByHouseNumber(list);
        } catch (e) {
            console.error('Error loading residents:', e);
            return [];
        }
    },

    // Check if house number is already registered
    isHouseNumberRegistered(houseNumber, excludeId = null) {
        if (!houseNumber) return false;
        const normalized = String(houseNumber).trim();
        const residents = this.getAllResidents();
        return residents.some(r => {
            if (excludeId && r.id === excludeId) return false;
            return String(r.houseNumber).trim() === normalized;
        });
    },

    // Get details of already registered house
    getResidentByHouse(houseNumber) {
        if (!houseNumber) return null;
        const normalized = String(houseNumber).trim();
        const residents = this.getAllResidents();
        return residents.find(r => String(r.houseNumber).trim() === normalized) || null;
    },

    // Get single resident by ID
    getResidentById(id) {
        const residents = this.getAllResidents();
        return residents.find(r => r.id === Number(id)) || null;
    },

    // Save or update resident with Title Case & strict duplicate validation
    saveResident(rawResident) {
        this.init();
        const resident = sanitizeResident(rawResident);
        const residents = this.getAllResidents();
        const houseNum = String(resident.houseNumber).trim();

        // Duplicate check
        const isDuplicate = residents.some(r => {
            if (resident.id && r.id === resident.id) return false;
            return String(r.houseNumber).trim() === houseNum;
        });

        if (isDuplicate) {
            return {
                success: false,
                isDuplicate: true,
                message: `House Number ${houseNum} has already been registered! Duplicate submissions are not allowed. Please contact ${CONTACT_PERSON} for any help or updates. / ઘર નંબર ${houseNum} ની વિગત પહેલેથી ઉમેરાયેલ છે! ફરીથી નોંધણી માન્ય નથી. સહાય અથવા સુધારા માટે કૃપા કરીને ${CONTACT_PERSON} નો સંપર્ક કરો.`
            };
        }

        // Assign ID and timestamp if new
        if (!resident.id) {
            const maxId = residents.reduce((max, r) => (r.id > max ? r.id : max), 0);
            resident.id = maxId + 1;
            resident.registeredAt = new Date().toISOString();
            residents.push(resident);
        } else {
            const index = residents.findIndex(r => r.id === resident.id);
            if (index !== -1) {
                resident.updatedAt = new Date().toISOString();
                residents[index] = resident;
            } else {
                residents.push(resident);
            }
        }

        // Always save in strictly sorted order (1 to 181)
        const sortedResidents = sortByHouseNumber(residents);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedResidents));

        return {
            success: true,
            resident: resident,
            message: 'Registration saved successfully! / નોંધણી સફળતાપૂર્વક સાચવવામાં આવી!'
        };
    },

    // Delete a resident record
    deleteResident(id) {
        const residents = this.getAllResidents();
        const filtered = residents.filter(r => r.id !== Number(id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sortByHouseNumber(filtered)));
        return true;
    },

    // Clear all data (starts fresh with 0 records)
    clearAll() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        return [];
    },

    // Load sample seed data if user manually requests
    loadSampleData(sampleList) {
        const cleaned = (sampleList || []).map(r => sanitizeResident(r));
        const sorted = sortByHouseNumber(cleaned);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
        return sorted;
    },

    /* =========================================================
     * MULTI-SHEET EXCEL GENERATION (.xlsx)
     * Sheet 1: All details in sorted order for all Homes
     * Sheet 2: All Family Member for each home in sorting order
     * Sheet 3: All Vehicle Details for each Home in sorting order
     * Sheet 4: Sheet Print (House No, Main Name, Mobile, Total Members)
     * ========================================================= */

    // Build the 4 worksheets and create the complete workbook
    buildMultiSheetWorkbook(residentsList = null) {
        if (typeof XLSX === 'undefined') {
            throw new Error('SheetJS library (xlsx) is not loaded.');
        }

        const residents = sortByHouseNumber(residentsList || this.getAllResidents());
        const wb = XLSX.utils.book_new();

        // Helper to compute column widths
        const applyAutoColWidths = (ws, aoaData) => {
            const colWidths = [];
            aoaData.forEach(row => {
                row.forEach((cell, idx) => {
                    const str = cell !== null && cell !== undefined ? String(cell) : '';
                    colWidths[idx] = Math.max(colWidths[idx] || 10, Math.min(str.length + 3, 40));
                });
            });
            ws['!cols'] = colWidths.map(w => ({ wch: w }));
        };

        // ----------------------------------------------------
        // SHEET 1: All Details (Sorted order for all Homes)
        // ----------------------------------------------------
        const sheet1Headers = [
            'House No / ઘર નંબર',
            'Resident Type / રહેવાસી પ્રકાર',
            'Primary Resident Full Name / મુખ્ય રહેવાસી',
            'Owner Full Name / માલિકનું પૂરું નામ',
            'Owner Age / ઉંમર',
            'Owner Gender / લિંગ',
            'Owner Occupation / વ્યવસાય',
            'Owner Occupation Details / વિગત',
            'Is Rented? / ભાડે આપેલ?',
            'Tenant Full Name / ભાડુઆતનું પૂરું નામ',
            'Tenant Age / ઉંમર',
            'Tenant Occupation / વ્યવસાય',
            'Tenant Occupation Details / વિગત',
            'Mobile Number / મોબાઇલ નંબર',
            'Email Address / ઇમેઇલ',
            'Blood Group / બ્લડ ગ્રુપ',
            'Blood Donated? / રક્ત દાન?',
            'Maintenance Paid? / મેન્ટેનન્સ?',
            'Receipt Received? / રસીદ મળી?',
            'Receipt Number / રસીદ નંબર',
            'Total Family Members / પરિવાર સભ્યો',
            'Total Vehicles / વાહનોની સંખ્યા',
            'Society Volunteering Tasks / સેવા કાર્ય રસ',
            'Registration Date / નોંધણી તારીખ'
        ];

        const sheet1Rows = [sheet1Headers];
        residents.forEach(r => {
            const primaryName = r.isTenant === 'Yes'
                ? `${r.tenantFirstName || ''} ${r.tenantMiddleName || ''} ${r.tenantSurName || ''}`.trim()
                : `${r.ownerFirstName || ''} ${r.ownerMiddleName || ''} ${r.ownerSurName || ''}`.trim();

            const ownerName = `${r.ownerFirstName || ''} ${r.ownerMiddleName || ''} ${r.ownerSurName || ''}`.trim();
            const tenantName = r.isTenant === 'Yes'
                ? `${r.tenantFirstName || ''} ${r.tenantMiddleName || ''} ${r.tenantSurName || ''}`.trim()
                : '';

            sheet1Rows.push([
                r.houseNumber,
                r.isTenant === 'Yes' ? 'Tenant / ભાડુઆત' : 'Owner / માલિક',
                primaryName,
                ownerName,
                r.age || '',
                r.gender || '',
                r.ownerOccupationType || '',
                r.ownerOccupationDetails || '',
                r.isTenant || 'No',
                tenantName,
                r.isTenant === 'Yes' ? (r.tenantAge || '') : '',
                r.isTenant === 'Yes' ? (r.tenantOccupationType || '') : '',
                r.isTenant === 'Yes' ? (r.tenantOccupationDetails || '') : '',
                r.mobileNumber || '',
                r.email || '',
                r.bloodGroup || '',
                r.isBloodDonated || 'No',
                r.isMaintenancePaid || 'No',
                r.isReceiptReceived || 'No',
                r.receiptNumber || '',
                r.familyMembers ? r.familyMembers.length : 0,
                r.vehicles ? r.vehicles.length : 0,
                (r.interests || []).join(', '),
                r.registeredAt ? new Date(r.registeredAt).toLocaleDateString() : ''
            ]);
        });

        const ws1 = XLSX.utils.aoa_to_sheet(sheet1Rows);
        applyAutoColWidths(ws1, sheet1Rows);
        XLSX.utils.book_append_sheet(wb, ws1, 'All Details');

        // ----------------------------------------------------
        // SHEET 2: Family Members (Sorted order of Home Number)
        // ----------------------------------------------------
        const sheet2Headers = [
            'House No / ઘર નંબર',
            'Main Resident Name / મુખ્ય રહેવાસી',
            'Resident Status / રહેવાસી પ્રકાર',
            'Member # / ક્રમ',
            'Member First Name / નામ',
            'Member Middle Name / મધ્યમ નામ',
            'Member SurName / અટક',
            'Member Full Name / પૂરું નામ',
            'Gender / લિંગ',
            'Age / ઉંમર',
            'Mobile Number / મોબાઇલ',
            'Occupation Type / વ્યવસાય',
            'Occupation Details / વિગત',
            'Blood Group / બ્લડ ગ્રુપ',
            'Blood Donated? / રક્ત દાન?'
        ];

        const sheet2Rows = [sheet2Headers];
        residents.forEach(r => {
            const mainName = r.isTenant === 'Yes'
                ? `${r.tenantFirstName || ''} ${r.tenantSurName || ''}`.trim()
                : `${r.ownerFirstName || ''} ${r.ownerSurName || ''}`.trim();
            const status = r.isTenant === 'Yes' ? 'Tenant' : 'Owner';

            if (r.familyMembers && r.familyMembers.length > 0) {
                r.familyMembers.forEach((m, idx) => {
                    const fullName = `${m.firstName || ''} ${m.middleName || ''} ${m.surName || ''}`.trim();
                    sheet2Rows.push([
                        r.houseNumber,
                        mainName,
                        status,
                        idx + 1,
                        m.firstName || '',
                        m.middleName || '',
                        m.surName || '',
                        fullName,
                        m.gender || '',
                        m.age || '',
                        m.mobileNumber || '',
                        m.occupationType || '',
                        m.occupationDetails || '',
                        m.bloodGroup || '',
                        m.isBloodDonated || 'No'
                    ]);
                });
            }
        });

        const ws2 = XLSX.utils.aoa_to_sheet(sheet2Rows);
        applyAutoColWidths(ws2, sheet2Rows);
        XLSX.utils.book_append_sheet(wb, ws2, 'Family Members');

        // ----------------------------------------------------
        // SHEET 3: Vehicle Details (Sorted order of Home Number)
        // ----------------------------------------------------
        const sheet3Headers = [
            'House No / ઘર નંબર',
            'Main Resident Name / મુખ્ય રહેવાસી',
            'Resident Status / રહેવાસી પ્રકાર',
            'Vehicle # / ક્રમ',
            'Vehicle Type / પ્રકાર',
            'Fuel Type / બળતણ',
            'Vehicle Registration Number / વાહન નંબર'
        ];

        const sheet3Rows = [sheet3Headers];
        residents.forEach(r => {
            const mainName = r.isTenant === 'Yes'
                ? `${r.tenantFirstName || ''} ${r.tenantSurName || ''}`.trim()
                : `${r.ownerFirstName || ''} ${r.ownerSurName || ''}`.trim();
            const status = r.isTenant === 'Yes' ? 'Tenant' : 'Owner';

            if (r.vehicles && r.vehicles.length > 0) {
                r.vehicles.forEach((v, idx) => {
                    sheet3Rows.push([
                        r.houseNumber,
                        mainName,
                        status,
                        idx + 1,
                        v.vehicleType === 'Two' ? 'Two Wheeler (૨ વ્હીલર)' : 'Four Wheeler (૪ વ્હીલર)',
                        v.fuelType || '',
                        v.vehicleNumber || ''
                    ]);
                });
            }
        });

        const ws3 = XLSX.utils.aoa_to_sheet(sheet3Rows);
        applyAutoColWidths(ws3, sheet3Rows);
        XLSX.utils.book_append_sheet(wb, ws3, 'Vehicle Details');

        // ----------------------------------------------------
        // SHEET 4: Sheet Print (House No, Main Name, Mobile, Total Members)
        // ----------------------------------------------------
        const sheetPrintHeaders = [
            'House No / ઘર નંબર',
            'Main Person Full Name / મુખ્ય વ્યક્તિનું પૂરું નામ',
            'Mobile Number / મોબાઇલ નંબર',
            'Total Family Members / કુલ પરિવાર સભ્યો',
            'Resident Type / પ્રકાર',
            'Maintenance Status / મેન્ટેનન્સ સ્થિતિ',
            'Receipt Number / રસીદ નંબર'
        ];

        const sheetPrintRows = [sheetPrintHeaders];
        residents.forEach(r => {
            const mainName = r.isTenant === 'Yes'
                ? `${r.tenantFirstName || ''} ${r.tenantMiddleName || ''} ${r.tenantSurName || ''}`.trim()
                : `${r.ownerFirstName || ''} ${r.ownerMiddleName || ''} ${r.ownerSurName || ''}`.trim();

            sheetPrintRows.push([
                r.houseNumber,
                mainName,
                r.mobileNumber || '',
                r.familyMembers ? r.familyMembers.length : 0,
                r.isTenant === 'Yes' ? 'Tenant (ભાડુઆત)' : 'Owner (માલિક)',
                r.isMaintenancePaid === 'Yes' ? 'Paid (ચૂકવેલ)' : 'Unpaid (બાકી)',
                r.receiptNumber || '-'
            ]);
        });

        const wsPrint = XLSX.utils.aoa_to_sheet(sheetPrintRows);
        applyAutoColWidths(wsPrint, sheetPrintRows);
        XLSX.utils.book_append_sheet(wb, wsPrint, 'Sheet Print');

        return wb;
    },

    // Download the Multi-Sheet Excel file
    downloadExcel(filename = 'WesternVilla_Society_Master.xlsx') {
        try {
            const wb = this.buildMultiSheetWorkbook();
            XLSX.writeFile(wb, filename);
            return true;
        } catch (e) {
            console.error('Failed to download Excel workbook:', e);
            // Fallback to CSV if SheetJS has issues
            this.downloadCSV(filename.replace(/\.xlsx$/i, '.csv'));
            return false;
        }
    },

    /* =========================================================
     * BACKUP SYSTEM
     * ========================================================= */

    // Generate formatted timestamp string (YYYY-MM-DD_HH-mm)
    getTimestampString() {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const h = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        return `${y}-${m}-${d}_${h}-${min}`;
    },

    // Trigger full Excel backup download
    downloadBackupExcel() {
        const ts = this.getTimestampString();
        const filename = `WesternVilla_Backup_${ts}.xlsx`;
        return this.downloadExcel(filename);
    },

    // Trigger raw JSON backup download (for exact data restore)
    downloadBackupJSON() {
        const residents = this.getAllResidents();
        const ts = this.getTimestampString();
        const data = {
            societyName: 'Western Villa Residents Welfare Association',
            backupTimestamp: new Date().toISOString(),
            totalRecords: residents.length,
            records: residents
        };
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `WesternVilla_RawBackup_${ts}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    // Restore database from JSON backup file
    async restoreFromJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsed = JSON.parse(e.target.result);
                    const list = Array.isArray(parsed) ? parsed : (parsed.records || []);
                    const cleaned = list.map(r => sanitizeResident(r));
                    const sorted = sortByHouseNumber(cleaned);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
                    resolve({
                        success: true,
                        count: sorted.length,
                        message: `Successfully restored ${sorted.length} resident records from backup.`
                    });
                } catch (err) {
                    reject(new Error('Invalid backup JSON format: ' + err.message));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read backup file.'));
            reader.readAsText(file, 'UTF-8');
        });
    },

    /* =========================================================
     * CSV GENERATION (RFC 4180 with UTF-8 BOM for Excel)
     * ========================================================= */

    escapeCsvCell(value) {
        if (value === null || value === undefined) return '""';
        let str = String(value);
        if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
            str = str.replace(/"/g, '""');
            return `"${str}"`;
        }
        return `"${str}"`;
    },

    generateCSV(residentsList = null, selectedColumns = null) {
        const list = sortByHouseNumber(residentsList || this.getAllResidents());

        const allColumns = [
            { id: 'houseNumber', title: 'House No / ઘર નંબર', get: r => r.houseNumber },
            { id: 'residentType', title: 'Resident Type / રહેવાસી પ્રકાર', get: r => r.isTenant === 'Yes' ? 'Tenant / ભાડુઆત' : 'Owner / માલિક' },
            { id: 'primaryName', title: 'Primary Resident Name / મુખ્ય રહેવાસી', get: r => r.isTenant === 'Yes' ? `${r.tenantFirstName || ''} ${r.tenantMiddleName || ''} ${r.tenantSurName || ''}`.trim() : `${r.ownerFirstName || ''} ${r.ownerMiddleName || ''} ${r.ownerSurName || ''}`.trim() },
            { id: 'ownerName', title: 'Owner Full Name / માલિકનું નામ', get: r => `${r.ownerFirstName || ''} ${r.ownerMiddleName || ''} ${r.ownerSurName || ''}`.trim() },
            { id: 'ownerAge', title: 'Owner Age / માલિકની ઉંમર', get: r => r.age || '' },
            { id: 'ownerGender', title: 'Owner Gender / માલિકનું લિંગ', get: r => r.gender || '' },
            { id: 'ownerOccupation', title: 'Owner Occupation / વ્યવસાય', get: r => r.ownerOccupationType ? `${r.ownerOccupationType}${r.ownerOccupationDetails ? ' - ' + r.ownerOccupationDetails : ''}` : '' },
            { id: 'isTenant', title: 'Is Rented? / ભાડે આપેલ છે?', get: r => r.isTenant || 'No' },
            { id: 'tenantName', title: 'Tenant Name / ભાડુઆતનું નામ', get: r => r.isTenant === 'Yes' ? `${r.tenantFirstName || ''} ${r.tenantMiddleName || ''} ${r.tenantSurName || ''}`.trim() : '' },
            { id: 'tenantAge', title: 'Tenant Age / ભાડુઆતની ઉંમર', get: r => r.isTenant === 'Yes' ? (r.tenantAge || '') : '' },
            { id: 'tenantOccupation', title: 'Tenant Occupation / ભાડુઆત વ્યવસાય', get: r => r.isTenant === 'Yes' && r.tenantOccupationType ? `${r.tenantOccupationType}${r.tenantOccupationDetails ? ' - ' + r.tenantOccupationDetails : ''}` : '' },
            { id: 'mobileNumber', title: 'Mobile Number / મોબાઇલ નંબર', get: r => r.mobileNumber || '' },
            { id: 'email', title: 'Email Address / ઇમેઇલ', get: r => r.email || '' },
            { id: 'bloodGroup', title: 'Blood Group / બ્લડ ગ્રુપ', get: r => r.bloodGroup || '' },
            { id: 'bloodDonated', title: 'Blood Donated? / રક્ત દાન?', get: r => r.isBloodDonated || '' },
            { id: 'maintenancePaid', title: 'Maintenance Paid? / મેન્ટેનન્સ?', get: r => r.isMaintenancePaid || 'No' },
            { id: 'receiptReceived', title: 'Receipt Received? / રસીદ મળી?', get: r => r.isReceiptReceived || 'No' },
            { id: 'receiptNumber', title: 'Receipt Number / રસીદ નંબર', get: r => r.receiptNumber || '' },
            { id: 'familyCount', title: 'Family Members Count / પરિવાર સભ્યો', get: r => (r.familyMembers ? r.familyMembers.length : 0) },
            { id: 'familySummary', title: 'Family Members Details / પરિવાર વિગત', get: r => (r.familyMembers || []).map((m, idx) => `${idx + 1}. ${m.firstName} ${m.middleName || ''} ${m.surName} (${m.gender || '-'}, ${m.age ? m.age + 'y' : '-'})`).join('; ') },
            { id: 'vehiclesCount', title: 'Vehicles Count / વાહનોની સંખ્યા', get: r => (r.vehicles ? r.vehicles.length : 0) },
            { id: 'vehiclesSummary', title: 'Vehicles Details / વાહનો વિગત', get: r => (r.vehicles || []).map((v, idx) => `${idx + 1}. ${v.vehicleType === 'Two' ? '2-Wheeler' : '4-Wheeler'} [${v.fuelType}] ${v.vehicleNumber || ''}`).join('; ') },
            { id: 'interests', title: 'Society Task Interests / સોસાયટી કાર્ય રસ', get: r => (r.interests || []).join('; ') },
            { id: 'registeredAt', title: 'Registration Date / નોંધણી તારીખ', get: r => r.registeredAt ? new Date(r.registeredAt).toLocaleDateString() : '' }
        ];

        const activeColumns = selectedColumns && selectedColumns.length > 0
            ? allColumns.filter(col => selectedColumns.includes(col.id))
            : allColumns;

        const headerRow = activeColumns.map(c => this.escapeCsvCell(c.title)).join(',');
        const dataRows = list.map(resident => {
            return activeColumns.map(col => this.escapeCsvCell(col.get(resident))).join(',');
        });

        return '\uFEFF' + [headerRow, ...dataRows].join('\r\n');
    },

    downloadCSV(filename = 'WesternVilla_Residents.csv', selectedColumns = null) {
        const csvContent = this.generateCSV(null, selectedColumns);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    parseCSV(text) {
        const rows = [];
        let currentRow = [];
        let currentCell = '';
        let insideQuotes = false;

        if (text.charCodeAt(0) === 0xFEFF) {
            text = text.slice(1);
        }

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            if (char === '"') {
                if (insideQuotes && nextChar === '"') {
                    currentCell += '"';
                    i++;
                } else {
                    insideQuotes = !insideQuotes;
                }
            } else if (char === ',' && !insideQuotes) {
                currentRow.push(currentCell.trim());
                currentCell = '';
            } else if ((char === '\r' || char === '\n') && !insideQuotes) {
                if (char === '\r' && nextChar === '\n') {
                    i++;
                }
                currentRow.push(currentCell.trim());
                if (currentRow.some(c => c.length > 0)) {
                    rows.push(currentRow);
                }
                currentRow = [];
                currentCell = '';
            } else {
                currentCell += char;
            }
        }
        if (currentCell.length > 0 || currentRow.length > 0) {
            currentRow.push(currentCell.trim());
            if (currentRow.some(c => c.length > 0)) {
                rows.push(currentRow);
            }
        }
        return rows;
    },

    async importFromCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const rows = this.parseCSV(text);
                    if (rows.length < 2) {
                        return resolve({ success: false, message: 'CSV file is empty or missing data rows.' });
                    }

                    const headers = rows[0].map(h => h.toLowerCase());
                    const houseIdx = headers.findIndex(h => h.includes('house') || h.includes('ઘર'));
                    const ownerNameIdx = headers.findIndex(h => h.includes('owner') || h.includes('માલિક'));
                    const mobileIdx = headers.findIndex(h => h.includes('mobile') || h.includes('મોબાઇલ'));

                    if (houseIdx === -1) {
                        return resolve({ success: false, message: 'Could not find "House No" column in CSV.' });
                    }

                    let addedCount = 0;
                    let skippedCount = 0;
                    const currentResidents = this.getAllResidents();

                    for (let i = 1; i < rows.length; i++) {
                        const row = rows[i];
                        const houseNo = row[houseIdx];
                        if (!houseNo) continue;

                        if (this.isHouseNumberRegistered(houseNo)) {
                            skippedCount++;
                            continue;
                        }

                        const ownerFullName = (ownerNameIdx !== -1 ? row[ownerNameIdx] : '').split(' ');
                        const newResident = sanitizeResident({
                            id: (currentResidents.reduce((m, r) => (r.id > m ? r.id : m), 0) || 0) + 1,
                            houseNumber: String(houseNo).trim(),
                            ownerFirstName: ownerFullName[0] || 'Resident',
                            ownerMiddleName: ownerFullName[1] || '',
                            ownerSurName: ownerFullName.slice(2).join(' ') || '',
                            age: null,
                            gender: 'Male',
                            ownerOccupationType: 'None',
                            ownerOccupationDetails: '',
                            isTenant: 'No',
                            mobileNumber: mobileIdx !== -1 ? row[mobileIdx] : '',
                            email: '',
                            isMaintenancePaid: 'No',
                            isReceiptReceived: 'No',
                            receiptNumber: '',
                            bloodGroup: '',
                            isBloodDonated: 'No',
                            familyMembers: [],
                            vehicles: [],
                            interests: [],
                            registeredAt: new Date().toISOString()
                        });

                        currentResidents.push(newResident);
                        addedCount++;
                    }

                    const sorted = sortByHouseNumber(currentResidents);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
                    resolve({
                        success: true,
                        addedCount,
                        skippedCount,
                        message: `Import complete: ${addedCount} added, ${skippedCount} skipped (already registered).`
                    });
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read CSV file.'));
            reader.readAsText(file, 'UTF-8');
        });
    }
};

// Auto-initialize
DataStore.init();

// Export globally for browser use
window.DataStore = DataStore;
