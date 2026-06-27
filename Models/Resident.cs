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

        // Core Address & Contact Info
        [Required(ErrorMessage = "House Number is required / ઘર નંબર જરૂરી છે")]
        [RegularExpression(@"^\d{3}$", ErrorMessage = "House Number must be exactly 3 digits / ઘર નંબર બરાબર ૩ અંકનો હોવો જોઈએ")]
        [Display(Name = "House Number / ઘર નંબર")]
        public string HouseNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mobile Number is required / મોબાઇલ નંબર જરૂરી છે")]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Mobile Number must be exactly 10 digits / મોબાઇલ નંબર બરાબર ૧૦ અંકનો હોવો જોઈએ")]
        [Display(Name = "Mobile Number / મોબાઇલ નંબર")]
        public string MobileNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email Address is required / ઇમેઇલ સરનામું જરૂરી છે")]
        [EmailAddress(ErrorMessage = "Invalid Email Address / અમાન્ય ઇમેઇલ સરનામું")]
        [Display(Name = "Email Address / ઇમેઇલ સરનામું")]
        public string Email { get; set; } = string.Empty;

        // Maintenance Details
        [Required(ErrorMessage = "Maintenance Paid status is required / મેન્ટેનન્સ ચુકવણીની સ્થિતિ જરૂરી છે")]
        [Display(Name = "Maintenance Paid? / મેન્ટેનન્સ ચૂકવેલ છે?")]
        public string IsMaintenancePaid { get; set; } = "No"; // "Yes" or "No"

        [Display(Name = "Receipt Received? / રસીદ મળી છે?")]
        public string IsReceiptReceived { get; set; } = "No"; // "Yes" or "No"

        [Display(Name = "Receipt Number / રસીદ નંબર")]
        public string? ReceiptNumber { get; set; }

        // Navigation properties
        public virtual ICollection<FamilyMember> FamilyMembers { get; set; } = new List<FamilyMember>();
        public virtual ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
        public virtual ICollection<ResidentInterest> Interests { get; set; } = new List<ResidentInterest>();
    }
}
