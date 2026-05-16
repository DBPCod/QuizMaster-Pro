using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace quiz_backend.Migrations
{
    /// <inheritdoc />
    public partial class _16_05_2026 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Quizzes",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Quizzes");
        }
    }
}
