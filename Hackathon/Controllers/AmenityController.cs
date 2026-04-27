using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class AmenityController : ControllerBase
{
    private readonly AppDbContext _context;

    public AmenityController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAmenities()
    {
        return Ok(await _context.Amenities.ToListAsync());
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> AddAmenity(Amenity amenity)
    {
        await _context.Amenities.AddAsync(amenity);
        await _context.SaveChangesAsync();

        return Ok(amenity);
    }
}
