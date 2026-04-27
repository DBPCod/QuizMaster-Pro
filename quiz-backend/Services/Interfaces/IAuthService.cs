using QuizBackend.Common;
using QuizBackend.DTOs.Requests;
using QuizBackend.DTOs.Responses;

namespace QuizBackend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse<AccountLoginResponse>> LoginAsync(AccountLoginRequest request);
        string GenerateJwtToken(AccountLoginResponse accountLoginResponse);
        Task<ApiResponse<AccountLoginResponse>> RegisterAsync(AccountRegisterRequest request);
        Task<ApiResponse<AccountLoginResponse>> GetMe(int accountId);
        Task<ApiResponse<AccountChangeResponse>> ChangePassword(AccountChangeRequest request);
    }
}
