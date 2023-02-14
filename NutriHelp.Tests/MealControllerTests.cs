using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Claims;

using Microsoft.AspNetCore.Authentication.JwtBearer;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Moq;

using NutriHelp.Controllers;
using NutriHelp.Enums;
using NutriHelp.Models;
using NutriHelp.Tests.DTOs;
using NutriHelp.Tests.Mocks;

using Xunit;

namespace NutriHelp.Tests
{
    public class MealControllerTests
    {
        [Fact]
        public void GetMeals_Returns_NoContent_When_No_Meals_Are_Found()
        {
            //! Arrange
            int sampleSize = 20;
            MealRepositoryDTO dto = new()
            {
                Meals = new List<Meal>(),
                UserProfiles = CreateTestUserProfiles(sampleSize)
            };

            InMemoryMealRepository repository = new(dto);

            //? Mock HttpContext using Moq
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "firebase1")
            };
            var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
            var user = new ClaimsPrincipal(identity);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns(user);

            MealController controller = new(repository);
            controller.ControllerContext = new()
            {
                HttpContext = httpContext.Object
            };


            //! Act
            var result = controller.GetMeals();

            //! Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public void GetMeals_Returns_Ok_With_Meals_When_Meals_Are_Found()
        {
            //! Arrange
            int sampleSize = 20;
            MealRepositoryDTO dto = new()
            {
                Meals = CreateTestMeals(sampleSize),
                UserProfiles = CreateTestUserProfiles(sampleSize)
            };

            InMemoryMealRepository repository = new(dto);

            //? Mock HttpContext using Moq
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "firebase1")
            };
            var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
            var user = new ClaimsPrincipal(identity);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns(user);

            MealController controller = new(repository);
            controller.ControllerContext = new()
            {
                HttpContext = httpContext.Object
            };


            //! Act
            var result = controller.GetMeals();

            //! Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var meals = Assert.IsType<List<Meal>>(okResult.Value);

            Assert.DoesNotContain(default, meals.Select(x => x.Id));
        }

        [Fact]
        public void AddFood_Returns_NoContent_And_Adds_To_Existing_Meal()
        {
            //! Arrange
            int sampleSize = 20;
            MealRepositoryDTO dto = new()
            {
                Meals = CreateTestMeals(sampleSize),
                UserProfiles = CreateTestUserProfiles(sampleSize)
            };

            InMemoryMealRepository repository = new(dto);

            //? Mock HttpContext using Moq
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "firebase1")
            };
            var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
            var user = new ClaimsPrincipal(identity);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns(user);

            MealController controller = new(repository);
            controller.ControllerContext = new()
            {
                HttpContext = httpContext.Object
            };

            AddMealDTO mealDTO = new()
            {
                MealTypeId = 1,
                MealIngredient = new()
                {
                    Id = 1,
                    Amount = 5,
                    Ingredient = new()
                    {
                        Id = "ingredient123",
                        CaloriesPerServing = 0,
                        Measurement = "breath",
                        Quantity = 1,
                        Name = "Air"
                    }, 
                    MealId = 1
                }
            };
            Meal existingMeal = dto.Meals.First();

            //! Act
            var result = controller.AddFood(mealDTO);

            //! Assert
            Assert.IsType<NoContentResult>(result);
            Assert.Contains(mealDTO.MealIngredient, existingMeal.Ingredients);
        }

        [Fact]
        public void AddFood_Returns_NoContent_And_Creates_New_Meal_When_Necessary()
        {
            //! Arrange
            int sampleSize = 20;
            MealRepositoryDTO dto = new()
            {
                Meals = CreateTestMeals(sampleSize),
                UserProfiles = CreateTestUserProfiles(sampleSize)
            };

            InMemoryMealRepository repository = new(dto);

            //? Mock HttpContext using Moq
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "firebase3")
            };
            var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
            var user = new ClaimsPrincipal(identity);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns(user);

            MealController controller = new(repository);
            controller.ControllerContext = new()
            {
                HttpContext = httpContext.Object
            };

            AddMealDTO mealDTO = new()
            {
                MealTypeId = 2,
                MealIngredient = new()
                {
                    Id = 1,
                    Amount = 5,
                    Ingredient = new()
                    {
                        Id = "ingredient123",
                        CaloriesPerServing = 0,
                        Measurement = "breath",
                        Quantity = 1,
                        Name = "Air"
                    },
                    MealId = 1
                }
            };
            
            dto.Meals.RemoveAt(0);
            
            //! Act
            var result = controller.AddFood(mealDTO);

            //! Assert
            Assert.IsType<NoContentResult>(result);
            Assert.Contains(mealDTO.MealIngredient, dto.Meals.SelectMany(x => x.Ingredients));
        }

        [Fact]
        public void DeleteFood_Returns_NoContent_And_Deletes_Item()
        {
            //! Arrange
            int sampleSize = 20;
            MealRepositoryDTO dto = new()
            {
                Meals = CreateTestMeals(sampleSize),
                UserProfiles = CreateTestUserProfiles(sampleSize)
            };

            InMemoryMealRepository repository = new(dto);
            MealController controller = new(repository);

            string foodId = $"ingredient{1}";
            int mealId = 1;

            MealIngredient mealIngredient = dto.Meals.SelectMany(x => x.Ingredients).First(x => x.MealId == mealId && x.IngredientId == foodId);

            //! Act
            var result = controller.DeleteFood(foodId, mealId);

            //! Assert
            Assert.IsType<NoContentResult>(result);
            Assert.DoesNotContain(mealIngredient, dto.Meals.SelectMany(x => x.Ingredients));
        }

        [Fact]
        public void EditFood_Returns_NoContent_And_Edits_Item()
        {
            //! Arrange
            int sampleSize = 20;
            MealRepositoryDTO dto = new()
            {
                Meals = CreateTestMeals(sampleSize),
                UserProfiles = CreateTestUserProfiles(sampleSize)
            };

            InMemoryMealRepository repository = new(dto);
            MealController controller = new(repository);

            string foodId = $"ingredient{1}";
            int mealId = 1;
            int newAmount = 50;

            MealIngredient mealIngredient = dto.Meals.SelectMany(x => x.Ingredients).First(x => x.MealId == mealId && x.IngredientId == foodId);

            //! Act
            var result = controller.EditFood(foodId, mealId, newAmount);

            //! Assert
            Assert.IsType<NoContentResult>(result);
            Assert.Equal(newAmount, mealIngredient.Amount);
        }

        private List<UserProfile> CreateTestUserProfiles(int amount)
        {
            List<UserProfile> profiles = new();

            for (int i = 1; i <= amount; i++)
            {
                profiles.Add(new UserProfile
                {
                    Id = i,
                    FirebaseId = $"firebase{i}",
                    Username = $"user{i}",
                    FirstName = $"first{i}",
                    LastName = $"last{i}",
                    Email = $"example{i}@example.com",
                    UserTypeId = i % 3 == 0 ? (int)UserTypeEnum.Admin : (int)UserTypeEnum.User,
                    IsActive = i % 2 == 0
                });
                AddUserType(profiles.Last());
            }

            return profiles;
        }

        private void AddUserType(UserProfile userProfile)
        {
            UserType userType = new()
            {
                Id = userProfile.UserTypeId
            };

            switch (userType.Id)
            {
                case (int)UserTypeEnum.Admin:
                    userType.Name = "Admin";
                    break;
                case (int)UserTypeEnum.User:
                    userType.Name = "Admin";
                    break;
            }

            userProfile.UserType = userType;
        }

        /// <summary>
        /// Creates a random amount of Meal objects.
        /// </summary>
        /// <param name="maxAmount">Maximum (inclusive) amount of meals to create.</param>
        private List<Meal> CreateTestMeals(int maxAmount)
        {
            List<Meal> meals = new()
            {
                new Meal()
                {
                    Id = 1,
                    UserProfileId = 1,
                    MealTypeId = 1,
                    Date = DateTime.Today,
                    Ingredients = new List<MealIngredient>
                    {
                        new MealIngredient {
                            Id = 1,
                            Amount = 1,
                            MealId = 1,
                            IngredientId = $"ingredient{1}",
                            Ingredient = new()
                            {
                                Id = $"ingredient{1}",
                                CaloriesPerServing = 1 * 100,
                                Measurement = "thing",
                                Quantity = 1,
                                Name = $"ingredient{1}"
                            }
                        }
                    }
                }
        };

            for (int i = 2; i <= maxAmount; i++)
            {
                if (new Random().Next(2) == 1)
                {
                    meals.Add(
                        new Meal()
                        {
                            Id = i,
                            UserProfileId = i,
                            MealTypeId = new Random().Next(1, 5),
                            Date = DateTime.Today,
                            Ingredients = new List<MealIngredient>
                            {
                                new MealIngredient {
                                    Id = i,
                                    Amount = 1,
                                    MealId = i,
                                    IngredientId = $"ingredient{i}",
                                    Ingredient = new()
                                    {
                                        Id = $"ingredient{i}",
                                        CaloriesPerServing = i * 100,
                                        Measurement = "thing",
                                        Quantity = 1,
                                        Name = $"ingredient{i}"
                                    }
                                }
                            }
                        }
                    );
                }
            }

            return meals;
        }
    }
}
