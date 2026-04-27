using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class RoomController : ControllerBase
{
    private readonly AppDbContext _context;

    public RoomController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("hotel/{hotelId}")]
    public async Task<IActionResult> GetRoomsByHotel(int hotelId)
    {
        return Ok(await _context.Rooms
            .Where(r => r.HotelId == hotelId)
            .ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRoomById(int id)
    {
        var room = await _context.Rooms.FindAsync(id);

        if (room == null)
            return NotFound();

        return Ok(room);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> AddRoom(Room room)
    {
        await _context.Rooms.AddAsync(room);
        await _context.SaveChangesAsync();

        return Ok(room);
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateRoom(int id, Room room)
    {
        var existing = await _context.Rooms.FindAsync(id);

        if (existing == null)
            return NotFound();

        existing.PricePerNight = room.PricePerNight;
        existing.Capacity = room.Capacity;

        await _context.SaveChangesAsync();

        return Ok(existing);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRoom(int id)
    {
        var room = await _context.Rooms.FindAsync(id);

        if (room == null)
            return NotFound();

        _context.Rooms.Remove(room);
        await _context.SaveChangesAsync();

        return Ok("Deleted");
    }
}