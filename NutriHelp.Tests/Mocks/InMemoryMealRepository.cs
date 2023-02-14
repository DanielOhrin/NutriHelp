using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.Data.SqlClient;

using NutriHelp.Models;
using NutriHelp.Repositories;
using NutriHelp.Tests.DTOs;
using NutriHelp.Utils;

namespace NutriHelp.Tests.Mocks
{
    internal class InMemoryMealRepository : IMealRepository
    {
        private readonly MealRepositoryDTO _data;

        public MealRepositoryDTO InternalData
        {
            get
            {
                return _data;
            }
        }

        public InMemoryMealRepository(MealRepositoryDTO dto)
        {
            _data = dto;
        }

        /// <summary>
        /// Simulates the DB Procedure for Add_Food. <strong><em>Not Entirely The Same.</em></strong>
        /// </summary>
        /// <param name="firebaseUserId">String id for the user you are editing</param>
        /// <param name="dto">Data transfer object</param>
        public void AddFood(string firebaseUserId, AddMealDTO dto)
        {
            int userId = _data.UserProfiles.First(x => x.FirebaseId == firebaseUserId).Id;
            Meal existingMeal = _data.Meals.FirstOrDefault(x => x.UserProfileId == userId && x.MealTypeId == dto.MealTypeId);

            if (existingMeal == null)
            {
                existingMeal = new Meal()
                {
                    Id = _data.Meals.Last().Id + 1,
                    Date = DateTime.Today,
                    MealTypeId = dto.MealTypeId,
                    UserProfileId = userId,
                    Ingredients = new List<MealIngredient> { dto.MealIngredient }
                };

                _data.Meals.Add(existingMeal);
            }
            else
            {
                existingMeal.Ingredients.Add(dto.MealIngredient);
            }
        }

        public void DeleteFood(string foodId, int mealId)
        {
            Meal meal = _data.Meals.First(x => x.Id == mealId);
            MealIngredient mealIngredient = meal.Ingredients.First(x => x.Ingredient.Id == foodId);

            meal.Ingredients.Remove(mealIngredient);
        }

        public void EditFood(string foodId, int mealId, int newAmount)
        {
            Meal meal = _data.Meals.First(x => x.Id == mealId);
            MealIngredient mealIngredient = meal.Ingredients.First(x => x.Ingredient.Id == foodId);

            mealIngredient.Amount = newAmount;
        }

        public List<Meal> GetMeals(string firebaseUserId)
        {
            int userId = _data.UserProfiles.First(x => x.FirebaseId == firebaseUserId).Id;

            return _data.Meals.Where(x => x.UserProfileId == userId).ToList();
        }
    }
}
