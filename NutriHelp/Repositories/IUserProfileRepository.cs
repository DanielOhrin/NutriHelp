﻿using NutriHelp.Models;

namespace NutriHelp.Repositories
{
    public interface IUserProfileRepository
    {
        bool DoesUserExist(string firebaseUserId);
        UserType GetUserType(string firebaseUserId);
    }
}