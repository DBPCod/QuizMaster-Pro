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

            modelBuilder.Entity<Question>(entity =>
            {
                entity.ToTable("questions");
                entity.HasKey(q => q.QuestionId);

                entity.Property(q => q.Content).IsRequired().HasMaxLength(4000); ;
                
                // Enum QuestionType
                entity.Property(q => q.Type)
                    .HasMaxLength(50)
                    .HasConversion<string>();

                entity.Property(q => q.Score).HasPrecision(5, 2); // Chính xác hơn cho điểm số

                entity.HasOne(q => q.Quiz)
                    .WithMany(quiz => quiz.Questions)
                    .HasForeignKey(q => q.QuizId);
            });

            modelBuilder.Entity<Answer>(entity =>
            {
                entity.ToTable("answers");
                entity.HasKey(a => a.AnswerId);

                entity.Property(a => a.Content).IsRequired().HasMaxLength(500);
                
                // OrderIndex dùng tinyint (1 byte) cực kỳ tốt cho TiDB
                entity.Property(a => a.OrderIndex)
                    .IsRequired()
                    .HasColumnType("tinyint");;

                entity.Property(a => a.IsCorrect).IsRequired(); // TiDB/MySQL dùng bit cho bool

                entity.HasOne(a => a.Question)
                    .WithMany(q => q.Answers)
                    .HasForeignKey(a => a.QuestionId);
            });

        }
        public DbSet<Account> Accounts {get; set;}
        public DbSet<Quiz> Quizzes {get; set;}

        public DbSet<Question> Questions {get; set;}
        public DbSet<Answer> Answers {get; set;}
        
    }
}
