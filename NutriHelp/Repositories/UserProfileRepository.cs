using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks.Dataflow;

using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

using NutriHelp.Models;
using NutriHelp.Utils;

namespace NutriHelp.Repositories
{
    public class UserProfileRepository : BaseRepository, IUserProfileRepository
    {
        public UserProfileRepository(IConfiguration configuration) : base(configuration) { }

        public bool? DoesUserExist(string firebaseUserId)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT IsActive
                        FROM dbo.UserProfile
                        WHERE FirebaseId = @FirebaseUserId
                    ";

                    DbUtils.AddParameter(cmd, "@FirebaseUserId", firebaseUserId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        bool? isActive = null;
                        
                        if (reader.Read())
                        {
                            isActive = DbUtils.GetNullableBool(reader, "IsActive");
                        }

                        return isActive;
                    }
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
                    cmd.CommandText = "dbo.IsDuplicateUserData";

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

        public UserProfile GetByFirebaseId(string firebaseUserId, bool? showDetails)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    if (showDetails == null || showDetails == false)
                    {
                        cmd.CommandText = @$"
                        SELECT {SelectUserProfile("up")}, ut.[Name]
                        FROM dbo.UserProfile up
                        LEFT JOIN dbo.UserType ut ON ut.Id = up.UserTypeId
                        WHERE FirebaseId = @FirebaseUserId   
                    ";
                    }
                    else
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "dbo.DailyRundown";
                    }

