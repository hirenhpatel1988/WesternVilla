using System.ComponentModel.DataAnnotations;

namespace WesternVilla.Models
{
    public class FamilyMember
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "First Name is required / પ્રથમ નામ જરૂરી છે")]
        [Display(Name = "First Name / પ્રથમ નામ")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Middle Name is required / મધ્યમ નામ જરૂરી છે")]
        [Display(Name = "Middle Name / મધ્યમ નામ")]
        public string MiddleName { get; set; } = string.Empty;

        [Required(ErrorMessage = "SurName is required / અટક જરૂરી છે")]
        [Display(Name = "SurName / અટક")]
        public string SurName { get; set; } = string.Empty;

        [Range(1, 120, ErrorMessage = "Age must be between 1 and 120 / ઉંમર ૧ થી ૧૨૦ ની વચ્ચે હોવી જોઈએ")]
        [Display(Name = "Age (Optional) / ઉંમર (વૈકલ્પિક)")]
        public int? Age { get; set; }

        [RegularExpression(@"^\d{10}$", ErrorMessage = "Mobile Number must be exactly 10 digits / મોબાઇલ નંબર બરાબર ૧૦ અંકનો હોવો જોઈએ")]
        [Display(Name = "Mobile Number (Optional) / મોબાઇલ નંબર (વૈકલ્પિક)")]
        public string? MobileNumber { get; set; }

        [Display(Name = "Occupation Type (Optional) / વ્યવસાય પ્રકાર (વૈકલ્પિક)")]
        public string? OccupationType { get; set; } // "Study", "Business", "Job", "None"

        [Display(Name = "Occupation / Study Details / વ્યવસાય / અભ્યાસ વિગતો")]
        public string? OccupationDetails { get; set; }

        [Display(Name = "Blood Group (Optional) / બ્લડ ગ્રુપ (વૈકલ્પિક)")]
        public string? BloodGroup { get; set; }

        [Display(Name = "Blood Donated? (Optional) / રક્ત દાન કર્યું? (વૈકલ્પિક)")]
        public string? IsBloodDonated { get; set; } // "Yes" or "No"

        [Display(Name = "Gender (Optional) / લિંગ (વૈકલ્પિક)")]
        public string? Gender { get; set; } // "Male" or "Female"

        [Display(Name = "House Number (Optional) / ઘર નંબર (વૈકલ્પિક)")]
        public string? HouseNumber { get; set; }

        // Foreign Key
        public int ResidentId { get; set; }
        public virtual Resident? Resident { get; set; }
    }
}
