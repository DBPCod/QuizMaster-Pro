using System.ComponentModel.DataAnnotations;

public class AccountRegisterRequest
{
    [Required]
    [EmailAddress(ErrorMessage = "Định dạng Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8, ErrorMessage = "Mật khẩu phải có ít nhất 8 ký tự")]
    [RegularExpression(
        @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$",
        ErrorMessage = "Mật khẩu phải bao gồm chữ hoa, chữ thường và số"
    )]
    public string Password { get; set; } = string.Empty;
}
