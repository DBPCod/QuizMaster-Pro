namespace QuizBackend.Models
{
    public class Quiz
    {
        public int QuizId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int AccountId { get; set; }

        public Account Account { get; set; } = null!;
    }
}