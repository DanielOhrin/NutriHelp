use [NutriHelp]
GO

INSERT INTO dbo.UserType ([Name]) 
VALUES ('Admin'), ('User')

GO

INSERT INTO dbo.UserProfile (FirebaseId, Email, UserName, FirstName, LastName, Gender, BirthDate, [Weight], Height, ActivityLevel, WeightGoal, DateCreated, UserTypeId)
VALUES ('eUXXyY4SB3SEQMvG7vMyzUtDCsE2', 'daniel@ohrin.com', 'FirstUser', 'Daniel', 'Ohrin', 'M', 'November 24, 1998', 91, 188, 3, 1, GETDATE(), 2),
('oxFLJa1mS7ZU59MBTn7kyNBvkCt1', 'admin@nutrihelp.com', 'FirstAdmin', 'Daniel', 'Ohrin', 'M', 'January 20, 2000', 91, 188, 2, 2, GETDATE(), 1),
('V0UlF3G3EYga2JLhp9nMsT3SagR2', 'uniqueemail@gmail.com', 'SecondUser', 'Test', 'User', 'M', 'December 23, 2001', 75, 188, 3, 1, GETDATE(), 2),
('yuItPwCt2tMwIFjiyLUkDxeRuno2', 'unique@email.com', 'ThirdUser', 'Test2', 'User2', 'M', 'January 2, 2001', 91, 188, 2, 2, GETDATE(), 1),
('kkntmuhiNQZrjchgS8DyJupfr723', 'example@gmail.com', 'FourthUser', 'Daniel', 'Ohrin', 'M', 'May 4, 2002', 91, 188, 3, 1, GETDATE(), 2)
GO

INSERT INTO dbo.MealType ([Name]) VALUES ('Breakfast'), ('Lunch'), ('Dinner'), ('Snacks')
GO

INSERT INTO dbo.TicketCategory ([Name]) VALUES ('General'), ('Feature Request'), ('Account'), ('Bug Report')
GO

INSERT INTO dbo.Ticket (Title, TicketCategoryId, UserProfileId) VALUES ('Test Ticket 1', 1, 1), ('Test Ticket 2', 1, 1), ('Test Ticket 3', 1, 1)
GO
INSERT INTO dbo.TicketMessage ([Message], DateSent, TicketId, UserProfileId) VALUES ('Test Message', '2023-02-16 20:30:44.290', 1, 1), ('Test Message', NULL, 2, 1), ('Test Message', NULL, 3, 1), ('Hello, are there any job openings for NutriHelp?', '2023-02-16 20:32:46.833', 1, 1)