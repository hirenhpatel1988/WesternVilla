/**
 * WesternVilla Static Data Store
 * Manages local storage persistence, duplicate validations, CSV import/export with UTF-8 BOM.
 */

const STORAGE_KEY = 'western_villa_residents_db_v1';
const MAX_HOUSE_NUMBER = 181;
const CONTACT_PERSON = 'Hiren Patel - Home 13';
const CONTACT_PHONE = '9876543210';

// Default initial seed data (House 101, 102, 103)
const DEFAULT_SEED_DATA = [
    {
        id: 1,
        houseNumber: '101',
        ownerFirstName: 'Ramesh',
        ownerMiddleName: 'Kanti',
        ownerSurName: 'Patel',
        age: 48,
        gender: 'Male',
        ownerOccupationType: 'Business',
        ownerOccupationDetails: 'Patel Electronics',
        isTenant: 'No',
        tenantFirstName: '',
        tenantMiddleName: '',
        tenantSurName: '',
        tenantAge: null,
        tenantOccupationType: 'None',
        tenantOccupationDetails: '',
        mobileNumber: '9876543210',
        email: 'ramesh.patel@gmail.com',
        isMaintenancePaid: 'Yes',
        isReceiptReceived: 'Yes',
        receiptNumber: 'REC-101',
        bloodGroup: 'B+',
        isBloodDonated: 'Yes',
        familyMembers: [
            {
                firstName: 'Kokila',
                middleName: 'Ramesh',
                surName: 'Patel',
                age: 45,
                gender: 'Female',
                mobileNumber: '9876543211',
                occupationType: 'Housewife',
                occupationDetails: '',
                bloodGroup: 'O+',
                isBloodDonated: 'No'
            },
            {
                firstName: 'Hardik',
                middleName: 'Ramesh',
                surName: 'Patel',
                age: 21,
                gender: 'Male',
                mobileNumber: '9876543212',
                occupationType: 'Study',
                occupationDetails: 'LD College of Engineering',
                bloodGroup: 'B+',
                isBloodDonated: 'Yes'
            }
        ],
        vehicles: [
            { vehicleType: 'Four', fuelType: 'Petrol', vehicleNumber: 'GJ-01-AA-9999' },
            { vehicleType: 'Two', fuelType: 'Electric', vehicleNumber: 'GJ-01-EE-1111' }
        ],
        interests: [
            'Social Events / સામાજિક કાર્યક્રમો',
            'Sport Activities / રમતગમત પ્રવૃત્તિઓ',
            'Cleanliness Drive / સ્વચ્છતા અભિયાન'
        ],
        registeredAt: '2026-09-01T10:30:00Z'
    },
    {
        id: 2,
        houseNumber: '102',
        ownerFirstName: 'Suresh',
        ownerMiddleName: 'Bhai',
        ownerSurName: 'Shah',
        age: 55,
        gender: 'Male',
        ownerOccupationType: 'None',
        ownerOccupationDetails: '',
        isTenant: 'Yes',
        tenantFirstName: 'Jignesh',
        tenantMiddleName: 'Harish',
        tenantSurName: 'Mehta',
        tenantAge: 38,
        tenantOccupationType: 'Job',
        tenantOccupationDetails: 'Software Engineer',
        mobileNumber: '9822334455',
        email: 'jignesh.mehta@yahoo.com',
        isMaintenancePaid: 'Yes',
        isReceiptReceived: 'No',
        receiptNumber: '',
        bloodGroup: 'A+',
        isBloodDonated: 'No',
        familyMembers: [
            {
                firstName: 'Priti',
                middleName: 'Jignesh',
                surName: 'Mehta',
                age: 36,
                gender: 'Female',
                mobileNumber: '9822334456',
                occupationType: 'Business',
                occupationDetails: 'Mehta Boutique',
                bloodGroup: 'A+',
                isBloodDonated: 'No'
            }
        ],
        vehicles: [
            { vehicleType: 'Two', fuelType: 'Petrol', vehicleNumber: 'GJ-01-XX-5555' }
        ],
        interests: [
            'Cultural Programs / સાંસ્કૃતિક કાર્યક્રમો',
            'Security & Safety / સુરક્ષા અને સલામતી'
        ],
        registeredAt: '2026-09-02T14:15:00Z'
    },
    {
        id: 3,
        houseNumber: '103',
        ownerFirstName: 'Amit',
        ownerMiddleName: 'R.',
        ownerSurName: 'Sharma',
        age: 42,
        gender: 'Male',
        ownerOccupationType: 'Job',
        ownerOccupationDetails: 'Bank Manager',
        isTenant: 'No',
        tenantFirstName: '',
        tenantMiddleName: '',
        tenantSurName: '',
        tenantAge: null,
        tenantOccupationType: 'None',
        tenantOccupationDetails: '',
        mobileNumber: '9988776655',
        email: 'amit.sharma@outlook.com',
        isMaintenancePaid: 'No',
        isReceiptReceived: 'No',
        receiptNumber: '',
        bloodGroup: 'AB+',
        isBloodDonated: 'No',
        familyMembers: [],
        vehicles: [
            { vehicleType: 'Four', fuelType: 'Diesel', vehicleNumber: 'GJ-01-ZZ-7788' }
        ],
        interests: [
            'Gardening & Greenery / બાગકામ અને હરિયાળી'
        ],
        registeredAt: '2026-09-03T09:00:00Z'
    }
];

