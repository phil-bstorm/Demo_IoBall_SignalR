using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using IoBall.API.Services.Interfaces;
using IoBall.Domain.Models;
using Microsoft.IdentityModel.Tokens;

namespace PokemonBattleAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;

        public AuthService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(Utilisateur user)
        {
            // Create security objects with the user's information stored in the token (No sensitive information)
            List<Claim> claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Sid, user.Id.ToString()),
            };

            // credential for the token (key + algorithm)
            SymmetricSecurityKey key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"])
            );
            SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // generate token
            JwtSecurityToken token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            // export token as string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
