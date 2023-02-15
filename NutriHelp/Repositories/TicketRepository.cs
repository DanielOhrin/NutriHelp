using System.Collections.Generic;

using NutriHelp.Models;

namespace NutriHelp.Repositories
{
    public class TicketRepository : ITicketRepository
    {
        public void Add(Ticket ticket)
        {
            throw new System.NotImplementedException();
        }

        public bool Close(int ticketId, string firebaseUserId)
        {
            throw new System.NotImplementedException();
        }

        public List<Ticket> GetAll(string firebaseUserId)
        {
            throw new System.NotImplementedException();
        }

        public bool SendMessage(TicketMessage ticketMessage, string firebaseUserId)
        {
            throw new System.NotImplementedException();
        }
    }
}
