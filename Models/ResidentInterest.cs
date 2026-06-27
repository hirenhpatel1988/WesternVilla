using System.ComponentModel.DataAnnotations;

namespace WesternVilla.Models
{
    public class ResidentInterest
    {
        public int Id { get; set; }

        [Required]
        public string InterestName { get; set; } = string.Empty;

        // Foreign Key
        public int ResidentId { get; set; }
        public virtual Resident? Resident { get; set; }
    }
}
