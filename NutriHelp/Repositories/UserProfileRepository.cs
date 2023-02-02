using System;
using System.Data;

using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

using NutriHelp.Models;
using NutriHelp.Utils;

namespace NutriHelp.Repositories
{
    public class UserProfileRepository : BaseRepository, IUserProfileRepository
    {
        public UserProfileRepository(IConfiguration configuration) : base(configuration) { }

        public bool DoesUserExist(string firebaseUserId)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT COUNT(Id)
                        FROM dbo.UserProfile
                        WHERE FirebaseId = @FirebaseUserId
                    ";

                    DbUtils.AddParameter(cmd, "@FirebaseUserId", firebaseUserId);

                    return (int)cmd.ExecuteScalar() == 1;
                }
            }
        }

        public UserType GetUserType(string firebaseUserId)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT ut.Id, ut.[Name]
                        FROM dbo.UserProfile up
                        LEFT JOIN dbo.UserType ut ON ut.Id = up.UserTypeId
                        WHERE up.FirebaseId = @FirebaseUserId
                    ";

                    DbUtils.AddParameter(cmd, "@FirebaseUserId", firebaseUserId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        UserType userType = null;

                        if (reader.Read())
                        {
                            userType = new()
                            {
                                Id = DbUtils.GetInt(reader, "Id"),
                                Name = DbUtils.GetString(reader, "Name")
                            };
                        }

                        return userType;
                    }
                }
            }
        }

        public bool IsDuplicate(string field, string value)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "IsDuplicateUserData";

                    DbUtils.AddParameter(cmd, "@Field", field);
                    DbUtils.AddParameter(cmd, "@Value", value);

                    return (int)cmd.ExecuteScalar() != 0;
                }
            }
        }

        public void Register(UserProfile userProfile)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        INSERT INTO dbo.UserProfile (FirebaseId, Email, Username, FirstName, LastName, Gender, BirthDate, Weight, Height, ActivityLevel, WeightGoal, DateCreated)
                        OUTPUT INSERTED.Id
                        VALUES (@FirebaseId, @Email, @Username, @FirstName, @LastName, @Gender, @BirthDate, @Weight, @Height, @ActivityLevel, @WeightGoal, @DateCreated)
                    ";

                    DbUtils.AddParameter(cmd, "@FirebaseId", userProfile.FirebaseId);
                    DbUtils.AddParameter(cmd, "@Email", userProfile.Email);
                    DbUtils.AddParameter(cmd, "@Username", userProfile.Username);
                    DbUtils.AddParameter(cmd, "@FirstName", userProfile.FirstName);
                    DbUtils.AddParameter(cmd, "@LastName", userProfile.LastName);
                    DbUtils.AddParameter(cmd, "@Gender", userProfile.Gender);
                    DbUtils.AddParameter(cmd, "@BirthDate", userProfile.BirthDate);
                    DbUtils.AddParameter(cmd, "@Weight", userProfile.Weight);
                    DbUtils.AddParameter(cmd, "@Height", userProfile.Height);
                    DbUtils.AddParameter(cmd, "@ActivityLevel", userProfile.ActivityLevel);
                    DbUtils.AddParameter(cmd, "@WeightGoal", userProfile.WeightGoal);
                    DbUtils.AddParameter(cmd, "@DateCreated", DateTime.Now);

                    userProfile.Id = (int)cmd.ExecuteScalar();
                }
            }
        }
    }
}
