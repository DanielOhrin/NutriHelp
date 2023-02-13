using System.Collections.Generic;

using NutriHelp.Models;

namespace NutriHelp.Repositories
{
    public interface ITicketRepository
    {
        void Add(Ticket ticket);
        List<Ticket> GetAll(string? firebaseUserId);
        void Close(int id);
    }
}
