using System;
using System.ComponentModel.DataAnnotations;

namespace NutriHelp.Models
{
    public class TicketMessage
    {
        public int Id { get; set; }

        [Required]
        public string Message { get; set; }

        [Required]
        public int TicketId { get; set; }

        [Required]
        public int UserProfileId { get; set; }
        
        public UserProfile UserProfile { get; set; }
        public DateTime DateSent { get; set; }
    }
}
