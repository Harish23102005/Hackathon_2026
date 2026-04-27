using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class RoomAmenityController : ControllerBase
{
    private readonly AppDbContext _context;

    public RoomAmenityController(AppDbContext context)
    {
        _context = context;
    }


    [HttpGet("room/{roomId}")]
    public async Task<IActionResult> GetAmenitiesByRoom(int roomId)
    {
        var roomAmenities = await _context.RoomAmenities
            .Where(r => r.RoomId == roomId)
            .ToListAsync();

        if (!roomAmenities.Any())
        {
            return NotFound("No amenities found for this room");
        }

        return Ok(roomAmenities);
    }


    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> AddRoomAmenity(RoomAmenity roomAmenity)
    {
        var roomExists = await _context.Rooms
            .AnyAsync(r => r.RoomId == roomAmenity.RoomId);

        if (!roomExists)
        {
            return NotFound("Room not found");
        }

        var amenityExists = await _context.Amenities
            .AnyAsync(a => a.AmenityId == roomAmenity.AmenityId);

        if (!amenityExists)
        {
            return NotFound("Amenity not found");
        }


        var alreadyExists = await _context.RoomAmenities
            .AnyAsync(x =>
                x.RoomId == roomAmenity.RoomId &&
                x.AmenityId == roomAmenity.AmenityId);

        if (alreadyExists)
        {
            return BadRequest("Amenity already assigned to this room");
        }

        await _context.RoomAmenities.AddAsync(roomAmenity);
        await _context.SaveChangesAsync();

        return Ok(roomAmenity);
    }


    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRoomAmenity(int id)
    {
        var roomAmenity = await _context.RoomAmenities.FindAsync(id);

        if (roomAmenity == null)
        {
            return NotFound("Mapping not found");
        }

        _context.RoomAmenities.Remove(roomAmenity);
        await _context.SaveChangesAsync();

        return Ok("Room amenity deleted successfully");
    }
}