const DataStore = {
    CONTACT_PERSON: CONTACT_PERSON,
    CONTACT_PHONE: CONTACT_PHONE,
    MAX_HOUSE_NUMBER: MAX_HOUSE_NUMBER,

    // Initialize local storage with seed data if not present
    init() {
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DATA));
        }
    },

    // Get all residents sorted by house number ascending
    getAllResidents() {
        this.init();
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const list = raw ? JSON.parse(raw) : [];
            return list.sort((a, b) => {
                const numA = parseInt(a.houseNumber, 10) || 0;
                const numB = parseInt(b.houseNumber, 10) || 0;
                return numA - numB;
            });
        } catch (e) {
            console.error('Error loading residents:', e);
            return [];
        }
    },

    // Check if house number is already registered (excluding optional currentId for edits)
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

    // Save or update resident with duplicate validation
    saveResident(resident) {
        this.init();
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

        // Assign ID if new
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

        localStorage.setItem(STORAGE_KEY, JSON.stringify(residents));
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return true;
    },

    // Reset database to default initial seeds
    resetToDefault() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DATA));
        return DEFAULT_SEED_DATA;
    },

    // Clear all data
    clearAll() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        return [];
    },

    /* =========================================================
     * CSV GENERATION & PARSING (RFC 4180 with UTF-8 BOM)
     * ========================================================= */

    // RFC 4180 CSV cell escaper
    escapeCsvCell(value) {
        if (value === null || value === undefined) return '""';
        let str = String(value);
        if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
            str = str.replace(/"/g, '""');
            return `"${str}"`;
        }
        return `"${str}"`;
    },

    // Generate CSV string from residents list
    generateCSV(residentsList = null, selectedColumns = null) {
        const list = residentsList || this.getAllResidents();

        // Default all columns
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

        // Filter columns if specified
        const activeColumns = selectedColumns && selectedColumns.length > 0
            ? allColumns.filter(col => selectedColumns.includes(col.id))
            : allColumns;

        // Build header
        const headerRow = activeColumns.map(c => this.escapeCsvCell(c.title)).join(',');

        // Build data rows
        const dataRows = list.map(resident => {
            return activeColumns.map(col => this.escapeCsvCell(col.get(resident))).join(',');
        });

        // Add UTF-8 BOM (\uFEFF) at start so Excel parses Gujarati unicode properly
        return '\uFEFF' + [headerRow, ...dataRows].join('\r\n');
    },

    // Trigger browser download of CSV
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

    // Parse simple CSV (RFC 4180 compliant parser)
    parseCSV(text) {
        const rows = [];
        let currentRow = [];
        let currentCell = '';
        let insideQuotes = false;

        // Remove BOM if present
        if (text.charCodeAt(0) === 0xFEFF) {
            text = text.slice(1);
        }

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            if (char === '"') {
                if (insideQuotes && nextChar === '"') {
                    currentCell += '"';
                    i++; // skip escaped quote
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

    // Import residents from uploaded CSV file
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

                    // Header row
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

                        // Check duplicate
                        if (this.isHouseNumberRegistered(houseNo)) {
                            skippedCount++;
                            continue;
                        }

                        // Basic parse
                        const ownerFullName = (ownerNameIdx !== -1 ? row[ownerNameIdx] : '').split(' ');
                        const newResident = {
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
                        };

                        currentResidents.push(newResident);
                        addedCount++;
                    }

                    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentResidents));
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
