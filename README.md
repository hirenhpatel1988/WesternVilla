# WesternVilla

A **Society/Community Registration Management System** for the residential society "Western Villa". Built with ASP.NET Core MVC + Entity Framework Core.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | C# / .NET 10.0 / ASP.NET Core MVC |
| ORM | Entity Framework Core 10.0.9 (SQL Server) |
| Database | SQL Server (`Server=localhost;Database=WesternVilla`) |
| Views | Razor + Bootstrap 5 + Tailwind CSS (CDN) |
| Client Logic | Alpine.js, jQuery, jQuery Validation |
| Excel Export | ClosedXML 0.105.0 |
| Word Export | HTML-based `.doc` generation |

## Project Structure

```
WesternVilla/
├── Controllers/
│   ├── HomeController.cs          # Placeholder (Index, Privacy, Error)
│   ├── RegistrationController.cs  # Main registration form (GET/POST + ThankYou)
│   └── ReportController.cs        # Dashboard, Excel, Word, ZIP export
├── Data/
│   └── ApplicationDbContext.cs    # EF Core context with 4 DbSets
├── Migrations/                    # 3 EF Core migrations applied iteratively
├── Models/
│   ├── Resident.cs                # Main entity (owner/tenant details, contact, maintenance)
│   ├── FamilyMember.cs            # Family member linked to Resident
│   ├── Vehicle.cs                 # Vehicle linked to Resident
│   ├── ResidentInterest.cs        # Interest/society task linked to Resident
│   └── ErrorViewModel.cs
├── Views/
│   ├── Registration/
│   │   ├── Index.cshtml           # Multi-step form (Alpine.js dynamic fields)
│   │   └── ThankYou.cshtml        # Success page
│   ├── Report/
│   │   └── Index.cshtml           # Dashboard with stat cards + export buttons
│   ├── Home/                      # Stock scaffold pages
│   └── Shared/                    # _Layout, Error, ValidationScripts
├── wwwroot/                       # Static assets (Bootstrap, jQuery, site.css)
├── Program.cs                     # Entry point, services, middleware pipeline
├── SeedData.sql                   # Sample data (3 households)
├── ResetAllData.sql               # Wipe all data + reseed
├── SeedInterests.sql              # Seed interest options
├── appsettings.json               # Connection string & logging config
└── WesternVilla.csproj            # Project file (net10.0)
```

## Domain Model

- **Resident** — Main entity: owner name (3 parts), tenant info (conditional), house number (1-181), mobile, email, maintenance status, gender, blood group, blood donated. Has 1-to-many with FamilyMember, Vehicle, and ResidentInterest.
- **FamilyMember** — Name (3 parts), age, mobile, occupation, blood group, gender, blood donated, house number. FK → Resident.
- **Vehicle** — Type (Two/Four wheeler), fuel (Electric/Petrol/Diesel), vehicle number. FK → Resident.
- **ResidentInterest** — Junction linking a resident to an interest name (e.g., "Social Events", "Gardening"). FK → Resident.

## Key Features

1. **Multi-step Registration Form** — Reactive conditional sections via Alpine.js: tenant details, maintenance receipt fields, dynamic add/remove of family members and vehicles, interest checkboxes.
2. **Bilingual (English + Gujarati)** — All labels, validation messages, and reports are in both languages.
3. **Transactional Save** — `BeginTransactionAsync()` with commit/rollback for atomic registration.
4. **Cleanup Before Save** — Strips empty family members/vehicles, clears irrelevant tenant/receipt data, auto-populates house number on family members.
5. **Report Dashboard** — Stats cards (total homes, rented, maintenance paid, vehicles) + mobile/desktop resident list.
6. **Excel Export (ClosedXML)** — Multi-sheet workbook (Residents, Family Members, Vehicles) with styled headers.
7. **Word Export (HTML-based)** — Individual `.doc` files per resident + ZIP bulk download.
8. **Seed Data** — 3 sample households demonstrating owner-occupied, tenant-occupied scenarios.

## Running the App

```bash
dotnet run
```

Default route: `/Registration/Index`

Database must be accessible at `localhost` with trusted connection (see `appsettings.json`). Run migrations or seed scripts to initialize data.
