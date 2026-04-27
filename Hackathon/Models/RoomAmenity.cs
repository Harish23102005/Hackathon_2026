using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class RoomAmenity
{
    [Key]
    public int RoomAmenityId { get; set; }

    [Required]
    [ForeignKey("Room")]
    public int RoomId { get; set; }

    [Required]
    [ForeignKey("Amenity")]
    public int AmenityId { get; set; }
}