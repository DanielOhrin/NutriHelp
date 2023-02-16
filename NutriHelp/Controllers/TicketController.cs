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

        public TicketController(ITicketRepository ticketRepository)
        {
            _ticketRepository = ticketRepository;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_ticketRepository.GetAll(CurrentUID));
        }

        [HttpPost]
        public IActionResult Post([FromBody] Ticket ticket)
        {
            _ticketRepository.Add(ticket);

            return CreatedAtAction("GET", new { Id = ticket.Id }, ticket);
        }

        [HttpGet("{id}")]
        public IActionResult GetSingle(int id)
        {
            Ticket ticket = _ticketRepository.GetSingle(id, CurrentUID);

            return ticket == null ? Unauthorized() : Ok(ticket);
        }

        [HttpPatch("close/{ticketId}")]
        public IActionResult Close([FromRoute] int ticketId)
        {
            bool isAuthorized = _ticketRepository.Close(ticketId, CurrentUID);

            return isAuthorized == true ? NoContent() : Unauthorized();
        }

        [HttpPost("message")]
        public IActionResult SendMessage([FromBody] TicketMessage ticketMessage)
        {
           bool isAuthorized =  _ticketRepository.SendMessage(ticketMessage, CurrentUID);

            return isAuthorized == true ? NoContent() : Unauthorized();
        }

        private string CurrentUID => User.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}
