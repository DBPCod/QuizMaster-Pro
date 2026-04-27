using System.ComponentModel.DataAnnotations;

public class AccountChangeResponse
{
    public string Token = string.Empty;

    [Required(ErrorMessage = "AccountId không được thiếu")]
    public int AccountId { get; set; }

    [Required(ErrorMessage = "Email không được thiếu")]
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public string CreatedAt { get; set; }
}
