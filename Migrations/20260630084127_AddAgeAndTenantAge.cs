using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WesternVilla.Migrations
{
    /// <inheritdoc />
    public partial class AddAgeAndTenantAge : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "Residents",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TenantAge",
                table: "Residents",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Age",
                table: "Residents");

            migrationBuilder.DropColumn(
                name: "TenantAge",
                table: "Residents");
        }
    }
}
