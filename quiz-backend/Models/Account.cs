using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using QuizBackend.Models;

[Table("Accounts")]
public class Account
{
    [Key]
    public int AccountId {get; set;}

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email {get; set;} = string.Empty;

    [Required]
    public string PasswordHash {get; set;} = string.Empty;

    [Required]
    [MaxLength(20)]
    public Role Role {get; set;} = Role.User;

    [Required]
    public DateTime CreatedAt {get; set;} = DateTime.UtcNow;

    [Required]
    public bool IsActive {get; set;} = true;

    public bool IsDelete {get; set;} =false;
    public DateTime? DeletedAt { get; set; }
    public ICollection<Quiz> Quizzes = new List<Quiz>();
}   