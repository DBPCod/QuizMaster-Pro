using Microsoft.EntityFrameworkCore;
using QuizBackend.Data;
using QuizBackend.DTOs.Requests;
using QuizBackend.DTOs.Responses;
using QuizBackend.Services.Interfaces;

public class AuthService : IAuthService
{
    public readonly MyDbContext _context;
    public AuthService(MyDbContext context)
    {
        _context = context;
    }

    public async Task<AccountLoginResponse> LoginAsync(AccountLoginRequest request)
    {
        var user = await _context.Accounts.FirstOrDefaultAsync(u => u.Email == request.Email);
        if(user == null || user.PasswordHash != request.Password)
        {
            return null;
        }

        if(!user.IsActive)
        {
            return null;
        }
        return new AccountLoginResponse
        {
            AccountId = user.AccountId,
            Email = user.Email,
            Role = user.Role.ToString(),
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt.ToString()
        };
    }
}