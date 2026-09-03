# WesternVilla — Society Community Registration & Reporting System

A bilingual (**English + Gujarati**) Society Registration Management System for the residential society **"Western Villa"** (Houses 1 to 181).

This application runs as a **100% standalone static website** ready to be hosted **freely on GitHub Pages, GitLab Pages, or any static host**, and can also be opened directly in any browser by double-clicking `index.html`.

---

## 🌟 Key Features

1. **Direct-Fill Registration (`index.html`)**:
   - The home page opens directly into the clean, bilingual registration form.
   - Reactive Alpine.js dynamic fields for family members and vehicles.
   - Dynamic surname inheritance for family members based on owner/tenant surname.
   - Conditional tenant sections and maintenance receipt fields.

2. **Strict Duplicate House Number Prevention**:
   - Houses are numbered 1 to 181.
   - If a user tries to enter a house number that has already been registered, the form immediately blocks submission and displays:
     > **"House No. [X] is already registered! Duplicate submissions are not allowed. Please contact Hiren Patel - Home 13 (Mobile: 9876543210) for any help or updates. / ઘર નંબર [X] ની વિગત પહેલેથી ઉમેરાયેલ છે! ફરીથી નોંધણી માન્ય નથી. સહાય અથવા સુધારા માટે કૃપા કરીને હિરેન પટેલ - ઘર ૧૩ નો સંપર્ક કરો."**

3. **Robust CSV Management (`data-store.js`)**:
   - **Persistent Storage**: Data automatically persists across browser refreshes using `localStorage`.
   - **RFC 4180 Compliant**: Proper handling of commas, multi-line values, and escaped quotes.
   - **UTF-8 BOM (`\uFEFF`)**: Formatted specifically so Microsoft Excel on Windows renders Gujarati text accurately without mojibake.
   - **One-Click Export**: Download the entire resident database or selected custom columns to CSV anytime.
   - **CSV Import / Restore**: Upload an existing CSV file at any time to restore, migrate, or merge records.

4. **Customizable A4 Printable Report Page (`report.html`)**:
   - **Checkbox Column Selector**: Choose exactly which columns to include in the generated report (House No, Resident Type, Owner Info, Tenant Info, Contact, Maintenance, Blood Group, Family Members, Vehicles, Society Task Interests).
   - **Quick Presets**: Single click to switch between "All Columns", "Society Phonebook", "Maintenance Audit", "Vehicle Parking Roster", and "Volunteer Committee".
   - **Search & Filters**: Real-time filtering by House Number, Name, Mobile, Occupancy (Owner vs Tenant), and Maintenance status (Paid vs Unpaid).
   - **A4 Printable Support**: Engineered with CSS `@media print` rules specifically for **A4 Paper**:
     - Standard A4 page sizing (`@page { size: A4 portrait; margin: 12mm 10mm; }`).
     - Includes formal society letterhead header, generation date/time, and active filter summary.
     - Hides all web controls, navigation, and search bars automatically on print.
     - Avoids breaks inside table rows (`page-break-inside: avoid`).

---

## 🚀 Free Static Publishing on GitHub Pages

You can publish this website for free in under 1 minute:

1. **Push this repository to GitHub**:
   ```bash
   git add .
   git commit -m "Add static website with CSV management and A4 print reports"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Open your GitHub repository in your browser.
   - Go to **Settings** &rarr; **Pages** (in the left sidebar).
   - Under **Build and deployment** &rarr; **Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` (or `master`) and folder `/ (root)`, then click **Save**.

3. **Access Your Live Site**:
   - Within 1–2 minutes, GitHub will give you a live URL:
     ```
     https://<your-username>.github.io/<repository-name>/
     ```

---

## 🔗 Application URLs

| Page | Relative URL | Description |
|------|-------------|-------------|
| **Registration Form** | [`index.html`](./index.html) | Direct fill registration form with real-time duplicate check |
| **Custom Reports & A4 Print** | [`report.html`](./report.html) | Customizable column checkboxes, filters, A4 print layout, CSV export/import |
| **Submission Thank You** | [`thankyou.html`](./thankyou.html) | Confirmation page with instant CSV download and report links |
| **Seed CSV Template** | [`data/western_villa_seed.csv`](./data/western_villa_seed.csv) | Reference CSV file pre-populated with sample houses 101, 102, 103 |

---

## 💻 Running Locally (Offline)

Simply double-click [`index.html`](./index.html) in your file explorer to open it in Chrome, Edge, Firefox, or Safari. No local web server or internet connection is required.

Alternatively, if you prefer a local HTTP server:
```bash
# Using Python
python -m http.server 8000

# Or using npx
npx serve .
```
Then visit `http://localhost:8000`.

---

## 🗂️ Project Structure

```
WesternVilla/
├── index.html                   # Main registration form (bilingual direct fill)
├── report.html                  # Dashboard & customizable A4 printable report
├── thankyou.html                # Submission success confirmation page
├── .nojekyll                    # Disables Jekyll processing on GitHub Pages
├── js/
│   └── data-store.js            # LocalStorage engine, CSV parser/generator with UTF-8 BOM
├── css/
│   └── custom.css               # A4 print media stylesheet and typography
├── data/
│   └── western_villa_seed.csv   # Pre-populated reference CSV file
└── README.md                    # System documentation
```

---

## 📞 Society Contact & Support
For duplicate entries, updates, or technical assistance:
- **Contact**: Hiren Patel - Home 13
- **Mobile**: `+91 9876543210`
