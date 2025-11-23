using System.Security.Claims;

namespace IoBall.API.Extensions
{
    public static class UserExtensions
    {
        public static string GetId(this ClaimsPrincipal claims)
        {
            return claims.FindFirst(ClaimTypes.Sid)!.Value;
        }

        public static string GetUsername(this ClaimsPrincipal claims)
        {
            return claims.FindFirst(ClaimTypes.Name)!.Value;
        }

        public static bool IsConnected(this ClaimsPrincipal claims)
        {
            return claims.Identity?.IsAuthenticated ?? false;
        }
    }
}
