using System.ComponentModel.DataAnnotations;

namespace NutriHelp.Models
{
    public class MealIngredient //! Basically any food that was eaten during that meal
    {
        public int Id { get; set; }

        [Required]
        public int Amount { get; set; }

        public int MealId { get; set; }
        public string IngredientId { get; set; }
        
        [Required]
        public Ingredient Ingredient { get; set; }
    }
}
