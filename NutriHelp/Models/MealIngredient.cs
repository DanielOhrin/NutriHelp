namespace NutriHelp.Models
{
    public class MealIngredient //! Basically any food that was eaten during that meal
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        public int MealId { get; set; }
        public int IngredientId { get; set; }
        public Ingredient Ingredient { get; set; }
    }
}
