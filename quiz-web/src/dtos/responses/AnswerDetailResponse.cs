 public class AnswerDetailResponse
{
    public int AnswerId { get; set; } // Bắt buộc phải có ID
    public string Content { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public byte OrderIndex { get; set; } // Lưu dạng số byte như đã tối ưu ở DB
}