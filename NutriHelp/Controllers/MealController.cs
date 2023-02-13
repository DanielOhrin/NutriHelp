using System.Collections.Generic;
using System.Security.Claims;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using NutriHelp.Models;
using NutriHelp.Repositories;

namespace NutriHelp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MealController : ControllerBase
    {
        private readonly IMealRepository _mealRepository;

        public MealController(IMealRepository mealRepository)
        {
            _mealRepository = mealRepository;
        }

        [Authorize]
        [HttpGet]
        public IActionResult GetMeals()
        {
            List<Meal> meals = _mealRepository.GetMeals(CurrentUID);

            if (meals.Count == 0)
            {
                return NoContent();
            }

            return Ok(meals);
        }

        [Authorize]
        [HttpPost]
        public IActionResult AddFood([FromBody] AddMealDTO dto)
        {
            _mealRepository.AddFood(CurrentUID, dto);

            return NoContent();
        }

        [Authorize]
        [HttpDelete]
        public IActionResult DeleteFood([FromQuery] string foodId, [FromQuery] int mealId)
        {
            _mealRepository.DeleteFood(foodId, mealId);

            return NoContent();
        }

        [Authorize]
        [HttpPatch]
        public IActionResult EditFood([FromQuery] string foodId, [FromQuery] int mealId, [FromQuery] int newAmount)
        {
            _mealRepository.EditFood(foodId, mealId, newAmount);

            return NoContent();
        }

        private string CurrentUID => User.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}
