using System.ComponentModel.DataAnnotations;

namespace NutriHelp.Models
{
    public class Ingredient //! This is pretty much a join table to the food API
    {
        [Required]
        public string Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        
        [Required]
        public int CaloriesPerServing { get; set; }

        [Required]
        public decimal Quantity { get; set; }

        [Required]
        [StringLength(50)]
        public string Measurement { get; set; }
    }
}
