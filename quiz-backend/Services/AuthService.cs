using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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
        if (user == null || user.PasswordHash != request.Password)
        {
            return null;
        }

        if (!user.IsActive)
        {
            return null;
        }

        return new AccountLoginResponse
        {
            AccountId = user.AccountId,
            Email = user.Email,
            Role = user.Role.ToString(),
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt.ToString(),
        };
    }

    public string GenerateJwtToken(AccountLoginResponse accountLoginResponse)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET_KEY"));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(
                new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, accountLoginResponse.AccountId.ToString()),
                    new Claim(ClaimTypes.Email, accountLoginResponse.Email),
                    new Claim(ClaimTypes.Role, accountLoginResponse.Role),
                }
            ),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            ),
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
