using System.Collections.Generic;

using NutriHelp.Models;

namespace NutriHelp.Repositories
{
    public interface ITicketRepository
    {
        List<Ticket> GetAll(string firebaseUserId);
        void Add(Ticket ticket);
        bool Close(int ticketId, string firebaseUserId);
        bool SendMessage(TicketMessage ticketMessage, string firebaseUserId);
    }
}
