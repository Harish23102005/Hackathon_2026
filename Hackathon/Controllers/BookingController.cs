using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class BookingController : ControllerBase
{
    private readonly AppDbContext _context;

    public BookingController(AppDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "Customer")]
    [HttpPost]
    public async Task<IActionResult> CreateBooking(Booking booking)
    {
        var room = await _context.Rooms.FindAsync(booking.RoomId);

        if (room == null)
            return NotFound();

        var overlap = await _context.Bookings.AnyAsync(b =>
            b.RoomId == booking.RoomId &&
            booking.CheckInDate < b.CheckOutDate &&
            booking.CheckOutDate > b.CheckInDate
        );

        if (overlap)
            return BadRequest("Room already booked");

        var days = (booking.CheckOutDate.ToDateTime(TimeOnly.MinValue)
                   - booking.CheckInDate.ToDateTime(TimeOnly.MinValue)).Days;

        booking.TotalAmount = days * room.PricePerNight;
        booking.BookingDate = DateTime.Now;
        booking.BookingStatus = "Confirmed";

        await _context.Bookings.AddAsync(booking);
        await _context.SaveChangesAsync();

        return Ok(booking);
    }

    [Authorize(Roles = "Customer")]
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserBookings(int userId)
    {
        return Ok(await _context.Bookings
            .Where(b => b.UserId == userId)
            .ToListAsync());
    }

    [Authorize(Roles = "Customer")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> CancelBooking(int id)
    {
        var booking = await _context.Bookings.FindAsync(id);

        if (booking == null)
            return NotFound();

        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync();

        return Ok("Booking cancelled");
    }
}