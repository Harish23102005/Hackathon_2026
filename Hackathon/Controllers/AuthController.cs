using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(User user)
    {
        var existingEmail = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == user.Email);

        if (existingEmail != null)
            return BadRequest("Email already exists");

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return Ok("User Registered Successfully");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(User user)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(x =>
                x.Email == user.Email &&
                x.Password == user.Password);

        if (existingUser == null)
            return Unauthorized("Invalid Credentials");

        var token = GenerateToken(existingUser);

        return Ok(new { token });
    }

    private string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim("id", user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role ?? "Customer")
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
        );

        var creds = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                double.Parse(_config["Jwt:DurationInMinutes"]!)
            ),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}