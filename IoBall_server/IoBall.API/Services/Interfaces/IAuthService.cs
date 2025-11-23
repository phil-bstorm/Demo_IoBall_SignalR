using IoBall.Domain.Models;

namespace IoBall.API.Services.Interfaces
{
    public interface IAuthService
    {
        public string GenerateToken(Utilisateur user);

    }
}
