using System.ComponentModel.DataAnnotations;

public class Amenity
{
    [Key]
    public int AmenityId { get; set; }
    [Required]
    public string AmenityName { get;set; }
}