using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WesternVilla.Migrations
{
    /// <inheritdoc />
    public partial class AddGenderBloodDonatedHouseNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BloodGroup",
                table: "Residents",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Residents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "IsBloodDonated",
                table: "Residents",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "FamilyMembers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HouseNumber",
                table: "FamilyMembers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IsBloodDonated",
                table: "FamilyMembers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BloodGroup",
                table: "Residents");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Residents");

            migrationBuilder.DropColumn(
                name: "IsBloodDonated",
                table: "Residents");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "FamilyMembers");

            migrationBuilder.DropColumn(
                name: "HouseNumber",
                table: "FamilyMembers");

            migrationBuilder.DropColumn(
                name: "IsBloodDonated",
                table: "FamilyMembers");
        }
    }
}
