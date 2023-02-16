using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Castle.Components.DictionaryAdapter;

using NutriHelp.Enums;
using NutriHelp.Models;
using NutriHelp.Repositories;
using NutriHelp.Tests.DTOs;

namespace NutriHelp.Tests.Mocks
{
    internal class InMemoryTicketRepository : ITicketRepository
    {
        private readonly TicketRepositoryDTO _data;

        public TicketRepositoryDTO InternalData
        {
            get
            {
                return _data;
            }
        }
        public InMemoryTicketRepository(TicketRepositoryDTO dto)
        {
            _data = dto;
        }

        public void Add(Ticket ticket)
        {
            Ticket lastTicket = _data.Tickets.Last();
            ticket.Id = lastTicket.Id + 1;
            _data.Tickets.Add(ticket);
        }

        public bool Close(int ticketId, string firebaseUserId)
        {
            bool result = false;

            UserProfile user = _data.UserProfiles.First(x => x.FirebaseId == firebaseUserId);
            Ticket ticket = _data.Tickets.First(x => x.Id == ticketId);

            if (user.Id == ticket.UserProfileId || user.UserTypeId == (int)UserTypeEnum.Admin)
            {
                ticket.DateClosed = DateTime.Now;

                result = true;
            }

            return result;
        }

        public List<Ticket> GetAll(string firebaseUserId)
        {
            List<Ticket> result = null;
            UserProfile userProfile = _data.UserProfiles.First(x => x.FirebaseId == firebaseUserId);

            if (userProfile.UserTypeId == (int)UserTypeEnum.Admin)
            {
                result = _data.Tickets;
            }
            else
            {
                int userId = _data.UserProfiles.First(x => x.FirebaseId == firebaseUserId).Id;

                result = _data.Tickets.Where(x => x.UserProfileId == userId).ToList();
            }
            
            return result;
        }

        public bool SendMessage(TicketMessage ticketMessage, string firebaseUserId)
        {
            bool result = false;

            UserProfile user = _data.UserProfiles.First(x => x.FirebaseId == firebaseUserId);
            Ticket ticket = _data.Tickets.First(x => x.Id == ticketMessage.TicketId);

            if ((user.Id == ticketMessage.UserProfileId && user.Id == ticket.UserProfileId) || user.UserTypeId == (int)UserTypeEnum.Admin)
            {
                ticketMessage.Id = _data.Tickets.Last().Id + 1;

                ticket.Messages.Add(ticketMessage);

                result = true;
            }

            return result;
        }        
        
        public Ticket GetSingle(int ticketId, string firebaseUserId)
        {
            Ticket ticket = _data.Tickets.First(x => x.Id == ticketId);

            UserProfile user = _data.UserProfiles.First(x => x.FirebaseId == firebaseUserId);

            if (user.Id == ticket.UserProfileId || user.UserTypeId == (int)UserTypeEnum.Admin)
            {
                return ticket;
            }

            return null;
        }
    }
}
