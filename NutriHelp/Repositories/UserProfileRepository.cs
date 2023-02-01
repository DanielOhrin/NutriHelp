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
    }
}
