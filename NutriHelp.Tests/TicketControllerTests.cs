using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Moq;

using NutriHelp.Controllers;
using NutriHelp.Enums;
using NutriHelp.Models;
using NutriHelp.Tests.DTOs;
using NutriHelp.Tests.Mocks;

using Xunit;

namespace NutriHelp.Tests
{
    public class TicketControllerTests
    {
        [Fact]
        public void Post_Returns_Created_Object_And_Adds_User()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> users = CreateTestUserProfiles(sampleSize);
            List<Ticket> tickets = CreateTestTickets(sampleSize);

            TicketRepositoryDTO dto = new()
            {
                Tickets = tickets,
                UserProfiles = users
            };

            InMemoryTicketRepository repository = new(dto);

            TicketController controller = new(repository);

            int ticketNum = sampleSize + 1;
            Ticket newTicket = new Ticket()
            {
                Id = 0,
                UserProfileId = ticketNum,
                DateOpened = DateTime.Today,
                TicketCategoryId = ticketNum,
                Title = $"Test Title {ticketNum}",
                DateClosed = null,
                Messages = new List<TicketMessage>
                    {
                        new TicketMessage()
                        {
                            Id = ticketNum,
                            TicketId = ticketNum,
                            UserProfileId = ticketNum,
                            DateSent = DateTime.Now,
                            Message = $"Test Message {ticketNum}"
                        }
                    }
            };

            //! Act
            var result = controller.Post(newTicket); //! Purposefully random cAsInG

            //! Assert
            var okResult = Assert.IsType<CreatedAtActionResult>(result);
            int createdId = Assert.IsType<int>(okResult.RouteValues["Id"]);

            Assert.NotEqual(0, newTicket.Id);

            Assert.Equal(newTicket.Id, createdId);
        }

        [Fact]
        public void Close_Returns_NoContent_And_Succeeds_When_Requester_Is_Ticket_Creator()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> users = CreateTestUserProfiles(sampleSize);
            List<Ticket> tickets = CreateTestTickets(sampleSize);

            TicketRepositoryDTO dto = new()
            {
                Tickets = tickets,
                UserProfiles = users
            };

            InMemoryTicketRepository repository = new(dto);

