using System.ComponentModel.DataAnnotations;

public class AnswerRequest
{
    [Required(ErrorMessage = "Nội dung đáp án không được để trống.")]
    [MaxLength(1000, ErrorMessage = "Nội dung đáp án không được vượt quá 1000 ký tự.")]
    public string Content { get; set; } = string.Empty;

    [Required]
    public bool IsCorrect { get; set; }

    [Required]
    [EnumDataType(typeof(OrderIndex), ErrorMessage = "Thứ tự đáp án (A, B, C, D) không hợp lệ.")]
    public OrderIndex OrderIndex { get; set; }
}