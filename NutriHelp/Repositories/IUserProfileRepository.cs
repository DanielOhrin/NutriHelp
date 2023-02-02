using NutriHelp.Models;

namespace NutriHelp.Repositories
{
    public interface IUserProfileRepository
    {
        bool DoesUserExist(string firebaseUserId);
        UserType GetUserType(string firebaseUserId);
        bool IsDuplicate(string field, string value);
        void Register(UserProfile userProfile);
    }
}