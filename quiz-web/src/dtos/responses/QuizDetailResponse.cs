public class QuizDetailResponse
{
    public int QuizId { get; set; } // Bắt buộc phải có ID
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CreatorEmail { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    // Danh sách câu hỏi kèm theo ID
    public List<QuestionDetailResponse> Questions { get; set; } = new();
}