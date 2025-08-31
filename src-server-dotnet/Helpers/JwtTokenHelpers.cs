using System.Text;
using System.Text.Json;
using System.Reflection;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace MyApiDotnet8.Helpers
{
    public static class JwtTokenHelpers
    {
        public static string GenerateToken<T>(IConfiguration config, T data, string? role)
        {
            var jwtSetting = config.GetSection("Jwt");

            // Claims (payload của token)
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Role, role ?? ""), // chuẩn cho authorize [Authorize(Roles="...")]
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (PropertyInfo prop in typeof(T).GetProperties())
            {
                var value = prop.GetValue(data)?.ToString();
                if (!string.IsNullOrWhiteSpace(value))
                {
                    claims.Add(new Claim(prop.Name, value));
                }
            }

            var strKEY = jwtSetting["Key"] ?? "1a2b3c4d5e6f7g8h9o";
            var issuer = jwtSetting["Issuer"];
            var audience = jwtSetting["Audience"];
            var expireMinutes = int.TryParse(jwtSetting["ExpireMinutes"], out var val) ? val : 60;

            var expires = DateTime.Now.AddMinutes(Convert.ToDouble(expireMinutes));
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(strKEY));
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                issuer: issuer,
                expires: expires,
                audience: audience,
                signingCredentials: signingCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static T? ParseTokenPayload<T>(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                throw new ArgumentException("Token is null or empty.");

            var parts = token.Split('.');
            if (parts.Length != 3)
                throw new ArgumentException("Invalid JWT format.");

            var payload = PadBase64(parts[1]);

            var bytes = Convert.FromBase64String(payload);

            var str = Encoding.UTF8.GetString(bytes);

            var obj = JsonSerializer.Deserialize<T>(str);

            return obj;
        }

        private static string PadBase64(string base64Url)
        {
            int padding = 4 - (base64Url.Length % 4);
            if (padding < 4)
                base64Url += new string('=', padding);
            return base64Url.Replace('-', '+').Replace('_', '/');
        }

    }
}