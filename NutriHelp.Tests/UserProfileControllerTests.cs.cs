using System;
using System.Collections.Generic;

using NutriHelp.Controllers;
using NutriHelp.Models;
using NutriHelp.Tests.Mocks;

using Xunit;

namespace NutriHelp.Tests
{
    public class UnitTest1
    {
        [Fact]
        public void Get_By_Id_Returns_UserProfile()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> userProfiles = CreateTestUserProfiles(sampleSize);

            UserProfileController controller = new(new InMemoryUserProfileRepository(userProfiles));

            //! Act


            //! Assert
        }

        private List<UserProfile> CreateTestUserProfiles(int amount)
        {
            List<UserProfile> profiles = new();

            for (int i = 0; i < amount; i++)
            {
                profiles.Add(new UserProfile
                { 
                    Id = i,
                    FirebaseId = $"firebase{i}",
                    Email = $"example{i}@example.com"
                });
            }

            return profiles;
        }
    }
}
