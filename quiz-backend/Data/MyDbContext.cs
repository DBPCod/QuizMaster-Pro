using Microsoft.EntityFrameworkCore;
using QuizBackend.Models;

namespace QuizBackend.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options)
            : base(options)
        {}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Account>(entity =>
            {
                // 1. Khai báo Primary Key
                entity.HasKey(e => e.AccountId);

                // 2. Cấu hình Email: Bắt buộc, độ dài 150 và phải là DUY NHẤT (Unique)
                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(150)
                    .IsUnicode(false);
                
                entity.HasIndex(e => e.Email)
                    .IsUnique(); // Ngăn chặn đăng ký trùng Email ở mức Database

                // 3. Cấu hình PasswordHash
                entity.Property(e => e.PasswordHash)
                    .IsRequired();

                // 4. Cấu hình Role: Chuyển Enum thành String khi lưu vào DB (ví dụ: "User", "Admin")
                // Giúp bạn xem trực tiếp trong DB dễ hiểu hơn là lưu số 0, 1, 2...
                entity.Property(e => e.Role)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasConversion(
                        r => r.ToString(),
                        r => (Role)Enum.Parse(typeof(Role), r)
                    );

                // 5. Cấu hình các thuộc tính mặc định
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP(6)");

                entity.Property(e => e.IsActive)
                    .HasDefaultValue(true);
                entity.Property(e => e.IsDelete)
                    .HasDefaultValue(false);
                
                entity.Property(e => e.DeletedAt)
                    .IsRequired(false);
            });
            
            modelBuilder.Entity<Quiz>(entity =>
            {
                // 1. Khai báo Primary Key
                entity.HasKey(q => q.QuizId);

                // 2. Cấu hình Title: Bắt buộc, tối đa 200 ký tự
                entity.Property(q => q.Title)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(q => q.Description)
                    .IsRequired(false) 
                    .HasMaxLength(1000);

                entity.Property(q => q.CreatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP(6)");

                entity.HasOne(q => q.Account)
                    .WithMany(a => a.Quizzes)
                    .HasForeignKey(q => q.AccountId)
                    .OnDelete(DeleteBehavior.Cascade); // Khi xóa Account sẽ xóa luôn các Quiz liên quan
            });
        }
        public DbSet<Account> Accounts {get; set;}
        public DbSet<Quiz> Quizzes {get; set;}
    }
}