            //? Mock HttpContext using Moq
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "firebase1")
            };
            var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
            var user = new ClaimsPrincipal(identity);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns(user);

            TicketController controller = new(repository);
            controller.ControllerContext = new()
            {
                HttpContext = httpContext.Object
            };

            //! Act
            var result = controller.Close(1);

            //! Assert
            Assert.IsType<NoContentResult>(result);
            Assert.NotNull(dto.Tickets.First(x => x.Id == 1).DateClosed);
        }

        [Fact]
        public void Close_Returns_NoContent_And_Succeeds_When_Requester_Is_Admin()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> users = CreateTestUserProfiles(sampleSize);
            List<Ticket> tickets = CreateTestTickets(sampleSize);

            TicketRepositoryDTO dto = new()
            {
                Tickets = tickets,
                UserProfiles = users
            };

            InMemoryTicketRepository repository = new(dto);

            //? Mock HttpContext using Moq
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "firebase3")
            };
            var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
            var user = new ClaimsPrincipal(identity);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns(user);

            TicketController controller = new(repository);
            controller.ControllerContext = new()
            {
                HttpContext = httpContext.Object
            };

            //! Act
            var result = controller.Close(1);

            //! Assert
            Assert.IsType<NoContentResult>(result);
            Assert.NotNull(dto.Tickets.First(x => x.Id == 1).DateClosed);
        }

        [Fact]
        public void Close_Returns_Unauthorized_And_Does_Not_Close_Ticket_When_Requester_Not_Admin_Or_Ticket_Creator()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> users = CreateTestUserProfiles(sampleSize);
            List<Ticket> tickets = CreateTestTickets(sampleSize);

            TicketRepositoryDTO dto = new()
            {
                Tickets = tickets,
                UserProfiles = users
            };

            InMemoryTicketRepository repository = new(dto);

            //? Mock HttpContext using Moq
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "firebase2")
            };
            var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
            var user = new ClaimsPrincipal(identity);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns(user);

            TicketController controller = new(repository);
            controller.ControllerContext = new()
            {
                HttpContext = httpContext.Object
            };

            //! Act
            var result = controller.Close(1);

            //! Assert
            Assert.IsType<UnauthorizedResult>(result);
            Assert.Null(dto.Tickets.First(x => x.Id == 1).DateClosed);
        }

        [Fact]
        public void SendMessage_Returns_NoContent_And_Succeeds_When_Requester_Is_Ticket_Creator()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> users = CreateTestUserProfiles(sampleSize);
            List<Ticket> tickets = CreateTestTickets(sampleSize);

            TicketRepositoryDTO dto = new()
            {
                Tickets = tickets,
                UserProfiles = users
            };

            InMemoryTicketRepository repository = new(dto);

            TicketMessage newMessage = new TicketMessage()
            {
                Id = 0,
                TicketId = 1,
                UserProfileId = 1,
                DateSent = DateTime.Now,
                Message = $"Test Message {50}"
            };

            //? Mock HttpContext using Moq
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "firebase1")
            };
            var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
            var user = new ClaimsPrincipal(identity);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns(user);

            TicketController controller = new(repository);
            controller.ControllerContext = new()
            {
                HttpContext = httpContext.Object
            };

            //! Act
            var result = controller.SendMessage(newMessage);

            //! Assert
            Assert.IsType<NoContentResult>(result);
            Assert.NotEqual(0, newMessage.Id);
        }

        [Fact]
        public void SendMessage_Returns_NoContent_And_Succeeds_When_Requester_Is_Admin()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> users = CreateTestUserProfiles(sampleSize);
            List<Ticket> tickets = CreateTestTickets(sampleSize);

            TicketRepositoryDTO dto = new()
            {
                Tickets = tickets,
                UserProfiles = users
            };

            InMemoryTicketRepository repository = new(dto);

            TicketMessage newMessage = new TicketMessage()
            {
                Id = 0,
                TicketId = 1,
                UserProfileId = 1,
                DateSent = DateTime.Now,
                Message = $"Test Message {50}"
            };

            //? Mock HttpContext using Moq
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "firebase3")
            };
            var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
            var user = new ClaimsPrincipal(identity);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns(user);

            TicketController controller = new(repository);
            controller.ControllerContext = new()
            {
                HttpContext = httpContext.Object
            };

            //! Act
            var result = controller.SendMessage(newMessage);

            //! Assert
            Assert.IsType<NoContentResult>(result);
            Assert.NotEqual(0, newMessage.Id);
        }
        
        [Fact]
        public void Get_Returns_Ok_With_Only_Tickets_Created_By_Requester()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> users = CreateTestUserProfiles(sampleSize);
            List<Ticket> tickets = CreateTestTickets(sampleSize);

            TicketRepositoryDTO dto = new()
            {
                Tickets = tickets,
                UserProfiles = users
            };

            InMemoryTicketRepository repository = new(dto);

            Ticket existingTicket = dto.Tickets.First();

            //? Mock HttpContext using Moq
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "firebase1")
            };
            var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
            var user = new ClaimsPrincipal(identity);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns(user);

            TicketController controller = new(repository);
            controller.ControllerContext = new()
            {
                HttpContext = httpContext.Object
            };

            //! Act
            var result = controller.Get();

            //! Assert
            Assert.Contains(existingTicket, dto.Tickets);
            
            var okResult = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<List<Ticket>>(okResult.Value);
            
            Assert.Single(value);
        }
        
        [Fact]
        public void Get_Returns_All_Tickets_When_Requester_Is_Admin()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> users = CreateTestUserProfiles(sampleSize);
            List<Ticket> tickets = CreateTestTickets(sampleSize);

            TicketRepositoryDTO dto = new()
            {
                Tickets = tickets,
                UserProfiles = users
            };

            InMemoryTicketRepository repository = new(dto);

            //? Mock HttpContext using Moq
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "firebase3")
            };
            var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
            var user = new ClaimsPrincipal(identity);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns(user);

            TicketController controller = new(repository);
            controller.ControllerContext = new()
            {
                HttpContext = httpContext.Object
            };

            //! Act
            var result = controller.Get();

            //! Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<List<Ticket>>(okResult.Value);

            Assert.StrictEqual(dto.Tickets, value);
        }
        
        
        [Fact]
        public void GetSingle_Returns_Ok_With_Ticket_When_Created_By_Requester()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> users = CreateTestUserProfiles(sampleSize);
            List<Ticket> tickets = CreateTestTickets(sampleSize);

            TicketRepositoryDTO dto = new()
            {
                Tickets = tickets,
                UserProfiles = users
            };

            InMemoryTicketRepository repository = new(dto);

            Ticket existingTicket = dto.Tickets.First();

            //? Mock HttpContext using Moq
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "firebase1")
            };
            var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
            var user = new ClaimsPrincipal(identity);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns(user);

            TicketController controller = new(repository);
            controller.ControllerContext = new()
            {
                HttpContext = httpContext.Object
            };

            //! Act
            var result = controller.GetSingle(1);

            //! Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);

            var returnValue = Assert.IsType<Ticket>(okResult.Value);
            Assert.StrictEqual(existingTicket, okResult.Value);
        }
        
        [Fact]
        public void Get_Single_Returns_Ticket_When_Requester_Is_Admin()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> users = CreateTestUserProfiles(sampleSize);
            List<Ticket> tickets = CreateTestTickets(sampleSize);

            TicketRepositoryDTO dto = new()
            {
                Tickets = tickets,
                UserProfiles = users
            };

            InMemoryTicketRepository repository = new(dto);

            Ticket existingTicket = dto.Tickets.First();

            //? Mock HttpContext using Moq
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "firebase3")
            };
            var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
            var user = new ClaimsPrincipal(identity);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns(user);

            TicketController controller = new(repository);
            controller.ControllerContext = new()
            {
                HttpContext = httpContext.Object
            };

            //! Act
            var result = controller.GetSingle(1);

            //! Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);

            var returnValue = Assert.IsType<Ticket>(okResult.Value);
            Assert.StrictEqual(existingTicket, okResult.Value);
        }

        [Fact]
        public void GetSingle_Returns_Unauthorized_When_Requester_Is_Not_Admin_Or_Ticket_Creator()
        {
            //! Arrange
            int sampleSize = 20;
            List<UserProfile> users = CreateTestUserProfiles(sampleSize);
            List<Ticket> tickets = CreateTestTickets(sampleSize);

            TicketRepositoryDTO dto = new()
            {
                Tickets = tickets,
                UserProfiles = users
            };

            InMemoryTicketRepository repository = new(dto);

            //? Mock HttpContext using Moq
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "firebase2")
            };
            var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
            var user = new ClaimsPrincipal(identity);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns(user);

            TicketController controller = new(repository);
            controller.ControllerContext = new()
            {
                HttpContext = httpContext.Object
            };

            //! Act
            var result = controller.GetSingle(1);

            //! Assert
            Assert.IsType<UnauthorizedResult>(result);
        }

        private List<Ticket> CreateTestTickets(int maxAmount)
        {
            List<Ticket> tickets = new()
            {
                new Ticket()
                {
                    Id = 1,
                    UserProfileId = 1,
                    DateOpened = DateTime.Today,
                    TicketCategoryId = 1,
                    Title = $"Test Title {1}",
                    DateClosed = null,
                    Messages = new List<TicketMessage>
                    {
                        new TicketMessage()
                        {
                            Id = 1,
                            TicketId = 1,
                            UserProfileId = 1,
                            DateSent = DateTime.Now,
                            Message = $"Test Message {1}"
                        },
                        new TicketMessage()
                        {
                            Id = 2,
                            TicketId = 1,
                            UserProfileId = 1,
                            DateSent = DateTime.Now,
                            Message = $"Test Message {2}"
                        }
                    }
                }
            };


            for (int i = 2; i <= maxAmount; i++)
            {
                if (new Random().Next(2) == 1)
                {
                    tickets.Add(
                        new Ticket()
                        {
                            Id = i,
                            UserProfileId = i,
                            DateOpened = DateTime.Today,
                            TicketCategoryId = i,
                            Title = $"Test Title {i}",
                            DateClosed = null,
                            Messages = new List<TicketMessage>
                            {
                                new TicketMessage()
                                {
                                    Id = i + 1,
                                    TicketId = i,
                                    UserProfileId = i,
                                    DateSent = DateTime.Now,
                                    Message = $"Test Message {i}"
                                }
                            }
                        }
                    );
                }
            }

            return tickets;
        }

        private List<UserProfile> CreateTestUserProfiles(int amount)
        {
            List<UserProfile> profiles = new();

            for (int i = 1; i <= amount; i++)
            {
                profiles.Add(new UserProfile
                {
                    Id = i,
                    FirebaseId = $"firebase{i}",
                    Username = $"user{i}",
                    FirstName = $"first{i}",
                    LastName = $"last{i}",
                    Email = $"example{i}@example.com",
                    UserTypeId = i % 3 == 0 ? (int)UserTypeEnum.Admin : (int)UserTypeEnum.User,
                    IsActive = i % 2 == 0
                });
                AddUserType(profiles.Last());
            }

            return profiles;
        }

        private void AddUserType(UserProfile userProfile)
        {
            UserType userType = new()
            {
                Id = userProfile.UserTypeId
            };

            switch (userType.Id)
            {
                case (int)UserTypeEnum.Admin:
                    userType.Name = "Admin";
                    break;
                case (int)UserTypeEnum.User:
                    userType.Name = "Admin";
                    break;
            }

            userProfile.UserType = userType;
        }
    }
}

