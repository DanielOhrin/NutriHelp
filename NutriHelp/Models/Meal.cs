using System;
using System.Collections.Generic;

namespace NutriHelp.Models
{
    public class Meal
    {
        public int Id { get; set; }
        public int UserProfileId { get; set; }
        public int MealTypeId { get; set; }
        public MealType MealType { get; set; }
        public DateTime Date { get; set; }
        public List<MealIngredient> Ingredients { get; set;}
    }
}
