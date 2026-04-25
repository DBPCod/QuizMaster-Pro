using Microsoft.EntityFrameworkCore;

namespace QuizBackend.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options)
            : base(options)
        {}
        public DbSet<Account> Accounts {get; set;}
    }
}
