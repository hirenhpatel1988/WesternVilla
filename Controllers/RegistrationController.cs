using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WesternVilla.Data;
using WesternVilla.Models;

namespace WesternVilla.Controllers
{
    public class RegistrationController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<RegistrationController> _logger;

        public RegistrationController(ApplicationDbContext context, ILogger<RegistrationController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: Registration
        [HttpGet]
        public IActionResult Index()
        {
            // Set up a default model if needed
            var model = new Resident();
            return View(model);
        }

        // POST: Registration/Index
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index(Resident model, string[] selectedInterests)
        {
            // Conditional Validation for Tenant Details
            if (model.IsTenant == "Yes")
            {
                if (string.IsNullOrWhiteSpace(model.TenantFirstName))
                {
                    ModelState.AddModelError(nameof(model.TenantFirstName), "Tenant First Name is required / ભાડુઆતનું પ્રથમ નામ જરૂરી છે");
                }
                if (string.IsNullOrWhiteSpace(model.TenantMiddleName))
                {
                    ModelState.AddModelError(nameof(model.TenantMiddleName), "Tenant Middle Name is required / ભાડુઆતનું મધ્યમ નામ જરૂરી છે");
                }
                if (string.IsNullOrWhiteSpace(model.TenantSurName))
                {
                    ModelState.AddModelError(nameof(model.TenantSurName), "Tenant SurName is required / ભાડુઆતની અટક જરૂરી છે");
                }
            }
            else
            {
                // Clear out tenant details if not a tenant
                model.TenantFirstName = null;
                model.TenantMiddleName = null;
                model.TenantSurName = null;
            }

            // Conditional cleanup for Maintenance Receipt
            if (model.IsMaintenancePaid == "No")
            {
                model.IsReceiptReceived = "No";
                model.ReceiptNumber = null;
            }
            else if (model.IsReceiptReceived == "No")
            {
                model.ReceiptNumber = null;
            }

            // Clean up empty objects added during client-side binding if any
            if (model.FamilyMembers != null)
            {
                var validMembers = model.FamilyMembers.Where(f => !string.IsNullOrWhiteSpace(f.FirstName) && !string.IsNullOrWhiteSpace(f.SurName)).ToList();
                model.FamilyMembers.Clear();
                foreach (var member in validMembers)
                {
                    model.FamilyMembers.Add(member);
                }
            }

            if (model.Vehicles != null)
            {
                var validVehicles = model.Vehicles.Where(v => !string.IsNullOrWhiteSpace(v.VehicleType)).ToList();
                model.Vehicles.Clear();
                foreach (var vehicle in validVehicles)
                {
                    model.Vehicles.Add(vehicle);
                }
            }

            // Auto-populate HouseNumber for all family members from the resident's HouseNumber
            if (model.FamilyMembers != null)
            {
                foreach (var member in model.FamilyMembers)
                {
                    member.HouseNumber = model.HouseNumber;
                }
            }

            if (ModelState.IsValid)
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    // Map selected interests
                    if (selectedInterests != null && selectedInterests.Length > 0)
                    {
                        model.Interests.Clear();
                        foreach (var interestName in selectedInterests)
                        {
                            model.Interests.Add(new ResidentInterest
                            {
                                InterestName = interestName
                            });
                        }
                    }

                    _context.Residents.Add(model);
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    TempData["SuccessMessage"] = "Community Registration Successful! / સોસાયટી રજીસ્ટ્રેશન સફળતાપૂર્વક પૂર્ણ થયું!";
                    return RedirectToAction(nameof(ThankYou));
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "Error occurred while saving society community registration.");
                    ModelState.AddModelError(string.Empty, "An error occurred while saving details. Please try again. / વિગતો સાચવતી વખતે ભૂલ આવી. કૃપા કરીને ફરી પ્રયાસ કરો.");
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        // GET: Registration/ThankYou
        [HttpGet]
        public IActionResult ThankYou()
        {
            return View();
        }
    }
}
