using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Room
{
    [Key]
    public int RoomId { get; set; }

    [Required]
    [ForeignKey("Hotel")]
    public int HotelId { get; set; }

    [Required]
    [ForeignKey("RoomCategory")]
    public int CategoryId { get; set; }

    [Required]
    public int RoomNumber { get; set; }

    [Required]
    public decimal PricePerNight { get; set; }

    [Required]
    public int Capacity { get; set; }
}