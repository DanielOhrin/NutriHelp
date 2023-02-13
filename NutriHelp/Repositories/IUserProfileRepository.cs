using System.Collections.Generic;

using NutriHelp.Models;

namespace NutriHelp.Repositories
{
    public interface IUserProfileRepository
    {
        bool? DoesUserExist(string firebaseUserId);
        UserType GetUserType(string firebaseUserId);
        bool IsDuplicate(string field, string value);
        void Register(UserProfile userProfile);
        UserProfile GetByFirebaseId(string firebaseUserId, bool? showDetails);
        void EditStat(string firebaseUserId, string field, int value);
        void Edit(UserProfile userProfile);
        AllUsersDTO GetAll(int increment, int offset, int isActive, string firebaseUserId);
        void Deactivate(int userId);
        void Activate(int userId);
    }
}