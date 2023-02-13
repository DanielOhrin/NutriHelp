using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using NutriHelp.Models;
using NutriHelp.Repositories;

namespace NutriHelp.Tests.Mocks
{
    public class InMemoryUserProfileRepository : 
    {
        private readonly List<UserProfile> _data;

        public List<UserProfile> InternalData
        {
            get
            {
                return _data;
            }
        }

        public InMemoryUserProfileRepository(List<UserProfile> startingData)
        {
            _data = startingData;
        }

        public void Add(UserProfile userProfile)
        {
            UserProfile lastProfile = _data.Last();
            userProfile.Id = lastProfile.Id + 1;
            _data.Add(userProfile);
        }
    }
}
