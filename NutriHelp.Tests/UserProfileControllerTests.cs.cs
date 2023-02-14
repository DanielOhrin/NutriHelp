using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Moq;

using NutriHelp.Controllers;
using NutriHelp.Enums;
using NutriHelp.Models;
using NutriHelp.Tests.Mocks;

using Xunit;

namespace NutriHelp.Tests
{
    public class UserProfileControllerTests
    {
        [Fact]
        public void Get_By_Id_Returns_UserProfile_With_Given_Id()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> userProfiles = CreateTestUserProfiles(sampleSize);

            InMemoryUserProfileRepository repository = new(userProfiles);
            UserProfileController controller = new(repository);

            string firebaseUserId = $"firebase{5}";

            //! Act
            var result = controller.Get(firebaseUserId, null);

            //! Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var actualProfile = Assert.IsType<UserProfile>(okResult.Value);

            Assert.Equal(firebaseUserId, actualProfile.FirebaseId);
        }

        [Fact]
        public void Get_By_Id_Returns_NotFound_When_Given_Unknown_Id()
        {
            //! Arrange
            List<UserProfile> userProfiles = new();

            InMemoryUserProfileRepository repository = new(userProfiles);
            UserProfileController controller = new(repository);

            //! Act
            var result = controller.Get("InvalidId", null);

            //! Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public void Does_User_Exist_Returns_NoContent_When_Found_And_Active()
        {
            //! Arrange 
            int sampleSize = 20;
            List<UserProfile> userProfiles = CreateTestUserProfiles(sampleSize);

            InMemoryUserProfileRepository repository = new(userProfiles);
            UserProfileController controller = new(repository);

            string firebaseUserId = $"firebase{2}";

            //! Act
            var result = controller.DoesUserExist(firebaseUserId);

            //! Assert
            Assert.IsType<NoContentResult>(result);
        }        
        
        [Fact]
        public void Does_User_Exist_Returns_Conflict_When_Found_And_Inactive()
        {
            //! Arrange 
            int sampleSize = 20;
            List<UserProfile> userProfiles = CreateTestUserProfiles(sampleSize);

            InMemoryUserProfileRepository repository = new(userProfiles);
            UserProfileController controller = new(repository);

            string firebaseUserId = $"firebase{3}";

            //! Act
            var result = controller.DoesUserExist(firebaseUserId);

            //! Assert
            Assert.IsType<ConflictResult>(result);
        }        
        
        [Fact]
        public void Does_User_Exist_Returns_NotFound_When_Not_Found()
        {
            //! Arrange 
            int sampleSize = 20;
            List<UserProfile> userProfiles = CreateTestUserProfiles(sampleSize);

            InMemoryUserProfileRepository repository = new(userProfiles);
            UserProfileController controller = new(repository);

            string firebaseUserId = $"firebase{21}";

            //! Act
            var result = controller.DoesUserExist(firebaseUserId);

            //! Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact] 
        public void Get_User_Type_Returns_UserType_When_User_Is_Found()
        {
            //! Arrange 
            int sampleSize = 20;
            List<UserProfile> userProfiles = CreateTestUserProfiles(sampleSize);

            InMemoryUserProfileRepository repository = new(userProfiles);
            UserProfileController controller = new(repository);

            string firebaseUserId = $"firebase{2}";

            //! Act
            var result = controller.GetUserType(firebaseUserId);

            //! Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var userType = Assert.IsType<UserType>(okResult.Value);

            Assert.Equal((int)UserTypeEnum.User, userType.Id);
        }

        [Fact]
        public void Get_User_Type_Returns_NoContent_When_User_Not_Found()
        {
            //! Arrange 
            int sampleSize = 20;
            List<UserProfile> userProfiles = CreateTestUserProfiles(sampleSize);

            InMemoryUserProfileRepository repository = new(userProfiles);
            UserProfileController controller = new(repository);

            string firebaseUserId = $"firebase{21}";

            //! Act
            var result = controller.GetUserType(firebaseUserId);

            //! Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public void Is_Duplicate_Returns_True_When_Duplicate_Arguments_Given()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> userProfiles = CreateTestUserProfiles(sampleSize);

            InMemoryUserProfileRepository repository = new(userProfiles);
            UserProfileController controller = new(repository);

            //! Act
            var result = controller.IsDuplicateData("uSERname", "user2"); //! Purposefully random cAsInG

            //! Assert
            var okResult = Assert.IsType<OkObjectResult>(result);

            Assert.Equal(true, okResult.Value);
        }        
        
        [Fact]
        public void Is_Duplicate_Returns_False_When_Unique_Arguments_Given()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> userProfiles = CreateTestUserProfiles(sampleSize);

            InMemoryUserProfileRepository repository = new(userProfiles);
            UserProfileController controller = new(repository);

            //! Act
            var result = controller.IsDuplicateData("eMail", "uniqueEmail"); //! Purposefully random cAsInG

            //! Assert
            var okResult = Assert.IsType<OkObjectResult>(result);

            Assert.Equal(false, okResult.Value);
        }

        [Fact]
        public void Register_Returns_CreatedObject_And_Adds_User()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> userProfiles = CreateTestUserProfiles(sampleSize);

            InMemoryUserProfileRepository repository = new(userProfiles);
            UserProfileController controller = new(repository);

            UserProfile newProfile = new()
            {
                Id = sampleSize + 1,
                FirebaseId = $"firebase{sampleSize + 1}",
                Username = $"user{sampleSize + 1}",
                FirstName = $"first{sampleSize + 1}",
                LastName = $"last{sampleSize + 1}",
                Email = $"example{sampleSize + 1}@example.com",
                UserTypeId = 2,
                IsActive = (sampleSize + 1) % 2 == 0
            };

            //! Act
            var result = controller.Register(newProfile); //! Purposefully random cAsInG

            //! Assert
            var okResult = Assert.IsType<CreatedAtActionResult>(result);
            string createdFirebaseUserId = Assert.IsType<string>(okResult.RouteValues["firebaseUserId"]);
            
            Assert.Equal(newProfile.FirebaseId, createdFirebaseUserId);
        }

