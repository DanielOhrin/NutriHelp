using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
            bool userExists = _userProfileRepository.DoesUserExist(firebaseUserId);

            if (!userExists)
            {
                return NotFound();
            }

            return NoContent();
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
    }
} 
