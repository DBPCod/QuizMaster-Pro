
using QuizBackend.DTOs.Requests;
using QuizBackend.DTOs.Responses;
namespace QuizBackend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AccountLoginResponse> LoginAsync(AccountLoginRequest request); 
    }
}
