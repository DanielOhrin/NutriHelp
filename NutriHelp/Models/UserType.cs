using System.ComponentModel.DataAnnotations;

namespace NutriHelp.Models
{
    public class UserType
    {
        [Required]
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
