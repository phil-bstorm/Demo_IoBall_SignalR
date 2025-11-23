using IoBall.API.Dtos.Auth;
using IoBall.API.Services.Interfaces;
using IoBall.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace IoBall.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginForm loginForm)
        {
            Utilisateur user = new Utilisateur {
                Id = Guid.NewGuid().ToString(),
                Username = loginForm.Username,
            };

            string token = _authService.GenerateToken(user);
            return Ok(new { Token = token });
        }
    }
}
