using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QuizBackend.Common;
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

    public async Task<ApiResponse<AccountLoginResponse>> LoginAsync(AccountLoginRequest request)
    {
        var user = await _context.Accounts.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null || !(BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash)))
        {
            return new ApiResponse<AccountLoginResponse>
            {
                Success = false,
                Message = "Email hoac mat khau khong chinh xac",
                StatusCode = (int)HttpStatusCode.BadRequest,
            };
        }

        if (!user.IsActive)
        {
            return new ApiResponse<AccountLoginResponse>
            {
                Success = false,
                Message = "Tai khoan da bi khoa",
                StatusCode = (int)HttpStatusCode.Forbidden,
            };
        }

        return new ApiResponse<AccountLoginResponse>
        {
            Success = true,
            Message = "Dang nhap thanh cong",
            StatusCode = (int)HttpStatusCode.OK,
            Data = new AccountLoginResponse
            {
                AccountId = user.AccountId,
                Email = user.Email,
                Role = user.Role.ToString(),
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt.ToString(),
            },
        };
    }

    public async Task<ApiResponse<AccountLoginResponse>> RegisterAsync(
        AccountRegisterRequest request
    )
    {
        if (!new EmailAddressAttribute().IsValid(request.Email))
        {
            return new ApiResponse<AccountLoginResponse>
            {
                Success = false,
                Message = "Email khong hop le",
                StatusCode = (int)HttpStatusCode.BadRequest,
                Data = null,
            };
        }

        if (request.Password.Length < 6)
        {
            return new ApiResponse<AccountLoginResponse>
            {
                Success = false,
                Message = "Mat khau phai >= 6 ky tu",
                StatusCode = (int)HttpStatusCode.BadRequest,
                Data = null,
            };
        }

        var account = await _context.Accounts.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (account != null)
        {
            return new ApiResponse<AccountLoginResponse>
            {
                Success = false,
                Message = "Email da ton tai",
                StatusCode = (int)HttpStatusCode.Conflict,
                Data = null,
            };
        }
        // Hashes the plaintext password from the request

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new Account { Email = request.Email, PasswordHash = passwordHash };

        _context.Accounts.Add(user);
        await _context.SaveChangesAsync();

        return new ApiResponse<AccountLoginResponse>
        {
            Success = true,
            Message = "Dang ky thanh cong",
            StatusCode = (int)HttpStatusCode.Created,
            Data = new AccountLoginResponse
            {
                AccountId = user.AccountId,
                Email = user.Email,
                Role = user.Role.ToString(),
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt.ToString(),
            },
        };
    }

    public async Task<ApiResponse<AccountLoginResponse>> GetMe(int accountId)
    {
        var isValidMatch = await _context
            .Accounts.AsNoTracking()
            .FirstOrDefaultAsync(u => u.AccountId == accountId);

        if (isValidMatch == null)
        {
            return new ApiResponse<AccountLoginResponse>
            {
                Success = false,
                Message = "Tai khoan khong ton tai",
                StatusCode = (int)HttpStatusCode.NotFound,
                Data = null,
            };
        }

        return new ApiResponse<AccountLoginResponse>
        {
            Success = true,
            Message = "Lay thong tin tai khoan thanh cong",
            StatusCode = (int)HttpStatusCode.OK,
            Data = new AccountLoginResponse
            {
                AccountId = isValidMatch.AccountId,
                Email = isValidMatch.Email.ToString(),
                Role = isValidMatch.Role.ToString(),
                IsActive = isValidMatch.IsActive,
                CreatedAt = isValidMatch.CreatedAt.ToString(),
            },
        };
    }

    public async Task<ApiResponse<AccountChangeResponse>> ChangePassword(
        AccountChangeRequest request
    )
    {
        var (isValid, message) = Valid.Validate(request.PasswordNew);
        if (!isValid)
        {
            return new ApiResponse<AccountChangeResponse>
            {
                Success = false,
                Message = message,
                StatusCode = (int)HttpStatusCode.BadRequest,
            };
        }
        var account = await _context.Accounts.FirstOrDefaultAsync(u =>
            u.AccountId == request.AccountId
        );

        var isValidMatch = BCrypt.Net.BCrypt.Verify(request.PasswordOld, account.PasswordHash);
        if (!isValidMatch)
        {
            return new ApiResponse<AccountChangeResponse>
            {
                Success = false,
                Message = "Mat khau khong chinh xac",
                StatusCode = (int)HttpStatusCode.BadRequest,
            };
        }

        return new ApiResponse<AccountChangeResponse>
        {
            Success = true,
            Message = "Doi mat khau thanh cong",
            StatusCode = (int)HttpStatusCode.OK,
            Data = new AccountChangeResponse
            {
                AccountId = account.AccountId,
                Email = account.Email.ToString(),
                Role = account.Role.ToString(),
                IsActive = account.IsActive,
                CreatedAt = account.CreatedAt.ToString(),
            },
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
