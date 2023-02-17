using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Xml.Linq;

using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

using NutriHelp.Enums;
using NutriHelp.Models;
using NutriHelp.Utils;

namespace NutriHelp.Repositories
{
    public class TicketRepository : BaseRepository, ITicketRepository
    {
        public TicketRepository(IConfiguration config) : base(config) { }
        public void Add(Ticket ticket)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "dbo.CreateTicket";

                    DbUtils.AddParameter(cmd, "@Title", ticket.Title);
                    DbUtils.AddParameter(cmd, "@CategoryId", ticket.TicketCategoryId);
                    DbUtils.AddParameter(cmd, "@UserProfileId", ticket.UserProfileId);

                    DbUtils.AddParameter(cmd, "@Message", ticket.Messages[0].Message);
                    DbUtils.AddParameter(cmd, "@MessageUserProfileId", ticket.Messages[0].Message);

                    cmd.ExecuteNonQuery();
                }
            }
        }

        public bool Close(int ticketId, string firebaseUserId)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "dbo.CloseTicket";

                    DbUtils.AddParameter(cmd, "@TicketId", ticketId);
                    DbUtils.AddParameter(cmd, "@FirebaseUserId", firebaseUserId);

                    return (bool)cmd.ExecuteScalar();
                }
            }
        }

        public List<Ticket> GetAll(string firebaseUserId)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "dbo.GetTickets";

                    DbUtils.AddParameter(cmd, "@FirebaseUserId", firebaseUserId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        List<Ticket> tickets = new List<Ticket>();

                        while (reader.Read())
                        {
                            int ticketId = DbUtils.GetInt(reader, "Id");
                            Ticket ticket = tickets.FirstOrDefault(x => x.Id == ticketId);

                            if (ticket == null)
                            {
                                tickets.Add(
                                    new Ticket()
                                    {
                                        Id = ticketId,
                                        Title = DbUtils.GetString(reader, "Title"),
                                        DateOpened = DbUtils.GetDateTime(reader, "DateOpened"),
                                        DateClosed = DbUtils.GetNullableDateTime(reader, "DateClosed"),
                                        UserProfileId = DbUtils.GetInt(reader, "UserProfileId"),
                                        TicketCategoryId = DbUtils.GetInt(reader, "TicketCategoryId"),
                                        TicketCategory = new() { Id = DbUtils.GetInt(reader, "TicketCategoryId"), Name = DbUtils.GetString(reader, "Name") },
                                        Messages = new List<TicketMessage>()
                                    }
                                );

                                ticket = tickets.First(x => x.Id == ticketId);
                            }

                            ticket.Messages.Add(
                                new TicketMessage()
                                {
                                    Id = DbUtils.GetInt(reader, "MessageId"),
                                    Message = DbUtils.GetString(reader, "Message"),
                                    TicketId = ticket.Id,
                                    UserProfileId = DbUtils.GetInt(reader, "MessageUserProfileId"),
                                    DateSent = DbUtils.GetDateTime(reader, "DateSent")
                                }
                            );
                        }

                        return tickets;
                    }
                }
            }
        }

        public bool SendMessage(TicketMessage ticketMessage, string firebaseUserId)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "dbo.SendMessage";

                    DbUtils.AddParameter(cmd, "@Message", ticketMessage.Message);
                    DbUtils.AddParameter(cmd, "@MessageUserProfileId", ticketMessage.UserProfileId);
                    DbUtils.AddParameter(cmd, "@TicketId", ticketMessage.TicketId);
                    DbUtils.AddParameter(cmd, "@FirebaseUserId", firebaseUserId);

                    return (bool)cmd.ExecuteScalar();
                }
            }
        }

        public Ticket GetSingle(int id, string firebaseUserId)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "dbo.GetSingleTicket";

                    DbUtils.AddParameter(cmd, "@TicketId", id);
                    DbUtils.AddParameter(cmd, "@FirebaseUserId", firebaseUserId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        Ticket ticket = null;

                        while (reader.Read())
                        {
                            if (DbUtils.GetBool(reader, "IsAuthorized") == false)
                            {
                                break;
                            }

                            if (ticket == null)
                            {
                                ticket = new()
                                {
                                    Id = DbUtils.GetInt(reader, "Id"),
                                    Title = DbUtils.GetString(reader, "Title"),
                                    DateOpened = DbUtils.GetDateTime(reader, "DateOpened"),
                                    DateClosed = DbUtils.GetNullableDateTime(reader, "DateClosed"),
                                    UserProfileId = DbUtils.GetInt(reader, "UserProfileId"),
                                    UserProfile = new() { Id = DbUtils.GetInt(reader, "UserProfileId"), Username = DbUtils.GetString(reader, "Username") },
                                    TicketCategoryId = DbUtils.GetInt(reader, "TicketCategoryId"),
                                    TicketCategory = new() { Id = DbUtils.GetInt(reader, "TicketCategoryId"), Name = DbUtils.GetString(reader, "Name") },
                                    Messages = new List<TicketMessage>()
                                };
                            }

                            ticket.Messages.Add(
                                new TicketMessage()
                                {
                                    Id = DbUtils.GetInt(reader, "MessageId"),
                                    Message = DbUtils.GetString(reader, "Message"),
                                    TicketId = ticket.Id,
                                    UserProfileId = DbUtils.GetInt(reader, "MessageUserProfileId"),
                                    UserProfile = new() { Id = DbUtils.GetInt(reader, "MessageUserProfileId"), Username = DbUtils.GetString(reader, "Username") },
                                    DateSent = DbUtils.GetDateTime(reader, "DateSent")
                                }
                            );
                        }

                        return ticket;
                    }
                }
            }
        }
    }
}
