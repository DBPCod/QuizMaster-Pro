using System.ComponentModel.DataAnnotations;

namespace QuizBackend.DTOs.Requests
{
    public class AccountLoginRequest
    {
        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress(ErrorMessage = "Định dạng Email không hợp lệ!")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        [MinLength(6, ErrorMessage = "Mật khẩu tối thiểu phải có 6 ký tự")]
        public string Password { get; set; } = string.Empty;
    }
}

