using System.ComponentModel.DataAnnotations;

namespace NutriHelp.Models
{
    public class AddMealDTO
    {
        [Required]
        public int MealTypeId { get; set; }

        [Required]
        public MealIngredient MealIngredient { get; set; }
    }
}
