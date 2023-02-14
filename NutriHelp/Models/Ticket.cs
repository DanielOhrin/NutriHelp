using System;
using System.ComponentModel.DataAnnotations;

namespace NutriHelp.Models
{
    public class Ticket
    {
        public int Id { get; set; }

        [StringLength(100)]
        public string Title { get; set; }

        public DateTime DateOpened { get; set; }
        public DateTime? DateClosed { get; set; }

        public int TicketCategoryId { get; set; }
        public TicketCategory TicketCategory { get; set; }

        public int UserProfileId { get; set; }
        public UserProfile UserProfile { get; set; }
    }
}