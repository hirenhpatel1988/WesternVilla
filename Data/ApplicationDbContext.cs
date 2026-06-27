using Microsoft.EntityFrameworkCore;
using WesternVilla.Models;

namespace WesternVilla.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Resident> Residents { get; set; }
        public DbSet<FamilyMember> FamilyMembers { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<ResidentInterest> ResidentInterests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure One-to-Many: Resident -> FamilyMembers
            modelBuilder.Entity<FamilyMember>()
                .HasOne(f => f.Resident)
                .WithMany(r => r.FamilyMembers)
                .HasForeignKey(f => f.ResidentId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure One-to-Many: Resident -> Vehicles
            modelBuilder.Entity<Vehicle>()
                .HasOne(v => v.Resident)
                .WithMany(r => r.Vehicles)
                .HasForeignKey(v => v.ResidentId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure One-to-Many: Resident -> Interests
            modelBuilder.Entity<ResidentInterest>()
                .HasOne(i => i.Resident)
                .WithMany(r => r.Interests)
                .HasForeignKey(i => i.ResidentId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
