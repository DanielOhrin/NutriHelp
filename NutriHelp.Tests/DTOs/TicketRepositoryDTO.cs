using System.Collections.Generic;

using NutriHelp.Models;

namespace NutriHelp.Tests.DTOs
{
    internal class TicketRepositoryDTO
    {
        public List<Ticket> Tickets { get; set; }
        public List<UserProfile> UserProfiles { get; set; }
    }
}
