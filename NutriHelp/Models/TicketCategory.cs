using System.ComponentModel.DataAnnotations;

namespace NutriHelp.Models
{
    public class TicketCategory
    {
        public int Id { get; set; }

        [StringLength(30)]
        public string Name { get; set; }
    }
}
