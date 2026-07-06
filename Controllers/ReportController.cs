using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClosedXML.Excel;
using System.Text;
using System.IO.Compression;
using WesternVilla.Data;
using WesternVilla.Models;

namespace WesternVilla.Controllers
{
    public class ReportController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ReportController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Report
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var residents = await _context.Residents
                .Include(r => r.FamilyMembers)
                .Include(r => r.Vehicles)
                .Include(r => r.Interests)
                .OrderBy(r => r.HouseNumber)
                .ToListAsync();

            return View(residents);
        }

        // GET: Report/ExportExcel
        [HttpGet]
        public async Task<IActionResult> ExportExcel()
        {
            var residents = await _context.Residents
                .Include(r => r.FamilyMembers)
                .Include(r => r.Vehicles)
                .Include(r => r.Interests)
                .OrderBy(r => r.HouseNumber)
                .ToListAsync();

            using var workbook = new XLWorkbook();

            // Sheet 1: Residents General Info
            var wsResidents = workbook.Worksheets.Add("Residents");
            wsResidents.Cell(1, 1).Value = "House No / ઘર નંબર";
            wsResidents.Cell(1, 2).Value = "Owner Name / માલિકનું નામ";
            wsResidents.Cell(1, 3).Value = "Age / ઉંમર";
            wsResidents.Cell(1, 4).Value = "Gender / લિંગ";
            wsResidents.Cell(1, 5).Value = "Owner Occupation / માલિક વ્યવસાય";
            wsResidents.Cell(1, 6).Value = "Owner Occ. Details / માલિક વ્યવસાય વિગતો";
            wsResidents.Cell(1, 7).Value = "Is Tenant? / શું ભાડુઆત છે?";
            wsResidents.Cell(1, 8).Value = "Tenant Name / ભાડુઆતનું નામ";
            wsResidents.Cell(1, 9).Value = "Tenant Age / ભાડુઆતની ઉંમર";
            wsResidents.Cell(1, 10).Value = "Tenant Occupation / ભાડુઆત વ્યવસાય";
            wsResidents.Cell(1, 11).Value = "Tenant Occ. Details / ભાડુઆત વ્યવસાય વિગતો";
            wsResidents.Cell(1, 12).Value = "Mobile Number / મોબાઇલ નંબર";
            wsResidents.Cell(1, 13).Value = "Email / ઇમેઇલ";
            wsResidents.Cell(1, 14).Value = "Blood Group / બ્લડ ગ્રુપ";
            wsResidents.Cell(1, 15).Value = "Blood Donated? / રક્ત દાન?";
            wsResidents.Cell(1, 16).Value = "Maintenance Paid? / મેન્ટેનન્સ ચૂકવેલ છે?";
            wsResidents.Cell(1, 17).Value = "Receipt Received? / રસીદ મળી છે?";
            wsResidents.Cell(1, 18).Value = "Receipt Number / રસીદ નંબર";
            wsResidents.Cell(1, 19).Value = "Family Size / સભ્યોની સંખ્યા";
            wsResidents.Cell(1, 20).Value = "Vehicles Count / વાહનોની સંખ્યા";
            wsResidents.Cell(1, 21).Value = "Interests / રસના ક્ષેત્રો";

            // Format Header
            var headerStyle = wsResidents.Row(1).Style;
            headerStyle.Font.Bold = true;
            headerStyle.Fill.BackgroundColor = XLColor.FromHtml("#1E3A8A");
            headerStyle.Font.FontColor = XLColor.White;

            int row = 2;
            foreach (var r in residents)
            {
                wsResidents.Cell(row, 1).Value = r.HouseNumber;
                wsResidents.Cell(row, 2).Value = $"{r.OwnerFirstName} {r.OwnerMiddleName} {r.OwnerSurName}";
                wsResidents.Cell(row, 3).Value = r.Age;
                wsResidents.Cell(row, 4).Value = r.Gender ?? "-";
                wsResidents.Cell(row, 5).Value = r.OwnerOccupationType ?? "-";
                wsResidents.Cell(row, 6).Value = r.OwnerOccupationDetails ?? "-";
                wsResidents.Cell(row, 7).Value = r.IsTenant;
                wsResidents.Cell(row, 8).Value = r.IsTenant == "Yes" ? $"{r.TenantFirstName} {r.TenantMiddleName} {r.TenantSurName}" : "-";
                wsResidents.Cell(row, 9).Value = r.TenantAge;
                wsResidents.Cell(row, 10).Value = r.TenantOccupationType ?? "-";
                wsResidents.Cell(row, 11).Value = r.TenantOccupationDetails ?? "-";
                wsResidents.Cell(row, 12).Value = r.MobileNumber;
                wsResidents.Cell(row, 13).Value = r.Email ?? "-";
                wsResidents.Cell(row, 14).Value = r.BloodGroup ?? "-";
                wsResidents.Cell(row, 15).Value = r.IsBloodDonated ?? "-";
                wsResidents.Cell(row, 16).Value = r.IsMaintenancePaid;
                wsResidents.Cell(row, 17).Value = r.IsReceiptReceived;
                wsResidents.Cell(row, 18).Value = r.ReceiptNumber ?? "-";
                wsResidents.Cell(row, 19).Value = r.FamilyMembers.Count;
                wsResidents.Cell(row, 20).Value = r.Vehicles.Count;
                wsResidents.Cell(row, 21).Value = string.Join(", ", r.Interests.Select(i => i.InterestName));
                row++;
            }
            wsResidents.Columns().AdjustToContents();

            // Sheet 2: Family Members Detailed List
            var wsFamily = workbook.Worksheets.Add("Family Members");
            wsFamily.Cell(1, 1).Value = "House No / ઘર નંબર";
            wsFamily.Cell(1, 2).Value = "Resident (Owner/Tenant)";
            wsFamily.Cell(1, 3).Value = "Member Name / સભ્યનું નામ";
            wsFamily.Cell(1, 4).Value = "Gender / લિંગ";
            wsFamily.Cell(1, 5).Value = "Age / ઉંમર";
            wsFamily.Cell(1, 6).Value = "Mobile Number / મોબાઇલ નંબર";
            wsFamily.Cell(1, 7).Value = "Occupation Type / વ્યવસાય પ્રકાર";
            wsFamily.Cell(1, 8).Value = "Occupation Details / વ્યવસાય વિગતો";
            wsFamily.Cell(1, 9).Value = "Blood Group / બ્લડ ગ્રુપ";
            wsFamily.Cell(1, 10).Value = "Blood Donated? / રક્ત દાન?";

            var fHeaderStyle = wsFamily.Row(1).Style;
            fHeaderStyle.Font.Bold = true;
            fHeaderStyle.Fill.BackgroundColor = XLColor.FromHtml("#0D9488");
            fHeaderStyle.Font.FontColor = XLColor.White;

            int fRow = 2;
            foreach (var r in residents)
            {
                string residentName = r.IsTenant == "Yes"
                    ? $"{r.TenantFirstName} {r.TenantSurName} (Tenant / ભાડુઆત)"
                    : $"{r.OwnerFirstName} {r.OwnerSurName} (Owner / માલિક)";

                foreach (var fm in r.FamilyMembers)
                {
                    wsFamily.Cell(fRow, 1).Value = r.HouseNumber;
                    wsFamily.Cell(fRow, 2).Value = residentName;
                    wsFamily.Cell(fRow, 3).Value = $"{fm.FirstName} {fm.MiddleName} {fm.SurName}";
                    wsFamily.Cell(fRow, 4).Value = fm.Gender ?? "-";
                    wsFamily.Cell(fRow, 5).Value = fm.Age;
                    wsFamily.Cell(fRow, 6).Value = fm.MobileNumber ?? "-";
                    wsFamily.Cell(fRow, 7).Value = fm.OccupationType ?? "-";
                    wsFamily.Cell(fRow, 8).Value = fm.OccupationDetails ?? "-";
                    wsFamily.Cell(fRow, 9).Value = fm.BloodGroup ?? "-";
                    wsFamily.Cell(fRow, 10).Value = fm.IsBloodDonated ?? "-";
                    fRow++;
                }
            }
            wsFamily.Columns().AdjustToContents();

            // Sheet 3: Vehicles Detailed List
            var wsVehicles = workbook.Worksheets.Add("Vehicles");
            wsVehicles.Cell(1, 1).Value = "House No / ઘર નંબર";
            wsVehicles.Cell(1, 2).Value = "Resident (Owner/Tenant)";
            wsVehicles.Cell(1, 3).Value = "Vehicle Type / વાહનનો પ્રકાર";
            wsVehicles.Cell(1, 4).Value = "Fuel Type / બળતણ પ્રકાર";
            wsVehicles.Cell(1, 5).Value = "Vehicle Number / વાહન નંબર";

            var vHeaderStyle = wsVehicles.Row(1).Style;
            vHeaderStyle.Font.Bold = true;
            vHeaderStyle.Fill.BackgroundColor = XLColor.FromHtml("#B45309");
            vHeaderStyle.Font.FontColor = XLColor.White;

            int vRow = 2;
            foreach (var r in residents)
            {
                string residentName = r.IsTenant == "Yes"
                    ? $"{r.TenantFirstName} {r.TenantSurName} (Tenant / ભાડુઆત)"
                    : $"{r.OwnerFirstName} {r.OwnerSurName} (Owner / માલિક)";

                foreach (var v in r.Vehicles)
                {
                    wsVehicles.Cell(vRow, 1).Value = r.HouseNumber;
                    wsVehicles.Cell(vRow, 2).Value = residentName;
                    wsVehicles.Cell(vRow, 3).Value = v.VehicleType == "Two" ? "2 Wheeler / ૨ વ્હીલર" : "4 Wheeler / ૪ વ્હીલર";
                    wsVehicles.Cell(vRow, 4).Value = v.FuelType;
                    wsVehicles.Cell(vRow, 5).Value = v.VehicleNumber ?? "-";
                    vRow++;
                }
            }
            wsVehicles.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            var content = stream.ToArray();
            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "WesternVilla_Society_Report.xlsx");
        }

        // GET: Report/DownloadWord/{id}
        [HttpGet]
        public async Task<IActionResult> DownloadWord(int id)
        {
            var r = await _context.Residents
                .Include(res => res.FamilyMembers)
                .Include(res => res.Vehicles)
                .Include(res => res.Interests)
                .FirstOrDefaultAsync(res => res.Id == id);

            if (r == null)
            {
                return NotFound();
            }

            var html = GenerateWordHtml(r);
            var fileName = $"Home_Profile_House_{r.HouseNumber}.doc";
            var bytes = Encoding.UTF8.GetBytes(html);
            return File(bytes, "application/msword", fileName);
        }

        // GET: Report/DownloadAllWord
        [HttpGet]
        public async Task<IActionResult> DownloadAllWord()
        {
            var residents = await _context.Residents
                .Include(r => r.FamilyMembers)
                .Include(r => r.Vehicles)
                .Include(r => r.Interests)
                .OrderBy(r => r.HouseNumber)
                .ToListAsync();

            using var memoryStream = new MemoryStream();
            using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
            {
                foreach (var r in residents)
                {
                    var html = GenerateWordHtml(r);
                    var entry = archive.CreateEntry($"Home_Profile_House_{r.HouseNumber}.doc");
                    using var entryStream = entry.Open();
                    var bytes = Encoding.UTF8.GetBytes(html);
                    entryStream.Write(bytes, 0, bytes.Length);
                }
            }

            memoryStream.Position = 0;
            return File(memoryStream.ToArray(), "application/zip", "WesternVilla_AllHomes_WordFiles.zip");
        }

        // Helper: Generate Word HTML for a single resident
        private string GenerateWordHtml(Resident r)
        {
            var html = new StringBuilder();

            html.Append("<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>");
            html.Append("<head><title>Western Villa Home Profile</title>");
            html.Append("<style>");
            html.Append("body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11.5pt; color: #333333; line-height: 1.5; padding: 20px; }");
            html.Append(".header { text-align: center; border-bottom: 3px double #1E3A8A; padding-bottom: 10px; margin-bottom: 20px; }");
            html.Append(".title { font-size: 20pt; font-weight: bold; color: #1E3A8A; margin: 0; }");
            html.Append(".subtitle { font-size: 11pt; color: #6B7280; font-style: italic; margin: 5px 0 0 0; }");
            html.Append(".section-title { font-size: 14pt; font-weight: bold; color: #0D9488; border-bottom: 1.5px solid #0D9488; padding-bottom: 3px; margin-top: 25px; margin-bottom: 10px; }");
            html.Append("table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 15px; }");
            html.Append("th { background-color: #F3F4F6; text-align: left; padding: 8px 12px; border: 1px solid #D1D5DB; font-weight: bold; color: #374151; width: 30%; }");
            html.Append("td { padding: 8px 12px; border: 1px solid #D1D5DB; }");
            html.Append("table.list-table th { width: auto; background-color: #F3F4F6; color: #374151; font-weight: bold; border: 1px solid #D1D5DB; }");
            html.Append("table.list-table td { border: 1px solid #D1D5DB; }");
            html.Append(".badge { padding: 4px 8px; font-weight: bold; font-size: 9.5pt; border-radius: 4px; display: inline-block; }");
            html.Append(".paid { background-color: #DEF7EC; color: #03543F; }");
            html.Append(".notpaid { background-color: #FDE8E8; color: #9B1C1C; }");
            html.Append("</style>");
            html.Append("</head>");
            html.Append("<body>");

            // Page Header
            html.Append("<div class='header'>");
            html.Append("<div class='title'>WESTERN VILLA SOCIETY</div>");
            html.Append("<div class='subtitle'>Society Community Registration - House Profile / સોસાયટી રજીસ્ટ્રેશન - ઘર પ્રોફાઇલ</div>");
            html.Append("</div>");

            // Basic Details
            html.Append("<div class='section-title'>1. General Info & Owner Details / સામાન્ય માહિતી અને માલિકની વિગતો</div>");
            html.Append("<table>");
            html.Append($"<tr><th>House Number / ઘર નંબર</th><td><b>{r.HouseNumber}</b></td></tr>");
            html.Append($"<tr><th>Owner Name / માલિકનું નામ</th><td>{r.OwnerFirstName} {r.OwnerMiddleName} {r.OwnerSurName}</td></tr>");
            html.Append($"<tr><th>Age / ઉંમર</th><td>{(r.Age.HasValue ? r.Age.ToString() : "-")}</td></tr>");
            html.Append($"<tr><th>Gender / લિંગ</th><td>{r.Gender}</td></tr>");
            html.Append($"<tr><th>Owner Occupation Type / માલિક વ્યવસાય</th><td>{r.OwnerOccupationType ?? "-"}</td></tr>");
            html.Append($"<tr><th>Owner Occupation Details / માલિક વ્યવસાય વિગતો</th><td>{r.OwnerOccupationDetails ?? "-"}</td></tr>");
            html.Append($"<tr><th>Mobile Number / મોબાઇલ નંબર</th><td>{r.MobileNumber}</td></tr>");
            html.Append($"<tr><th>Email / ઇમેઇલ</th><td>{r.Email ?? "-"}</td></tr>");
            html.Append($"<tr><th>Blood Group / બ્લડ ગ્રુપ</th><td>{r.BloodGroup ?? "-"}</td></tr>");
            html.Append($"<tr><th>Blood Donated? / રક્ત દાન?</th><td>{r.IsBloodDonated ?? "-"}</td></tr>");
            html.Append($"<tr><th>Is Rented to Tenant? / શું ભાડે આપેલ છે?</th><td>{r.IsTenant}</td></tr>");
            html.Append("</table>");

            // Tenant Details (if applicable)
            if (r.IsTenant == "Yes")
            {
                html.Append("<div class='section-title'>2. Tenant Details / ભાડુઆતની વિગતો</div>");
                html.Append("<table>");
                html.Append($"<tr><th>Tenant Name / ભાડુઆતનું નામ</th><td>{r.TenantFirstName} {r.TenantMiddleName} {r.TenantSurName}</td></tr>");
                html.Append($"<tr><th>Tenant Age / ભાડુઆતની ઉંમર</th><td>{(r.TenantAge.HasValue ? r.TenantAge.ToString() : "-")}</td></tr>");
                html.Append($"<tr><th>Tenant Occupation Type / ભાડુઆત વ્યવસાય</th><td>{r.TenantOccupationType ?? "-"}</td></tr>");
                html.Append($"<tr><th>Tenant Occupation Details / ભાડુઆત વ્યવસાય વિગતો</th><td>{r.TenantOccupationDetails ?? "-"}</td></tr>");
                html.Append("</table>");
            }

            // Maintenance Status
            html.Append("<div class='section-title'>3. Maintenance Details / મેન્ટેનન્સ વિગતો</div>");
            html.Append("<table>");
            string maintenanceStatus = r.IsMaintenancePaid == "Yes"
                ? "<span class='badge paid'>PAID / ચૂકવેલ</span>"
                : "<span class='badge notpaid'>UNPAID / બાકી</span>";
            html.Append($"<tr><th>Maintenance Status / સ્થિતિ</th><td>{maintenanceStatus}</td></tr>");

            if (r.IsMaintenancePaid == "Yes")
            {
                html.Append($"<tr><th>Receipt Received? / રસીદ મળી?</th><td>{r.IsReceiptReceived}</td></tr>");
                if (r.IsReceiptReceived == "Yes")
                {
                    html.Append($"<tr><th>Receipt Number / રસીદ નંબર</th><td>{r.ReceiptNumber ?? "-"}</td></tr>");
                }
            }
            html.Append("</table>");

            // Family Members
            html.Append("<div class='section-title'>4. Family Members Details / પરિવારના સભ્યોની વિગતો</div>");
            if (r.FamilyMembers != null && r.FamilyMembers.Count > 0)
            {
                html.Append("<table class='list-table'>");
                html.Append("<thead>");
                html.Append("<tr>");
                html.Append("<th>Member Name / નામ</th>");
                html.Append("<th>Gender / લિંગ</th>");
                html.Append("<th>Age / ઉંમર</th>");
                html.Append("<th>Mobile / મોબાઇલ</th>");
                html.Append("<th>Occupation / વ્યવસાય</th>");
                html.Append("<th>Details / વિગત</th>");
                html.Append("<th>Blood Group / લોહીનું જૂથ</th>");
                html.Append("<th>Blood Donated? / રક્ત દાન?</th>");
                html.Append("</tr>");
                html.Append("</thead>");

                foreach (var fm in r.FamilyMembers)
                {
                    html.Append("<tr>");
                    html.Append($"<td>{fm.FirstName} {fm.MiddleName} {fm.SurName}</td>");
                    html.Append($"<td>{fm.Gender ?? "-"}</td>");
                    html.Append($"<td>{(fm.Age.HasValue ? fm.Age.ToString() : "-")}</td>");
                    html.Append($"<td>{(string.IsNullOrWhiteSpace(fm.MobileNumber) ? "-" : fm.MobileNumber)}</td>");
                    html.Append($"<td>{fm.OccupationType ?? "-"}</td>");
                    html.Append($"<td>{(string.IsNullOrWhiteSpace(fm.OccupationDetails) ? "-" : fm.OccupationDetails)}</td>");
                    html.Append($"<td>{fm.BloodGroup ?? "-"}</td>");
                    html.Append($"<td>{fm.IsBloodDonated ?? "-"}</td>");
                    html.Append("</tr>");
                }
                html.Append("</table>");
            }
            else
            {
                html.Append("<p>No family members registered. / કોઈ પરિવારના સભ્યો રજીસ્ટર નથી.</p>");
            }

            // Vehicles Info
            html.Append("<div class='section-title'>5. Vehicles Details / વાહનોની વિગતો</div>");
            if (r.Vehicles != null && r.Vehicles.Count > 0)
            {
                html.Append("<table class='list-table'>");
                html.Append("<thead>");
                html.Append("<tr>");
                html.Append("<th>Vehicle Type / પ્રકાર</th>");
                html.Append("<th>Fuel Type / બળતણ</th>");
                html.Append("<th>Vehicle Number / નંબર</th>");
                html.Append("</tr>");
                html.Append("</thead>");

                foreach (var v in r.Vehicles)
                {
                    html.Append("<tr>");
                    string type = v.VehicleType == "Two" ? "2 Wheeler / ૨-વ્હીલર" : "4 Wheeler / ૪-વ્હીલર";
                    html.Append($"<td>{type}</td>");
                    html.Append($"<td>{v.FuelType}</td>");
                    html.Append($"<td>{v.VehicleNumber ?? "-"}</td>");
                    html.Append("</tr>");
                }
                html.Append("</table>");
            }
            else
            {
                html.Append("<p>No vehicles registered. / કોઈ વાહનો રજીસ્ટર નથી.</p>");
            }

            // Society Interests
            html.Append("<div class='section-title'>6. Society Task Choice of Interest / સોસાયટી કાર્યમાં રસના ક્ષેત્રો</div>");
            if (r.Interests != null && r.Interests.Count > 0)
            {
                html.Append("<ul>");
                foreach (var interest in r.Interests)
                {
                    html.Append($"<li>{interest.InterestName}</li>");
                }
                html.Append("</ul>");
            }
            else
            {
                html.Append("<p>No interests declared. / રસનું કોઈ ક્ષેત્ર પસંદ કરેલ નથી.</p>");
            }

            html.Append("</body>");
            html.Append("</html>");

            return html.ToString();
        }
    }
}