                    DbUtils.AddParameter(cmd, "@FirebaseUserId", firebaseUserId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        UserProfile userProfile = null;

                        if (reader.Read())
                        {
                            userProfile = ConstructUserProfile(reader);
                            if (showDetails == true)
                            {
                                userProfile.DailyStats.CalorieGoal = DbUtils.GetInt(reader, "CalorieGoal");
                                userProfile.DailyStats.CaloriesRemaining = DbUtils.GetInt(reader, "CaloriesRemaining");
                                userProfile.DailyStats.WaterGoal = DbUtils.GetInt(reader, "WaterGoal");
                                userProfile.DailyStats.WaterRemaining = DbUtils.GetInt(reader, "WaterRemaining");
                                userProfile.DailyStats.ExerciseMinutes = DbUtils.GetInt(reader, "ExerciseMinutes");
                                userProfile.DailyStats.WaterConsumed = DbUtils.GetInt(reader, "WaterConsumed");
                                userProfile.DailyStats.Date = DbUtils.GetNullableDateTime(reader, "Date") ?? DateTime.Now;
                            }
                        }

                        return userProfile;
                    }
                }
            }
        }

        public void EditStat(string firebaseUserId, string field, int value) 
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "dbo.EditStat";

                    DbUtils.AddParameter(cmd, "@FirebaseUserId", firebaseUserId);
                    DbUtils.AddParameter(cmd, "@Field", field);
                    DbUtils.AddParameter(cmd, "@Value", value);

                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void Edit(UserProfile userProfile)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        UPDATE dbo.UserProfile
                        SET FirstName = @FirstName,
                            LastName = @LastName,
                            Gender = @Gender,
                            BirthDate = @BirthDate,
                            Weight = @Weight,
                            Height = @Height,
                            ActivityLevel = @ActivityLevel,
                            WeightGoal = @WeightGoal
                        WHERE Id = @Id
                    ";

                    DbUtils.AddParameter(cmd, "@FirstName", userProfile.FirstName);
                    DbUtils.AddParameter(cmd, "@LastName", userProfile.LastName);
                    DbUtils.AddParameter(cmd, "@Gender", userProfile.Gender);
                    DbUtils.AddParameter(cmd, "@BirthDate", userProfile.BirthDate);
                    DbUtils.AddParameter(cmd, "@Weight", userProfile.Weight);
                    DbUtils.AddParameter(cmd, "@Height", userProfile.Height);
                    DbUtils.AddParameter(cmd, "@ActivityLevel", userProfile.ActivityLevel);
                    DbUtils.AddParameter(cmd, "@WeightGoal", userProfile.WeightGoal);
                    DbUtils.AddParameter(cmd, "@Id", userProfile.Id);

                    cmd.ExecuteNonQuery();
                }
            }
        }

        public AllUsersDTO GetAll(int increment, int offset, bool isActive, string firebaseUserId)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT Id, FirstName, LastName, Email, Username, (SELECT COUNT(Id) FROM dbo.UserProfile WHERE IsActive = @IsActive AND FirebaseId != @FirebaseUserId) Total
                        FROM dbo.UserProfile
                        WHERE IsActive = @IsActive AND FirebaseId != @FirebaseUserId
                        ORDER BY LastName
                        OFFSET @Offset ROWS FETCH NEXT @Increment ROWS ONLY
                    ";

                    cmd.Parameters.Add(new SqlParameter()
                    {
                        ParameterName = "@IsActive",
                        Value = isActive,
                        SqlDbType = SqlDbType.Bit,
                        IsNullable = false
                    });

                    DbUtils.AddParameter(cmd, "@Offset", offset);
                    DbUtils.AddParameter(cmd, "@Increment", increment);
                    DbUtils.AddParameter(cmd, "@FirebaseUserId", firebaseUserId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        List<UserProfile> userProfiles = new();
                        AllUsersDTO newDTO = new();

                        while (reader.Read())
                        {
                            UserProfile newUserProfile = new()
                            {
                                Id = DbUtils.GetInt(reader, "Id"),
                                FirstName = DbUtils.GetString(reader, "FirstName"),
                                LastName = DbUtils.GetString(reader, "LastName"),
                                Email = DbUtils.GetString(reader, "Email"),
                                Username = DbUtils.GetString(reader, "Username")
                            };

                            userProfiles.Add(newUserProfile);

                            if (newDTO.Total == 0)
                            {
                                newDTO.Total = DbUtils.GetInt(reader, "Total");
                            }
                        }

                        newDTO.UserProfiles = userProfiles;
                        return newDTO;
                    }
                }
            }
        }

        public void Deactivate(int userId)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        UPDATE dbo.UserProfile
                        SET IsActive = 0
                        WHERE Id = @Id
                    ";

                    DbUtils.AddParameter(cmd, "@Id", userId);

                    cmd.ExecuteNonQuery();
                }
            }
        }       
        
        public void Activate(int userId)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        UPDATE dbo.UserProfile
                        SET IsActive = 1
                        WHERE Id = @Id
                    ";

                    DbUtils.AddParameter(cmd, "@Id", userId);

                    cmd.ExecuteNonQuery();
                }
            }
        }

        private static string SelectUserProfile(string alias)
        {
            if (alias != null)
            {
                return string.Format("{0}.Id, {0}.FirebaseId, {0}.Email, {0}.Username, {0}.FirstName, {0}.LastName, {0}.Gender, {0}.BirthDate, {0}.Weight, {0}.Height, {0}.ActivityLevel, {0}.WeightGoal, {0}.DateCreated, {0}.UserTypeId, {0}.IsActive", alias);
            }
            else
            {
                return "Id, FirebaseId, Email, Username, FirstName, LastName, Gender, BirthDate, Weight, Height, ActivityLevel, WeightGoal, DateCreated, UserTypeId, IsActive";
            }
        }

        private static UserProfile ConstructUserProfile(SqlDataReader reader)
        {
            return new UserProfile
            {
                Id = DbUtils.GetInt(reader, "Id"),
                FirebaseId = DbUtils.GetString(reader, "FirebaseId"),
                Email = DbUtils.GetString(reader, "Email"),
                Username = DbUtils.GetString(reader, "Username"),
                FirstName = DbUtils.GetString(reader, "FirstName"),
                LastName = DbUtils.GetString(reader, "LastName"),
                Gender = DbUtils.GetChar(reader, "Gender"),
                BirthDate = DbUtils.GetDateTime(reader, "BirthDate"),
                Weight = DbUtils.GetInt(reader, "Weight"),
                Height = DbUtils.GetInt(reader, "Height"),
                ActivityLevel = DbUtils.GetInt(reader, "ActivityLevel"),
                WeightGoal = DbUtils.GetInt(reader, "WeightGoal"),
                DateCreated = DbUtils.GetDateTime(reader, "DateCreated"),
                UserTypeId = DbUtils.GetInt(reader, "UserTypeId"),
                UserType = new()
                {
                    Id = DbUtils.GetInt(reader, "UserTypeId"),
                    Name = DbUtils.GetString(reader, "Name")
                },
                DailyStats = new DailyStats()
            };
        }
    }
}
