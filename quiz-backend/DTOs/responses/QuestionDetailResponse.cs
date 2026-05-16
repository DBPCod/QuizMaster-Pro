public class QuestionDetailResponse
{
    public int QuestionId { get; set; } // Bắt buộc phải có ID
    public string Content { get; set; } = string.Empty;
    public QuestionType Type { get; set; }
    public decimal Score { get; set; } // Dùng decimal chuẩn Production

    // Danh sách đáp án kèm theo ID
    public List<AnswerDetailResponse> Answers { get; set; } = new();
}