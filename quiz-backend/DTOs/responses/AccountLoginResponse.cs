namespace QuizBackend.DTOs.Responses
{
    public class AccountLoginResponse
    {
        public int AccountId {get; set;}
        public string Email {get; set;} = string.Empty;
        public string Role {get; set;} = string.Empty;
        public bool IsActive {get; set;}
        public string CreatedAt {get; set;}
    }
}
