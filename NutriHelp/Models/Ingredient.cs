using System.ComponentModel.DataAnnotations;

namespace NutriHelp.Models
{
    public class Ingredient //! This is pretty much a join table to the food API
    {
        public int Id { get; set; }

        [StringLength(100)]
        public string Name { get; set; }
        
        public int CaloriesPerServing { get; set; }

        [StringLength(50)]
        public string ServingSize { get; set; }
    }
}
