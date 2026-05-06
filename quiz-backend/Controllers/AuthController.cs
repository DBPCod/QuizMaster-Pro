using System.Net;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizBackend.Common;
using QuizBackend.DTOs.Requests;
using QuizBackend.DTOs.Responses;
using QuizBackend.Services.Interfaces;

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
        var result = await _authService.LoginAsync(accountLoginRequest);
        if (!result.Success)
        {
            return StatusCode(result.StatusCode, result);
        }

        var token = _authService.GenerateJwtToken(result.Data);
        result.Data.Token = token;
        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> register(
        [FromBody] AccountRegisterRequest accountRegisterRequest
    )
    {
        var result = await _authService.RegisterAsync(accountRegisterRequest);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var accountId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var result = await _authService.GetMe(int.Parse(accountId));

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [Authorize]
    [HttpPut("change-pass-word")]
    public async Task<IActionResult> ChangePassword([FromBody] AccountChangeRequest request)
    {
        var accountId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        request.AccountId = int.Parse(accountId);
        var result = await _authService.ChangePassword(request);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        //chữa cháy
        var newClaims = new AccountLoginResponse
        {
            AccountId = result.Data.AccountId,
            Email = result.Data.Email,
            Role = result.Data.Role,
        };
        var newToken = _authService.GenerateJwtToken(newClaims);

        return Ok(result);
    }
}
