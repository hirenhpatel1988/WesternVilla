using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WesternVilla.Migrations
{
    /// <inheritdoc />
    public partial class AddOccupationDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OwnerOccupationDetails",
                table: "Residents",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OwnerOccupationType",
                table: "Residents",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TenantOccupationDetails",
                table: "Residents",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TenantOccupationType",
                table: "Residents",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OwnerOccupationDetails",
                table: "Residents");

            migrationBuilder.DropColumn(
                name: "OwnerOccupationType",
                table: "Residents");

            migrationBuilder.DropColumn(
                name: "TenantOccupationDetails",
                table: "Residents");

            migrationBuilder.DropColumn(
                name: "TenantOccupationType",
                table: "Residents");
        }
    }
}
