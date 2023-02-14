using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using NutriHelp.Models;

namespace NutriHelp.Tests.DTOs
{
    internal class MealRepositoryDTO
    {
        public List<Meal> Meals { get; set; }
        public List<UserProfile> UserProfiles { get; set; }
    }
}
