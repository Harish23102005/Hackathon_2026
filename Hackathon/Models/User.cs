using System.ComponentModel.DataAnnotations;

public class User
{
    [Key]
    public int UserId { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }

    [Required]
    public string Role { get; set; }

    public string PhoneNumber { get; set; }
}