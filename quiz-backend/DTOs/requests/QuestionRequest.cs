using System.ComponentModel.DataAnnotations;

public class QuestionRequest
{
    [Required(ErrorMessage = "Nội dung câu hỏi không được để trống.")]
    [MaxLength(2000, ErrorMessage = "Nội dung câu hỏi không được vượt quá 2000 ký tự.")]
    public string Content { get; set; } = string.Empty;

    [Required]
    [EnumDataType(typeof(QuestionType), ErrorMessage = "Loại câu hỏi không hợp lệ.")]
    public QuestionType Type { get; set; }

    [Required]
    [Range(0.0, 100.0, ErrorMessage = "Điểm số của câu hỏi phải nằm trong khoảng từ 0 đến 100.")]
    public decimal Score { get; set; }

    [Required(ErrorMessage = "Câu hỏi phải có danh sách các câu trả lời.")]
    [MinLength(2, ErrorMessage = "Một câu hỏi phải có ít nhất 2 đáp án lựa chọn.")]
    public List<AnswerRequest> Answers { get; set; } = new();
}