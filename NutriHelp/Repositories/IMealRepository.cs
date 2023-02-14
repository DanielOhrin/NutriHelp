using System.Collections.Generic;

using NutriHelp.Models;

namespace NutriHelp.Repositories
{
    public interface IMealRepository
    {
        List<Meal> GetMeals(string firebaseUserId);
        void AddFood(string firebaseUserId, AddMealDTO dto);
        void EditFood(string foodId, int mealId, int newAmount);
        void DeleteFood(string foodId, int mealId);
    }
}
