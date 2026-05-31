public class GetQuizzesResponse
{
    public int QuizId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty; // Nên có thêm mô tả ngắn
    
    // Thuộc tính số lượng câu hỏi mà bạn cần
    public int TotalQuestions { get; set; }
    public bool IsDeleted {get; set;} 
    
    public DateTime CreatedAt { get; set; }
}