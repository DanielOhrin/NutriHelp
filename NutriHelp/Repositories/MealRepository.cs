using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Linq;

using NutriHelp.Models;
using NutriHelp.Utils;
using System.Collections.Generic;
using System.Data;

namespace NutriHelp.Repositories
{
    public class MealRepository : BaseRepository, IMealRepository
    {
        public MealRepository(IConfiguration configuration) : base(configuration) { }

        public List<Meal> GetMeals(string firebaseUserId)
        {

            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "dbo.GetDailyMeals";

                    DbUtils.AddParameter(cmd, "@FirebaseUserId", firebaseUserId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        List<Meal> meals = new();

                        while (reader.Read())
                        {
                            int mealId = DbUtils.GetInt(reader, "MealId");

                            if (meals.FirstOrDefault(x => x.Id == mealId) == null)
                            {
                                Meal newMeal = new()
                                {
                                    Id = mealId,
                                    MealTypeId = DbUtils.GetInt(reader, "MealTypeId"),
                                    MealType = new()
                                    {
                                        Id = DbUtils.GetInt(reader, "MealTypeId"),
                                        Name = DbUtils.GetString(reader, "Name"),
                                    },
                                    Date = DbUtils.GetDateTime(reader, "MealDate"),
                                    UserProfileId = DbUtils.GetInt(reader, "UserProfileId"),
                                    Ingredients = new List<MealIngredient>()
                                };
                                meals.Add(newMeal);
                            }

                            Meal currentMeal = meals.First(x => x.Id == mealId);

                            if (!reader.IsDBNull(reader.GetOrdinal("MIID")))
                            {
                                MealIngredient newMealIngredient = new()
                                {
                                    Id = DbUtils.GetInt(reader, "MIId"),
                                    MealId = mealId,
                                    Amount = DbUtils.GetInt(reader, "Amount"),
                                    IngredientId = DbUtils.GetString(reader, "IngredientId"),
                                    Ingredient = new()
                                    {
                                        Id = DbUtils.GetString(reader, "IngredientId"),
                                        Name = DbUtils.GetString(reader, "IngredientName"),
                                        CaloriesPerServing = DbUtils.GetInt(reader, "CaloriesPerServing"),
                                        Quantity = DbUtils.GetDecimal(reader, "Quantity"),
                                        Measurement = DbUtils.GetString(reader, "Measurement")
                                    }
                                };
                                currentMeal.Ingredients.Add(newMealIngredient);
                            }
                        }

                        return meals;
                    }
                }
            }
        }

        public void AddFood(string firebaseUserId, AddMealDTO dto)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "dbo.AddFood";

                    DbUtils.AddParameter(cmd, "@FirebaseUserId", firebaseUserId);
                    DbUtils.AddParameter(cmd, "@MealTypeId", dto.MealTypeId);
                    DbUtils.AddParameter(cmd, "@Amount", dto.MealIngredient.Amount);
                    DbUtils.AddParameter(cmd, "@IngredientId", dto.MealIngredient.Ingredient.Id);
                    DbUtils.AddParameter(cmd, "@Name", dto.MealIngredient.Ingredient.Name);
                    DbUtils.AddParameter(cmd, "@CaloriesPerServing", dto.MealIngredient.Ingredient.CaloriesPerServing);
                    DbUtils.AddParameter(cmd, "@Quantity", dto.MealIngredient.Ingredient.Quantity);
                    DbUtils.AddParameter(cmd, "@Measurement", dto.MealIngredient.Ingredient.Measurement);

                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void DeleteFood(string foodId, int mealId)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        DELETE FROM dbo.MealIngredient
                        WHERE IngredientId = @IngredientId
                            AND MealId = @MealId
                    ";

                    DbUtils.AddParameter(cmd, "@IngredientId", foodId);
                    DbUtils.AddParameter(cmd, "@MealId", mealId);

                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void EditFood(string foodId, int mealId, int newAmount)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        UPDATE dbo.MealIngredient
                        SET Amount = @NewAmount
                        WHERE IngredientId = @IngredientId
                            AND MealId = @MealId
                    ";

                    DbUtils.AddParameter(cmd, "@IngredientId", foodId);
                    DbUtils.AddParameter(cmd, "@MealId", mealId);
                    DbUtils.AddParameter(cmd, "@NewAmount", newAmount);

                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}
