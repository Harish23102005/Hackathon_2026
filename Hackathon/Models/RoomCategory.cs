using System.ComponentModel.DataAnnotations;

public class RoomCategory
{
    [Key]
    public int CategoryId { get; set; }
    [Required]
    public string CategoryName { get; set; }
    [Required]
    public string Description { get; set; }
}