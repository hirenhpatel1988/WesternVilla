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

        [Required(ErrorMessage = "Age is required / ઉંમર જરૂરી છે")]
        [Range(1, 120, ErrorMessage = "Age must be between 1 and 120 / ઉંમર ૧ થી ૧૨૦ ની વચ્ચે હોવી જોઈએ")]
        [Display(Name = "Age / ઉંમર")]
        public int Age { get; set; }

        [RegularExpression(@"^\d{10}$", ErrorMessage = "Mobile Number must be exactly 10 digits / મોબાઇલ નંબર બરાબર ૧૦ અંકનો હોવો જોઈએ")]
        [Display(Name = "Mobile Number (Optional) / મોબાઇલ નંબર (વૈકલ્પિક)")]
        public string? MobileNumber { get; set; }

        [Required(ErrorMessage = "Occupation Type is required / વ્યવસાય પ્રકાર જરૂરી છે")]
        [Display(Name = "Occupation Type / વ્યવસાય પ્રકાર")]
        public string OccupationType { get; set; } = string.Empty; // "Study", "Business", "Job", "None"

        [Display(Name = "Occupation / Study Details / વ્યવસાય / અભ્યાસ વિગતો")]
        public string? OccupationDetails { get; set; }

        [Required(ErrorMessage = "Blood Group is required / બ્લડ ગ્રુપ જરૂરી છે")]
        [Display(Name = "Blood Group / બ્લડ ગ્રુપ")]
        public string BloodGroup { get; set; } = string.Empty;

        // Foreign Key
        public int ResidentId { get; set; }
        public virtual Resident? Resident { get; set; }
    }
}
