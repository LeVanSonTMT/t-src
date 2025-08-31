using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc.Filters;

namespace MyApiDotnet8.Controllers
{
    public class BaseController : Controller
    {
        private readonly IConfiguration _config;

        public BaseController(IConfiguration config)
        {
            _config = config;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();

            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                context.Result = new UnauthorizedObjectResult(new { message = "Missing or invalid Authorization header" });
                return;
            }

            var jwtSetting = _config.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSetting["Key"]!);
            
            var token = authHeader.Substring("Bearer ".Length).Trim();
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidIssuer = jwtSetting["Issuer"],
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = jwtSetting["Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);
            }
            catch (SecurityTokenExpiredException)
            {
                context.Result = new UnauthorizedObjectResult(new { message = "Token expired" });
                return;
            }
            catch (Exception)
            {
                context.Result = new UnauthorizedObjectResult(new { message = "Invalid token" });
                return;
            }

            base.OnActionExecuting(context);
        }
    }
}
