using System.Net;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizBackend.Common;
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
        var result = await _authService.LoginAsync(accountLoginRequest);
        if (!result.Success)
        {
            return BadRequest(result);
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
        Console.WriteLine(accountId);
        var result = await _authService.GetMe(int.Parse(accountId));

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
