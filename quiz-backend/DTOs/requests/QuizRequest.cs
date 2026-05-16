using System.ComponentModel.DataAnnotations;

public class QuizRequest
{
    [Required(ErrorMessage = "Tiêu đề bài trắc nghiệm không được để trống.")]
    [MaxLength(200, ErrorMessage = "Tiêu đề không được vượt quá 200 ký tự.")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000, ErrorMessage = "Mô tả không được vượt quá 1000 ký tự.")]
    public string Description { get; set; } = string.Empty;

    // Bỏ qua trường Email ở đây vì chúng ta đã trích xuất an toàn từ JWT Token trong Controller

    [Required(ErrorMessage = "Bài trắc nghiệm phải có ít nhất một câu hỏi.")]
    [MinLength(1, ErrorMessage = "Bài trắc nghiệm phải có ít nhất một câu hỏi.")]
    public List<QuestionRequest> Questions { get; set; } = new();
}
