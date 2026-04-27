using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class HotelController : ControllerBase
{
    private readonly AppDbContext _context;

    public HotelController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetHotels()
    {
        return Ok(await _context.Hotels.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetHotelById(int id)
    {
        var hotel = await _context.Hotels.FindAsync(id);

        if (hotel == null)
            return NotFound();

        return Ok(hotel);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> AddHotel(Hotel hotel)
    {
        await _context.Hotels.AddAsync(hotel);
        await _context.SaveChangesAsync();

        return Ok(hotel);
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateHotel(int id, Hotel hotel)
    {
        var existing = await _context.Hotels.FindAsync(id);

        if (existing == null)
            return NotFound();

        existing.HotelName = hotel.HotelName;
        existing.Location = hotel.Location;
        existing.Address = hotel.Address;
        existing.Description = hotel.Description;
        existing.Rating = hotel.Rating;

        await _context.SaveChangesAsync();

        return Ok(existing);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHotel(int id)
    {
        var hotel = await _context.Hotels.FindAsync(id);

        if (hotel == null)
            return NotFound();

        _context.Hotels.Remove(hotel);
        await _context.SaveChangesAsync();

        return Ok("Deleted");
    }
}