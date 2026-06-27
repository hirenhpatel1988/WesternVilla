using System.ComponentModel.DataAnnotations;

namespace WesternVilla.Models
{
    public class Vehicle
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Vehicle Type is required / વાહનનો પ્રકાર જરૂરી છે")]
        [Display(Name = "Vehicle Type / વાહનનો પ્રકાર")]
        public string VehicleType { get; set; } = string.Empty; // "Two" or "Four"

        [Required(ErrorMessage = "Fuel Type is required / બળતણનો પ્રકાર જરૂરી છે")]
        [Display(Name = "Fuel Type / બળતણનો પ્રકાર")]
        public string FuelType { get; set; } = string.Empty; // "Electric", "Petrol", "Diesel"

        [Display(Name = "Vehicle Number (Optional) / વાહન નંબર (વૈકલ્પિક)")]
        public string? VehicleNumber { get; set; }

        // Foreign Key
        public int ResidentId { get; set; }
        public virtual Resident? Resident { get; set; }
    }
}
