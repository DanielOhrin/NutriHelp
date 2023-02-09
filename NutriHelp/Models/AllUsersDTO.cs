using System.Collections.Generic;

namespace NutriHelp.Models
{
    public class AllUsersDTO
    {
        public List<UserProfile> UserProfiles { get; set; }
        public int Total { get; set; }
    }
}
