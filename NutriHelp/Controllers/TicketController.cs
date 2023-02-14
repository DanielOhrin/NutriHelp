using System.Collections.Generic;
using System.Security.Claims;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;

using NutriHelp.Enums;
using NutriHelp.Models;
using NutriHelp.Repositories;

namespace NutriHelp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TicketController : ControllerBase
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly IUserProfileRepository _userProfileRepository;

        public TicketController(ITicketRepository ticketRepository, IUserProfileRepository userProfileRepository)
        {
            _ticketRepository = ticketRepository;
            _userProfileRepository = userProfileRepository;
        }

        [HttpGet]
        public IActionResult Get()
        {
            UserProfile userProfile = _userProfileRepository.GetByFirebaseId(CurrentUID, false);

            if (userProfile.UserTypeId != (int)UserTypeEnum.Admin)
            {
                return Ok(_ticketRepository.GetAll(CurrentUID));
            }

            return Ok(_ticketRepository.GetAll(null));
        }

        [HttpPost]
        public IActionResult Post([FromBody] Ticket ticket)
        {
            _ticketRepository.Add(ticket);

            return CreatedAtAction("GET", ticket.Id, ticket);
        }

        [HttpPatch("close/{ticketId}")]
        public IActionResult Close([FromRoute] int ticketId)
        {
            _ticketRepository.Close(ticketId);

            return NoContent();
        }

        private string CurrentUID => User.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}
