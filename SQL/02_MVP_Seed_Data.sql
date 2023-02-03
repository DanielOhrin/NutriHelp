use [NutriHelp]
GO

INSERT INTO dbo.UserType ([Name]) 
VALUES ('Admin'), ('User')

GO

INSERT INTO dbo.UserProfile (FirebaseId, Email, UserName, FirstName, LastName, Gender, BirthDate, [Weight], Height, ActivityLevel, WeightGoal, DateCreated, UserTypeId)
VALUES ('Yhf6rv0nBEa3bJMOAhSUsiMSTIi2', 'xqiam@outlook.com', 'FirstUser', 'Daniel', 'Ohrin', 'M', 'September 18, 2003', 91, 188, 3, 1, GETDATE(), 2),
('eUXXyY4SB3SEQMvG7vMyzUtDCsE2', 'daniel@ohrin.com', 'FirstAdmin', 'Daniel', 'Ohrin', 'M', 'September 18, 2003', 91, 188, 2, 2, GETDATE(), 1)