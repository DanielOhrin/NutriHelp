using System.Collections.Generic;
using System.Security.Claims;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using NutriHelp.Enums;
using NutriHelp.Models;
using NutriHelp.Repositories;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NutriHelp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserProfileRepository _userProfileRepository;
        public UserProfileController(IUserProfileRepository userProfileRepo)
        {
            _userProfileRepository = userProfileRepo;
        }

        //! GET: api/UserProfile/DoesUserExist/:id
        [Authorize]
        [HttpGet("DoesUserExist/{firebaseUserId}")]
        public IActionResult DoesUserExist([FromRoute] string firebaseUserId)
        {
            bool? userExists = _userProfileRepository.DoesUserExist(firebaseUserId);

            switch (userExists)
            {
                case true:
                    return NoContent();
                case false:
                    return Conflict();
                case null:
                    return NotFound();
            }
        }

        [Authorize]
        [HttpGet("UserType/{firebaseUserId}")]
        public IActionResult GetUserType([FromRoute] string firebaseUserId)
        {
            UserType userType = _userProfileRepository.GetUserType(firebaseUserId);

            if (userType == null)
            {
                return BadRequest();
            }

            return Ok(userType);
        }

        [HttpGet("isDuplicateData")]
        public IActionResult IsDuplicateData([FromQuery] string field, [FromQuery] string value)
        {
            return Ok(_userProfileRepository.IsDuplicate(field, value));
        }

        [Authorize]
        [HttpGet("{firebaseUserId}")]
        public IActionResult Get([FromRoute] string firebaseUserId, [FromQuery] bool? showDetails)
        {
            UserProfile userProfile = _userProfileRepository.GetByFirebaseId(firebaseUserId, showDetails);

            if (userProfile == null)
            {
                return NotFound();
            }

            return Ok(userProfile);
        }

        [Authorize]
        [HttpGet("meals/{firebaseUserId}")]
        public IActionResult GetMeals([FromRoute] string firebaseUserId)
        {
            List<Meal> meals = _userProfileRepository.GetMeals(firebaseUserId);
            
            if (meals.Count == 0)
            {
                return NoContent();
            }

            return Ok(meals);
        }

        [Authorize]
        [HttpPost]
        public IActionResult Register([FromBody] UserProfile userProfile)
        {
            _userProfileRepository.Register(userProfile);
            return CreatedAtAction("Get", new { firebaseUserId = userProfile.FirebaseId }, userProfile);
        }

        [Authorize]
        [HttpPatch("EditStat/{firebaseUserId}")]
        public IActionResult EditStat([FromRoute] string firebaseUserId, [FromQuery] string field, [FromQuery] int value)
        {
            _userProfileRepository.EditStat(firebaseUserId, field, value);

            return NoContent();
        }

        [Authorize]
        [HttpPost("AddFood/{firebaseUserId}")]
        public IActionResult AddFood([FromRoute] string firebaseUserId, [FromBody] AddMealDTO dto)
        {
            _userProfileRepository.AddFood(firebaseUserId, dto);

            return NoContent();
        }

        [Authorize]
        [HttpDelete("DeleteFood")]
        public IActionResult DeleteFood([FromQuery] string foodId, [FromQuery] int mealId)
        {
            _userProfileRepository.DeleteFood(foodId, mealId);

            return NoContent();
        }

        [Authorize]
        [HttpPatch("EditFood")]
        public IActionResult EditFood([FromQuery] string foodId, [FromQuery] int mealId, [FromQuery] int newAmount)
        {
            _userProfileRepository.EditFood(foodId, mealId, newAmount);

            return NoContent();
        }

        [Authorize]
        [HttpPut]
        public IActionResult EditProfile([FromBody] UserProfile userProfile)
        {
            _userProfileRepository.EditProfile(userProfile);

            return NoContent();
        }

        [Authorize]
        [HttpGet("all")]
        public IActionResult GetAll([FromQuery] int increment, [FromQuery] int offset, [FromQuery] int isActive)
        {
            string UUID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            UserType userType = _userProfileRepository.GetUserType(UUID);

            if (userType.Id != (int)UserTypeEnum.Admin)
            {
                return Unauthorized();
            }

            AllUsersDTO dto = _userProfileRepository.GetAll(increment, offset, isActive, UUID);

            return Ok(dto);
        }

        [Authorize]
        [HttpPatch("deactivate/{userId}")]
        public IActionResult Deactivate([FromRoute] int userId)
        {
            string UUID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            UserType userType = _userProfileRepository.GetUserType(UUID);

            if (userType.Id != (int)UserTypeEnum.Admin)
            {
                return Unauthorized();
            }

            try
            {
                _userProfileRepository.Deactivate(userId);
            }
            catch
            {
                return BadRequest();
            }

            return Ok();
        }

        [Authorize]
        [HttpPatch("activate/{userId}")]
        public IActionResult Activate([FromRoute] int userId)
        {
            string UUID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            UserType userType = _userProfileRepository.GetUserType(UUID);

            if (userType.Id != (int)UserTypeEnum.Admin)
            {
                return Unauthorized();
            }

            try
            {
                _userProfileRepository.Activate(userId);
            }
            catch
            {
                return BadRequest();
            }

            return Ok();
        }
    }
} 
