using System;
using System.Collections.Generic;
using System.Linq;

using NutriHelp.Models;
using NutriHelp.Repositories;


namespace NutriHelp.Tests.Mocks
{
    public class InMemoryUserProfileRepository : IUserProfileRepository
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

        public bool? DoesUserExist(string firebaseUserId)
        {
            UserProfile user = _data.FirstOrDefault(x => x.FirebaseId == firebaseUserId);

            //! If user does not exist
            if (user == null)
            {
                return null;
            }

            //! If user's account is deactivated
            if (user.IsActive == false)
            {
                return false;
            }

            //! If user's account is found and Active
            return true;
        }

        public UserType GetUserType(string firebaseUserId)
        {
            UserType userType = _data.FirstOrDefault(x => x.FirebaseId == firebaseUserId)?.UserType;

            return userType;
        }

        public bool IsDuplicate(string field, string value)
        {
            UserProfile profile = null;

            if (field.Equals("Email", StringComparison.OrdinalIgnoreCase))
            {
                profile = _data.FirstOrDefault(x => x.Email == value);
            }
            else if (field.Equals("Username", StringComparison.OrdinalIgnoreCase))
            {
                profile = _data.FirstOrDefault(x => x.Username == value);
            }

            return profile != null;
        }

        public void Register(UserProfile userProfile)
        {
            UserProfile lastProfile = _data.Last();
            userProfile.Id = lastProfile.Id + 1;
            _data.Add(userProfile);
        }

        public UserProfile GetByFirebaseId(string firebaseUserId, bool? showDetails)
        {
            return _data.FirstOrDefault(x => x.FirebaseId == firebaseUserId);
        }

        public void EditStat(string firebaseUserId, string field, int value)
        {
            if (!field.Equals("exerciseMinutes", StringComparison.OrdinalIgnoreCase) && !field.Equals("waterConsumed", StringComparison.OrdinalIgnoreCase))
            {
                return;
            }

            UserProfile userProfile = _data.First(x => x.FirebaseId == firebaseUserId);

            if (userProfile.DailyStats == null)
            {
                userProfile.DailyStats = new()
                {
                    Date = DateTime.Today
                };
            }

            if (field.Equals("exerciseMinutes", StringComparison.OrdinalIgnoreCase))
            {
                userProfile.DailyStats.ExerciseMinutes = value;
            }
            else if (field.Equals("waterConsumed", StringComparison.OrdinalIgnoreCase))
            {
                userProfile.DailyStats.WaterConsumed = value;
            }
        }

        public void Edit(UserProfile userProfile)
        {
            UserProfile currentProfile = _data.FirstOrDefault(x => x.Id == userProfile.Id);

            if (currentProfile == null)
            {
                return;
            }

            currentProfile.FirstName = userProfile.FirstName;
            currentProfile.LastName = userProfile.LastName;
            currentProfile.Gender = userProfile.Gender;
            currentProfile.BirthDate = userProfile.BirthDate;
            currentProfile.Weight = userProfile.Weight;
            currentProfile.Height = userProfile.Height;
            currentProfile.ActivityLevel = userProfile.ActivityLevel;
            currentProfile.WeightGoal = userProfile.WeightGoal;
        }

        public AllUsersDTO GetAll(int increment, int offset, bool isActive, string firebaseUserId = "firebase12")
        {
            List<UserProfile> profiles = _data.Where(x => x.FirebaseId != firebaseUserId && x.IsActive == isActive).ToList();

            AllUsersDTO dto = new()
            {
                UserProfiles = profiles.GetRange(offset, increment),
                Total = profiles.Count
            };

            return dto;
        }

        public void Deactivate(int userId)
        {
            _data.First(x => x.Id == userId).IsActive = false;
        }

        public void Activate(int userId)
        {
            _data.First(x => x.Id == userId).IsActive = true;
        }
    }
}
