using System.ComponentModel.DataAnnotations;

public class Hotel
{
    [Key]
    public int HotelId { get; set; }
    [Required]
    public string HotelName { get; set; }
    [Required]
    public string Location { get; set; }
    [Required]
    public string Address { get; set; }
    public string Description { get; set; }
    public decimal Rating { get; set; }
}