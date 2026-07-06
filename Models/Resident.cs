using System.ComponentModel.DataAnnotations;

namespace WesternVilla.Models
{
    public class Resident
    {
        public int Id { get; set; }

        // Owner Details
        [Required(ErrorMessage = "Owner First Name is required / માલિકનું પ્રથમ નામ જરૂરી છે")]
        [Display(Name = "Owner First Name / માલિકનું પ્રથમ નામ")]
        public string OwnerFirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Owner Middle Name is required / માલિકનું મધ્યમ નામ જરૂરી છે")]
        [Display(Name = "Owner Middle Name / માલિકનું મધ્યમ નામ")]
        public string OwnerMiddleName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Owner SurName is required / માલિકની અટક જરૂરી છે")]
        [Display(Name = "Owner SurName / માલિકની અટક")]
        public string OwnerSurName { get; set; } = string.Empty;

        [Range(1, 120, ErrorMessage = "Age must be between 1 and 120 / ઉંમર ૧ થી ૧૨૦ ની વચ્ચે હોવી જોઈએ")]
        [Display(Name = "Age (Optional) / ઉંમર (વૈકલ્પિક)")]
        public int? Age { get; set; }

        [Display(Name = "Occupation Type (Optional) / વ્યવસાય પ્રકાર (વૈકલ્પિક)")]
        public string? OwnerOccupationType { get; set; } // "Study", "Business", "Job", "Housewife", "None"

        [Display(Name = "Occupation / Study Details / વ્યવસાય / અભ્યાસ વિગતો")]
        public string? OwnerOccupationDetails { get; set; }

        // Tenant Details
        [Required(ErrorMessage = "Please specify if there is a tenant / કૃપા કરીને સ્પષ્ટ કરો કે ભાડુઆત છે કે નહીં")]
        [Display(Name = "Is Tenant? / શું ભાડુઆત છે?")]
        public string IsTenant { get; set; } = "No"; // "Yes" or "No"

        [Display(Name = "Tenant First Name / ભાડુઆતનું પ્રથમ નામ")]
        public string? TenantFirstName { get; set; }

        [Display(Name = "Tenant Middle Name / ભાડુઆતનું મધ્યમ નામ")]
        public string? TenantMiddleName { get; set; }

        [Display(Name = "Tenant SurName / ભાડુઆતની અટક")]
        public string? TenantSurName { get; set; }

        [Range(1, 120, ErrorMessage = "Tenant Age must be between 1 and 120 / ભાડુઆતની ઉંમર ૧ થી ૧૨૦ ની વચ્ચે હોવી જોઈએ")]
        [Display(Name = "Tenant Age (Optional) / ભાડુઆતની ઉંમર (વૈકલ્પિક)")]
        public int? TenantAge { get; set; }

        [Display(Name = "Occupation Type (Optional) / વ્યવસાય પ્રકાર (વૈકલ્પિક)")]
        public string? TenantOccupationType { get; set; } // "Study", "Business", "Job", "Housewife", "None"

        [Display(Name = "Occupation / Study Details / વ્યવસાય / અભ્યાસ વિગતો")]
        public string? TenantOccupationDetails { get; set; }

        // Core Address & Contact Info
        [Required(ErrorMessage = "House Number is required / ઘર નંબર જરૂરી છે")]
        [RegularExpression(@"^([1-9]|[1-9][0-9]|1[0-7][0-9]|18[0-1])$", ErrorMessage = "House Number must be between 1 and 181 / ઘર નંબર ૧ થી ૧૮૧ ની વચ્ચે હોવો જોઈએ")]
        [Display(Name = "House Number / ઘર નંબર")]
        public string HouseNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mobile Number is required / મોબાઇલ નંબર જરૂરી છે")]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Mobile Number must be exactly 10 digits / મોબાઇલ નંબર બરાબર ૧૦ અંકનો હોવો જોઈએ")]
        [Display(Name = "Mobile Number / મોબાઇલ નંબર")]
        public string MobileNumber { get; set; } = string.Empty;

        [EmailAddress(ErrorMessage = "Invalid Email Address / અમાન્ય ઇમેઇલ સરનામું")]
        [Display(Name = "Email Address (Optional) / ઇમેઇલ સરનામું (વૈકલ્પિક)")]
        public string? Email { get; set; }

        // Maintenance Details
        [Required(ErrorMessage = "Maintenance Paid status is required / મેન્ટેનન્સ ચુકવણીની સ્થિતિ જરૂરી છે")]
        [Display(Name = "Maintenance Paid? / મેન્ટેનન્સ ચૂકવેલ છે?")]
        public string IsMaintenancePaid { get; set; } = "No"; // "Yes" or "No"

        [Display(Name = "Receipt Received? / રસીદ મળી છે?")]
        public string IsReceiptReceived { get; set; } = "No"; // "Yes" or "No"

        [Display(Name = "Receipt Number / રસીદ નંબર")]
        public string? ReceiptNumber { get; set; }

        // Personal Details
        [Required(ErrorMessage = "Gender is required / લિંગ જરૂરી છે")]
        [Display(Name = "Gender / લિંગ")]
        public string Gender { get; set; } = "Male"; // "Male" or "Female"

        [Display(Name = "Blood Group (Optional) / બ્લડ ગ્રુપ (વૈકલ્પિક)")]
        public string? BloodGroup { get; set; }

        [Display(Name = "Blood Donated? (Optional) / રક્ત દાન કર્યું? (વૈકલ્પિક)")]
        public string? IsBloodDonated { get; set; } // "Yes" or "No"

        // Navigation properties
        public virtual ICollection<FamilyMember> FamilyMembers { get; set; } = new List<FamilyMember>();
        public virtual ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
        public virtual ICollection<ResidentInterest> Interests { get; set; } = new List<ResidentInterest>();
    }
}
