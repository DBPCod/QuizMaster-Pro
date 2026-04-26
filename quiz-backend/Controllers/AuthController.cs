using Microsoft.AspNetCore.Mvc;
using QuizBackend.DTOs.Requests;
using QuizBackend.DTOs.Responses;
using QuizBackend.Services.Interfaces;
using RouteAttribute = Microsoft.AspNetCore.Components.RouteAttribute;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> login([FromBody] AccountLoginRequest accountLoginRequest)
    {
        var user = await _authService.LoginAsync(accountLoginRequest);
        if (user == null)
        {
            return Unauthorized(new { Message = "Email hoặc mật khẩu không chính xác" });
        }

        var token = _authService.GenerateJwtToken(user);
        return Ok(new { Token = token, Message = "Đăng nhập thành công" });
    }
}

