using System.ComponentModel.DataAnnotations;

public class AccountChangeRequest
{
    [Required(ErrorMessage = "AccountId is required")]
    public int AccountId { get; set; }

    [Required(ErrorMessage = "Password is required")]
    public string PasswordOld { get; set; } = string.Empty;

    [Required]
    public string PasswordNew { get; set; } = string.Empty;
}