        [Fact]
        public void Edit_Stat_Creates_New_Table_When_Needed_And_Returns_NoContent()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> userProfiles = CreateTestUserProfiles(sampleSize);

            InMemoryUserProfileRepository repository = new(userProfiles);
            UserProfileController controller = new(repository);

            string firebaseUserId = $"firebase{5}";
            UserProfile existingProfile = userProfiles.First(x => x.FirebaseId == firebaseUserId);

            //! Act
            controller.EditStat(firebaseUserId, "exerciseMINUTES", 6);
            var result = controller.EditStat(firebaseUserId, "WATERconsumed", 4);

            //! Assert
            Assert.IsType<NoContentResult>(result);

            Assert.Equal(6, existingProfile.DailyStats.ExerciseMinutes);
            Assert.Equal(4, existingProfile.DailyStats.WaterConsumed);
            Assert.Equal(DateTime.Today, existingProfile.DailyStats.Date);
        }

        [Fact]
        public void Edit_Edits_UserProfile_And_Returns_NoContent()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> userProfiles = CreateTestUserProfiles(sampleSize);

            InMemoryUserProfileRepository repository = new(userProfiles);
            UserProfileController controller = new(repository);

            string firebaseUserId = $"firebase{5}";
            UserProfile existingProfile = userProfiles.First(x => x.FirebaseId == firebaseUserId);

            UserProfile newProfile = new()
            {
                Id = existingProfile.Id,
                FirstName = $"first{32}",
                LastName = $"last{32}",
            };

            //! Act
            var result = controller.EditProfile(newProfile);

            //! Assert
            Assert.IsType<NoContentResult>(result);

            Assert.Equal(newProfile.FirstName, existingProfile.FirstName);
            Assert.Equal(newProfile.LastName, existingProfile.LastName);
        }       
        
        [Fact]
        public void Get_All_Returns_All_Active_UserProfiles_Except_Current_With_Pagination()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> userProfiles = CreateTestUserProfiles(sampleSize);

            InMemoryUserProfileRepository repository = new(userProfiles);

            //? Mock HttpContext using Moq
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "firebase3")
            };
            var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
            var user = new ClaimsPrincipal(identity);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns(user);

            UserProfileController controller = new(repository);
            controller.ControllerContext = new()
            {
                HttpContext = httpContext.Object
            };

            int increment = 5;
            int offset = 5;

            //! Act
            var result = controller.GetAll(increment, offset, true);

            //! Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var dto = Assert.IsType<AllUsersDTO>(okResult.Value);

            Assert.Equal(10, dto.Total);
            Assert.Equal(12, dto.UserProfiles.First().Id);
            Assert.Equal(20, dto.UserProfiles.Last().Id);
        }

        [Fact] public void Deactivate_Deactivates_Only_The_Specific_User()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> userProfiles = CreateTestUserProfiles(sampleSize);

            InMemoryUserProfileRepository repository = new(userProfiles);

            //? Mock HttpContext using Moq
            var claims = new List<Claim>
            {   
                new Claim(ClaimTypes.NameIdentifier, "firebase3")
            };
            var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
            var user = new ClaimsPrincipal(identity);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns(user);

            UserProfileController controller = new(repository);
            controller.ControllerContext = new()
            {
                HttpContext = httpContext.Object
            };

            UserProfile existingProfile = userProfiles.First(x => x.IsActive == true);
            int activeProfiles = userProfiles.Count(x => x.IsActive == true);

            //! Act
            var result = controller.Deactivate(existingProfile.Id);
            int newActiveProfiles = userProfiles.Count(x => x.IsActive == true);

            //! Assert
            Assert.IsType<NoContentResult>(result);

            Assert.False(existingProfile.IsActive);
            Assert.Equal(activeProfiles - 1, newActiveProfiles);
        }       
        
        [Fact]
        public void Activate_Activates_Only_The_Specific_User()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> userProfiles = CreateTestUserProfiles(sampleSize);

            InMemoryUserProfileRepository repository = new(userProfiles);
            
            //? Mock HttpContext using Moq
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "firebase3")
            };
            var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
            var user = new ClaimsPrincipal(identity);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns(user);

            UserProfileController controller = new(repository);
            controller.ControllerContext = new()
            {
                HttpContext = httpContext.Object
            };

            UserProfile existingProfile = userProfiles.First(x => x.IsActive == false);
            int activeProfiles = userProfiles.Count(x => x.IsActive == true);

            //! Act
            var result = controller.Activate(existingProfile.Id);
            int newActiveProfiles = userProfiles.Count(x => x.IsActive == true);

            //! Assert
            Assert.IsType<NoContentResult>(result);

            Assert.True(existingProfile.IsActive);
            Assert.Equal(activeProfiles + 1, newActiveProfiles);
        }

        private List<UserProfile> CreateTestUserProfiles(int amount)
        {
            List<UserProfile> profiles = new();

            for (int i = 1; i <= amount; i++)
            {
                profiles.Add(new UserProfile
                { 
                    Id = i,
                    FirebaseId = $"firebase{i}",
                    Username = $"user{i}",
                    FirstName = $"first{i}",
                    LastName = $"last{i}",
                    Email = $"example{i}@example.com",
                    UserTypeId = i % 3 == 0 ? (int)UserTypeEnum.Admin : (int)UserTypeEnum.User,
                    IsActive = i % 2 == 0
                });
                AddUserType(profiles.Last());
            }

            return profiles;
        }

        private void AddUserType(UserProfile userProfile)
        { 
            UserType userType = new()
            {
                Id = userProfile.UserTypeId
            };

            switch (userType.Id)
            {
                case (int)UserTypeEnum.Admin:
                    userType.Name = "Admin";
                    break;
                case (int)UserTypeEnum.User:
                    userType.Name = "Admin";
                    break;
            }

            userProfile.UserType = userType;             
        }
    }
}
