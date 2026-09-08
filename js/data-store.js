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

// Default initial seed records: Populated when local storage is empty so data is always visible in local
const DEFAULT_SEED_DATA = [
    {
        id: 1,
        houseNumber: '13',
        ownerFirstName: 'Hiren',
        ownerMiddleName: 'Kumar',
        ownerSurName: 'Patel',
        gender: 'Male',
        age: 38,
        ownerOccupationType: 'Job',
        ownerOccupationDetails: 'Tech Lead',
        isTenant: 'No',
        mobileNumber: '9876543210',
        email: 'hiren.patel@gmail.com',
        isMaintenancePaid: 'Yes',
        isReceiptReceived: 'Yes',
        receiptNumber: 'REC-013',
        bloodGroup: 'B+',
        isBloodDonated: 'Yes',
        familyMembers: [
            { firstName: 'Sneha', middleName: 'Hirenkumar', surName: 'Patel', gender: 'Female', age: 36, mobileNumber: '9876543211', occupationType: 'Housewife', occupationDetails: '', bloodGroup: 'O+', isBloodDonated: 'No' },
            { firstName: 'Palkeen', middleName: 'Hirenkumar', surName: 'Patel', gender: 'Female', age: 10, mobileNumber: '', occupationType: 'Study', occupationDetails: 'School Student', bloodGroup: 'B+', isBloodDonated: 'No' }
        ],
        vehicles: [
            { vehicleType: 'Four', fuelType: 'Petrol', vehicleNumber: 'GJ-01-AB-1234' },
            { vehicleType: 'Two', fuelType: 'Electric', vehicleNumber: 'GJ-01-EE-9999' }
        ],
        interests: ['Security', 'Cleanliness', 'Cultural / Festivals'],
        registeredAt: '2026-09-05T10:00:00.000Z'
    },
    {
        id: 2,
        houseNumber: '14',
        ownerFirstName: 'Hiren',
        ownerMiddleName: 'Hasmukhbhai',
        ownerSurName: 'Patel',
        gender: 'Male',
        age: 36,
        ownerOccupationType: 'Job',
        ownerOccupationDetails: 'Software Engineer',
        isTenant: 'No',
        mobileNumber: '8490021341',
        email: 'hiren.h@gmail.com',
        isMaintenancePaid: 'No',
        isReceiptReceived: 'No',
        receiptNumber: '',
        bloodGroup: 'B+',
        isBloodDonated: 'No',
        familyMembers: [
            { firstName: 'Sneha', middleName: 'Hiren', surName: 'Patel', gender: 'Female', age: 34, mobileNumber: '8490021342', occupationType: 'Job', occupationDetails: 'Banking', bloodGroup: 'A+', isBloodDonated: 'No' },
            { firstName: 'Palkeen', middleName: 'Hiren', surName: 'Patel', gender: 'Female', age: 9, mobileNumber: '', occupationType: 'Study', occupationDetails: '', bloodGroup: 'B+', isBloodDonated: 'No' }
        ],
        vehicles: [
            { vehicleType: 'Four', fuelType: 'Petrol', vehicleNumber: 'GJ-01-HP-1414' },
            { vehicleType: 'Two', fuelType: 'Electric', vehicleNumber: 'GJ-01-HP-2020' }
        ],
        interests: ['Sports / Youth', 'Health & Blood Donation'],
        registeredAt: '2026-09-06T11:30:00.000Z'
    },
    {
        id: 3,
        houseNumber: '15',
        ownerFirstName: 'Ankit',
        ownerMiddleName: 'H',
        ownerSurName: 'Patel',
        gender: 'Male',
        age: 32,
        ownerOccupationType: 'Business',
        ownerOccupationDetails: 'Chemical Trading',
        isTenant: 'No',
        mobileNumber: '8490021341',
        email: 'ankit.patel@gmail.com',
        isMaintenancePaid: 'No',
        isReceiptReceived: 'No',
        receiptNumber: '',
        bloodGroup: 'O+',
        isBloodDonated: 'No',
        familyMembers: [],
        vehicles: [
            { vehicleType: 'Four', fuelType: 'Diesel', vehicleNumber: 'GJ-01-AK-1515' }
        ],
        interests: ['Gardening / Environment'],
        registeredAt: '2026-09-07T09:15:00.000Z'
    },
    {
        id: 4,
        houseNumber: '2',
        ownerFirstName: 'Suresh',
        ownerMiddleName: 'Bhai',
        ownerSurName: 'Shah',
        gender: 'Male',
        age: 62,
        ownerOccupationType: 'Business',
        ownerOccupationDetails: 'Retired',
        isTenant: 'Yes',
        tenantFirstName: 'Jignesh',
        tenantMiddleName: 'H',
        tenantSurName: 'Mehta',
        tenantAge: 35,
        tenantOccupationType: 'Job',
        tenantOccupationDetails: 'Bank Manager',
        mobileNumber: '9822334455',
        email: 'jignesh.mehta@gmail.com',
        isMaintenancePaid: 'Yes',
        isReceiptReceived: 'Yes',
        receiptNumber: 'REC-002',
        bloodGroup: 'A+',
        isBloodDonated: 'No',
        familyMembers: [
            { firstName: 'Priti', middleName: 'Jignesh', surName: 'Mehta', gender: 'Female', age: 34, mobileNumber: '9822334456', occupationType: 'Business', occupationDetails: 'Mehta Boutique', bloodGroup: 'B+', isBloodDonated: 'No' }
        ],
        vehicles: [
            { vehicleType: 'Two', fuelType: 'Petrol', vehicleNumber: 'GJ-01-JM-7777' }
        ],
        interests: ['Cultural / Festivals'],
        registeredAt: '2026-09-07T14:00:00.000Z'
    }
];

