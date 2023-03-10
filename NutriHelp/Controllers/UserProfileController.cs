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

        [Authorize]
        [HttpPost]
        public IActionResult Register([FromBody] UserProfile userProfile)
        {
            _userProfileRepository.Register(userProfile);
            return CreatedAtAction("Get", new { firebaseUserId = userProfile.FirebaseId }, userProfile);
        }

        [Authorize]
        [HttpPut]
        public IActionResult EditProfile([FromBody] UserProfile userProfile)
        {
            _userProfileRepository.Edit(userProfile);

            return NoContent();
        }

        [HttpGet("isDuplicateData")]
        public IActionResult IsDuplicateData([FromQuery] string field, [FromQuery] string value)
        {
            return Ok(_userProfileRepository.IsDuplicate(field, value));
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
                return NoContent();
            }

            return Ok(userType);
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
        [HttpGet]
        public IActionResult GetAll([FromQuery] int increment, [FromQuery] int offset, [FromQuery] bool isActive)
        {
            UserType userType = _userProfileRepository.GetUserType(CurrentUID);

            if (userType.Id != (int)UserTypeEnum.Admin)
            {
                return Unauthorized();
            }

            AllUsersDTO dto = _userProfileRepository.GetAll(increment, offset, isActive, CurrentUID);

            return Ok(dto);
        }

        [Authorize]
        [HttpPatch("deactivate/{userId}")]
        public IActionResult Deactivate([FromRoute] int userId)
        {
            UserType userType = _userProfileRepository.GetUserType(CurrentUID);

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

            return NoContent();
        }

        [Authorize]
        [HttpPatch("activate/{userId}")]
        public IActionResult Activate([FromRoute] int userId)
        {
            UserType userType = _userProfileRepository.GetUserType(CurrentUID);

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

            return NoContent();
        }

        [Authorize]
        [HttpPatch("EditStat/{firebaseUserId}")]
        public IActionResult EditStat([FromRoute] string firebaseUserId, [FromQuery] string field, [FromQuery] int value)
        {
            _userProfileRepository.EditStat(firebaseUserId, field, value);

            return NoContent();
        }

        private string CurrentUID => User.FindFirstValue(ClaimTypes.NameIdentifier);

        //! Moved Actions
        [Authorize]
        [HttpGet("meal/{firebaseUserId}")]
        public IActionResult GetMeals([FromRoute] string firebaseUserId)
        {
            return RedirectPermanent("/api/meal/");
        }

        [Authorize]
        [HttpPost("food")]
        public IActionResult AddFood([FromQuery] string firebaseUserId, [FromBody] AddMealDTO dto)
        {
            return RedirectPermanent("/api/meal/");
        }

        [Authorize]
        [HttpDelete("food")]
        public IActionResult DeleteFood([FromQuery] string foodId, [FromQuery] int mealId)
        {
            return RedirectPermanent("/api/meal/");
        }

        [Authorize]
        [HttpPatch("food")]
        public IActionResult EditFood([FromQuery] string foodId, [FromQuery] int mealId, [FromQuery] int newAmount)
        {
            return RedirectPermanent("/api/meal/");
        }
    }
} 