/* =========================================================
 * STRING SANITIZATION & TITLE CASING HELPERS
 * ========================================================= */

function toTitleCase(str) {
    if (!str || typeof str !== 'string') return '';
    return str.trim()
        .toLowerCase()
        .replace(/(?:^|\s|-|\/)\S/g, function(a) { return a.toUpperCase(); });
}

function toUpper(str) {
    if (!str || typeof str !== 'string') return '';
    return str.trim().toUpperCase();
}

function sortByHouseNumber(list) {
    return (list || []).slice().sort((a, b) => {
        const numA = parseInt(a.houseNumber, 10) || 0;
        const numB = parseInt(b.houseNumber, 10) || 0;
        return numA - numB;
    });
}

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

    init() {
        try {
            const current = localStorage.getItem(STORAGE_KEY);
            if (!current || current === '[]') {
                const v1 = localStorage.getItem('western_villa_residents_db_v1') || localStorage.getItem('western_villa_residents_db');
                if (v1 && v1 !== '[]') {
                    localStorage.setItem(STORAGE_KEY, v1);
                } else if (DEFAULT_SEED_DATA && DEFAULT_SEED_DATA.length > 0) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DATA.map(r => sanitizeResident(r))));
                }
            }
        } catch (e) {
            console.warn('localStorage not accessible:', e);
        }
    },

    resetToSampleData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DATA.map(r => sanitizeResident(r))));
        return DEFAULT_SEED_DATA.length;
    },

    clearAllData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    },

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

    isHouseNumberRegistered(houseNumber, excludeId = null) {
        if (!houseNumber) return false;
        const normalized = String(houseNumber).trim();
        const residents = this.getAllResidents();
        return residents.some(r => {
            if (excludeId && r.id === excludeId) return false;
            return String(r.houseNumber).trim() === normalized;
        });
    },

    getResidentByHouse(houseNumber) {
        if (!houseNumber) return null;
        const normalized = String(houseNumber).trim();
        const residents = this.getAllResidents();
        return residents.find(r => String(r.houseNumber).trim() === normalized) || null;
    },

    getResidentById(id) {
        const residents = this.getAllResidents();
        return residents.find(r => r.id === Number(id)) || null;
    },

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

        const sortedResidents = sortByHouseNumber(residents);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedResidents));

        return {
            success: true,
            resident: resident,
            message: 'Registration saved successfully! / નોંધણી સફળતાપૂર્વક સાચવવામાં આવી!'
        };
    },

    deleteResident(id) {
        const residents = this.getAllResidents();
        const filtered = residents.filter(r => r.id !== Number(id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sortByHouseNumber(filtered)));
        return true;
    },

    clearAll() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        return [];
    },

    loadSampleData(sampleList) {
        const cleaned = (sampleList || []).map(r => sanitizeResident(r));
        const sorted = sortByHouseNumber(cleaned);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
        return sorted;
    },

    /* =========================================================
     * 3-SHEET EXCEL WORKBOOK GENERATOR (.xlsx)
     * Sheet 1: One Row for Each Member (All individual residents)
     * Sheet 2: All Vehicle Details with House and Owner/Tenant Info
     * Sheet 3: Only Owner List with Contact Details & Total Family Count
     * ========================================================= */

    buildMultiSheetWorkbook(residentsList = null) {
        if (typeof XLSX === 'undefined') {
            throw new Error('SheetJS library (xlsx) is not loaded.');
        }

        const residents = sortByHouseNumber(residentsList || this.getAllResidents());
        const wb = XLSX.utils.book_new();

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
        // SHEET 1: One Row for Each Member
        // ----------------------------------------------------
        const sheet1Headers = [
            'House No / ઘર નંબર',
            'Resident Status / પ્રકાર',
            'Head of House / મુખ્ય વ્યક્તિ',
            'Member Role / સભ્ય દરજ્જો',
            'Member Full Name / સભ્યનું પૂરું નામ',
            'First Name / નામ',
            'Middle Name / મધ્યમ નામ',
            'Surname / અટક',
            'Gender / લિંગ',
            'Age / ઉંમર',
            'Mobile Number / મોબાઇલ',
            'Email Address / ઇમેઇલ',
            'Occupation Type / વ્યવસાય',
            'Occupation Details / વિગત',
            'Blood Group / બ્લડ ગ્રુપ',
            'Blood Donated? / રક્ત દાન?',
            'Maintenance Paid? / મેન્ટેનન્સ?',
            'Receipt Number / રસીદ નંબર',
            'Registered Date / નોંધણી તારીખ'
        ];

        const sheet1Rows = [sheet1Headers];
        residents.forEach(r => {
            const headName = r.isTenant === 'Yes'
                ? `${r.tenantFirstName || ''} ${r.tenantSurName || ''}`.trim()
                : `${r.ownerFirstName || ''} ${r.ownerSurName || ''}`.trim();
            const status = r.isTenant === 'Yes' ? 'Tenant (ભાડુઆત)' : 'Owner (માલિક)';

            // 1. Primary Member Row
            const primaryFullName = r.isTenant === 'Yes'
                ? `${r.tenantFirstName || ''} ${r.tenantMiddleName || ''} ${r.tenantSurName || ''}`.trim()
                : `${r.ownerFirstName || ''} ${r.ownerMiddleName || ''} ${r.ownerSurName || ''}`.trim();

            sheet1Rows.push([
                r.houseNumber,
                status,
                headName,
                'Primary Resident (મુખ્ય રહેવાસી)',
                primaryFullName,
                r.isTenant === 'Yes' ? r.tenantFirstName : r.ownerFirstName,
                r.isTenant === 'Yes' ? r.tenantMiddleName : r.ownerMiddleName,
                r.isTenant === 'Yes' ? r.tenantSurName : r.ownerSurName,
                r.gender || 'Male',
                r.isTenant === 'Yes' ? (r.tenantAge || '') : (r.age || ''),
                r.mobileNumber || '',
                r.email || '',
                r.isTenant === 'Yes' ? (r.tenantOccupationType || '') : (r.ownerOccupationType || ''),
                r.isTenant === 'Yes' ? (r.tenantOccupationDetails || '') : (r.ownerOccupationDetails || ''),
                r.bloodGroup || '',
                r.isBloodDonated || 'No',
                r.isMaintenancePaid || 'No',
                r.receiptNumber || '',
                r.registeredAt ? new Date(r.registeredAt).toLocaleDateString() : ''
            ]);

            // 2. Individual Rows for each family member
            if (r.familyMembers && r.familyMembers.length > 0) {
                r.familyMembers.forEach(m => {
                    const memFullName = `${m.firstName || ''} ${m.middleName || ''} ${m.surName || ''}`.trim();
                    sheet1Rows.push([
                        r.houseNumber,
                        status,
                        headName,
                        'Family Member (પરિવાર સભ્ય)',
                        memFullName,
                        m.firstName || '',
                        m.middleName || '',
                        m.surName || '',
                        m.gender || '',
                        m.age || '',
                        m.mobileNumber || '',
                        '',
                        m.occupationType || '',
                        m.occupationDetails || '',
                        m.bloodGroup || '',
                        m.isBloodDonated || 'No',
                        r.isMaintenancePaid || 'No',
                        r.receiptNumber || '',
                        r.registeredAt ? new Date(r.registeredAt).toLocaleDateString() : ''
                    ]);
                });
            }
        });

        const ws1 = XLSX.utils.aoa_to_sheet(sheet1Rows);
        applyAutoColWidths(ws1, sheet1Rows);
        XLSX.utils.book_append_sheet(wb, ws1, 'All Members');

        // ----------------------------------------------------
        // SHEET 2: All Vehicle Details with House & Owner/Tenant Info
        // ----------------------------------------------------
        const sheet2Headers = [
            'House No / ઘર નંબર',
            'Occupancy Status / રહેવાસી સ્થિતિ',
            'Owner Full Name / માલિકનું નામ',
            'Tenant Full Name / ભાડુઆતનું નામ',
            'Primary Contact Mobile / મોબાઇલ',
            'Vehicle # / ક્રમ',
            'Vehicle Type / પ્રકાર',
            'Fuel Type / બળતણ',
            'Vehicle Number / વાહન નંબર'
        ];

        const sheet2Rows = [sheet2Headers];
        residents.forEach(r => {
            const ownerName = `${r.ownerFirstName || ''} ${r.ownerMiddleName || ''} ${r.ownerSurName || ''}`.trim();
            const tenantName = r.isTenant === 'Yes'
                ? `${r.tenantFirstName || ''} ${r.tenantMiddleName || ''} ${r.tenantSurName || ''}`.trim()
                : '-';

            if (r.vehicles && r.vehicles.length > 0) {
                r.vehicles.forEach((v, idx) => {
                    sheet2Rows.push([
                        r.houseNumber,
                        r.isTenant === 'Yes' ? 'Tenant (ભાડુઆત)' : 'Owner (માલિક)',
                        ownerName,
                        tenantName,
                        r.mobileNumber || '',
                        idx + 1,
                        v.vehicleType === 'Two' ? 'Two Wheeler (૨ વ્હીલર)' : 'Four Wheeler (૪ વ્હીલર)',
                        v.fuelType || '',
                        v.vehicleNumber || 'Not Specified'
                    ]);
                });
            }
        });

        const ws2 = XLSX.utils.aoa_to_sheet(sheet2Rows);
        applyAutoColWidths(ws2, sheet2Rows);
        XLSX.utils.book_append_sheet(wb, ws2, 'Vehicle Details');

        // ----------------------------------------------------
        // SHEET 3: Only Owner List along with Contact & Total Family Count
        // ----------------------------------------------------
        const sheet3Headers = [
            'House No / ઘર નંબર',
            'Owner Full Name / માલિકનું પૂરું નામ',
            'Owner Mobile / મોબાઇલ નંબર',
            'Owner Email / ઇમેઇલ',
            'Is Rented? / ભાડે આપેલ?',
            'Tenant Full Name / ભાડુઆતનું નામ',
            'Tenant Mobile / ભાડુઆત મોબાઇલ',
            'Total Family Members / કુલ પરિવાર સભ્યો',
            'Total Vehicles / કુલ વાહનો',
            'Maintenance Paid? / મેન્ટેનન્સ સ્થિતિ',
            'Receipt Number / રસીદ નંબર'
        ];

        const sheet3Rows = [sheet3Headers];
        residents.forEach(r => {
            const ownerName = `${r.ownerFirstName || ''} ${r.ownerMiddleName || ''} ${r.ownerSurName || ''}`.trim();
            const tenantName = r.isTenant === 'Yes'
                ? `${r.tenantFirstName || ''} ${r.tenantMiddleName || ''} ${r.tenantSurName || ''}`.trim()
                : '-';

            sheet3Rows.push([
                r.houseNumber,
                ownerName,
                r.mobileNumber || '',
                r.email || '-',
                r.isTenant === 'Yes' ? 'Yes (ભાડે આપેલ)' : 'No (માલિક રહે છે)',
                tenantName,
                r.isTenant === 'Yes' ? (r.mobileNumber || '-') : '-',
                r.familyMembers ? r.familyMembers.length : 0,
                r.vehicles ? r.vehicles.length : 0,
                r.isMaintenancePaid === 'Yes' ? 'Paid (ચૂકવેલ)' : 'Unpaid (બાકી)',
                r.receiptNumber || '-'
            ]);
        });

        const ws3 = XLSX.utils.aoa_to_sheet(sheet3Rows);
        applyAutoColWidths(ws3, sheet3Rows);
        XLSX.utils.book_append_sheet(wb, ws3, 'Owner List');

        return wb;
    },

    downloadExcel(filename = 'WesternVilla_Society_Master.xlsx', residentsList = null) {
        if (typeof XLSX === 'undefined') {
            alert('Excel library (SheetJS) is not loaded. Please ensure js/xlsx.full.min.js is available or check your connection.');
            return false;
        }
        try {
            const wb = this.buildMultiSheetWorkbook(residentsList);
            XLSX.writeFile(wb, filename);
            return true;
        } catch (e) {
            console.error('Failed to download Excel workbook:', e);
            alert('Error creating Excel workbook: ' + e.message);
            return false;
        }
    },

    // Build single-sheet Excel dynamically based on selected columns & filtered residents
    downloadCustomExcel(residentsList, selectedColumns, filename = 'WesternVilla_Custom_Report.xlsx') {
        if (typeof XLSX === 'undefined') {
            this.downloadCSV(filename.replace(/\.xlsx$/i, '.csv'), selectedColumns);
            return;
        }

        const residents = sortByHouseNumber(residentsList || this.getAllResidents());
        const wb = XLSX.utils.book_new();

        const columnDefinitions = [
            { id: 'houseNumber', title: 'House No / ઘર નંબર', get: r => r.houseNumber },
            { id: 'residentStatus', title: 'Resident Type / પ્રકાર', get: r => r.isTenant === 'Yes' ? 'Tenant (ભાડુઆત)' : 'Owner (માલિક)' },
            { id: 'primaryName', title: 'Primary Resident / મુખ્ય રહેવાસી', get: r => r.isTenant === 'Yes' ? `${r.tenantFirstName || ''} ${r.tenantMiddleName || ''} ${r.tenantSurName || ''}`.trim() : `${r.ownerFirstName || ''} ${r.ownerMiddleName || ''} ${r.ownerSurName || ''}`.trim() },
            { id: 'ownerDetails', title: 'Owner Name / માલિકનું નામ', get: r => `${r.ownerFirstName || ''} ${r.ownerMiddleName || ''} ${r.ownerSurName || ''}`.trim() },
            { id: 'tenantDetails', title: 'Tenant Name / ભાડુઆતનું નામ', get: r => r.isTenant === 'Yes' ? `${r.tenantFirstName || ''} ${r.tenantMiddleName || ''} ${r.tenantSurName || ''}`.trim() : '-' },
            { id: 'contact', title: 'Mobile / મોબાઇલ', get: r => r.mobileNumber || '' },
            { id: 'maintenance', title: 'Maintenance / મેન્ટેનન્સ', get: r => r.isMaintenancePaid === 'Yes' ? `Paid (${r.receiptNumber || 'Receipt Yes'})` : 'Unpaid' },
            { id: 'blood', title: 'Blood Group / બ્લડ ગ્રુપ', get: r => r.bloodGroup || '-' },
            { id: 'familyMembers', title: 'Total Family Members / પરિવાર સંખ્યા', get: r => r.familyMembers ? r.familyMembers.length : 0 },
            { id: 'vehicles', title: 'Total Vehicles / વાહનો સંખ્યા', get: r => r.vehicles ? r.vehicles.length : 0 },
            { id: 'interests', title: 'Volunteering Interests / સેવા રસ', get: r => (r.interests || []).join(', ') },
            { id: 'regDate', title: 'Registration Date / નોંધણી તારીખ', get: r => r.registeredAt ? new Date(r.registeredAt).toLocaleDateString() : '' }
        ];

        const activeCols = selectedColumns && selectedColumns.length > 0
            ? columnDefinitions.filter(c => selectedColumns.includes(c.id))
            : columnDefinitions;

        const headers = activeCols.map(c => c.title);
        const rows = [headers];

        residents.forEach(r => {
            rows.push(activeCols.map(c => c.get(r)));
        });

        const ws = XLSX.utils.aoa_to_sheet(rows);
        const colWidths = [];
        rows.forEach(row => {
            row.forEach((cell, idx) => {
                const str = cell !== null && cell !== undefined ? String(cell) : '';
                colWidths[idx] = Math.max(colWidths[idx] || 10, Math.min(str.length + 3, 40));
            });
        });
        ws['!cols'] = colWidths.map(w => ({ wch: w }));

        XLSX.utils.book_append_sheet(wb, ws, 'Custom Report');
        XLSX.writeFile(wb, filename);
    },

    // Download Printable Roster Form with Custom Columns in Excel format (.xlsx)
    downloadPrintableFormExcel(residentsList, standardCols, customCols = [], filename = 'WesternVilla_Printable_Form.xlsx') {
        if (typeof XLSX === 'undefined') {
            alert('Excel library (SheetJS) is not loaded. Please reload or check your connection.');
            return false;
        }

        const residents = sortByHouseNumber(residentsList || this.getAllResidents());
        const wb = XLSX.utils.book_new();

        // 1. Headers
        const headers = ['House No / ઘર નંબર'];
        
        const showOwnerTenant = !standardCols || standardCols.ownerDetails || standardCols.primaryName;
        if (showOwnerTenant) {
            headers.push('Owner & Tenant Details / રહેવાસી & માલિક');
        }
        if (!standardCols || standardCols.contact) {
            headers.push('Mobile Number / મોબાઇલ');
        }
        if (standardCols && standardCols.blood) {
            headers.push('Blood Group / બ્લડ ગ્રુપ');
        }
        if (standardCols && standardCols.familyMembers) {
            headers.push('Family Count / સભ્યો');
        }

        // Add Custom Columns
        (customCols || []).forEach(cc => {
            headers.push(cc.title || 'Custom Column');
        });

        const rows = [headers];

        residents.forEach(r => {
            const row = [r.houseNumber];

            if (showOwnerTenant) {
                const ownerName = `${r.ownerFirstName || ''} ${r.ownerMiddleName || ''} ${r.ownerSurName || ''}`.replace(/\s+/g, ' ').trim();
                if (r.isTenant === 'Yes') {
                    const tenantName = `${r.tenantFirstName || ''} ${r.tenantMiddleName || ''} ${r.tenantSurName || ''}`.replace(/\s+/g, ' ').trim();
                    row.push(`Tenant: ${tenantName} (Owner: ${ownerName})`);
                } else {
                    row.push(`Owner: ${ownerName}`);
                }
            }

            if (!standardCols || standardCols.contact) {
                row.push(r.mobileNumber || '-');
            }

            if (standardCols && standardCols.blood) {
                row.push(r.bloodGroup || '-');
            }

            if (standardCols && standardCols.familyMembers) {
                row.push(r.familyMembers ? r.familyMembers.length : 0);
            }

            // Custom columns filled with default value if set (e.g. 1000), or empty for handwriting / signature
            (customCols || []).forEach(cc => {
                const val = (cc.defaultValue !== undefined && cc.defaultValue !== null) ? String(cc.defaultValue) : '';
                row.push(val);
            });

            rows.push(row);
        });

        const ws = XLSX.utils.aoa_to_sheet(rows);

        // Auto column widths
        const colWidths = headers.map((h, idx) => {
            let maxLen = h.length;
            rows.forEach(r => {
                const val = r[idx] ? String(r[idx]) : '';
                if (val.length > maxLen) maxLen = val.length;
            });
            if (idx >= headers.length - (customCols || []).length) {
                maxLen = Math.max(maxLen, 24);
            }
            return { wch: Math.min(Math.max(maxLen + 4, 12), 40) };
        });
        ws['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, 'Printable Form');
        XLSX.writeFile(wb, filename);
        return true;
    },

    /* =========================================================
     * BACKUP SYSTEM
     * ========================================================= */

    getTimestampString() {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const h = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        return `${y}-${m}-${d}_${h}-${min}`;
    },

    downloadBackupExcel() {
        const ts = this.getTimestampString();
        const filename = `WesternVilla_Backup_${ts}.xlsx`;
        return this.downloadExcel(filename);
    },

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
            { id: 'vehiclesCount', title: 'Vehicles Count / વાહનોની સંખ્યા', get: r => (r.vehicles ? r.vehicles.length : 0) },
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

// Export globally for browser and Node environments
if (typeof window !== 'undefined') window.DataStore = DataStore;
if (typeof globalThis !== 'undefined') globalThis.DataStore = DataStore;
if (typeof module !== 'undefined' && module.exports) module.exports = DataStore;
