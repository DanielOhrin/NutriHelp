use [master]
GO

IF db_id('NutriHelp') IS NOT NULL
  DROP DATABASE NutriHelp
GO

CREATE DATABASE NutriHelp
GO

USE [NutriHelp]
GO

DROP TABLE IF EXISTS [UserProfile];
DROP TABLE IF EXISTS [UserType];
DROP TABLE IF EXISTS [DailyUserStats]
DROP TABLE IF EXISTS [Meal]
DROP TABLE IF EXISTS [MealType]
DROP TABLE IF EXISTS [MealIngredient]
DROP TABLE IF EXISTS [Ingredient]

GO 

DROP TABLE IF EXISTS [UserProfile]

CREATE TABLE [UserProfile] (
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [FirebaseId] nvarchar(28) UNIQUE NOT NULL,
  [Email] nvarchar(30) UNIQUE NOT NULL,
  [Username] nvarchar(15) UNIQUE NOT NULL,
  [FirstName] nvarchar(25) NOT NULL,
  [LastName] nvarchar(25) NOT NULL,
  [Gender] char NOT NULL,
  [BirthDate] datetime NOT NULL,
  [Weight] int NOT NULL,
  [Height] int NOT NULL,
  [ActivityLevel] int NOT NULL, /* 1, 2, 3, 4 */
  [WeightGoal] int NOT NULL,
  [DateCreated] datetime NOT NULL,
  [IsActive] bit NOT NULL DEFAULT (1),
  [UserTypeId] int NOT NULL DEFAULT(2),
  [CalorieDiff] AS ( /* Determined by their goals (lose or gain 1/2 lbs. per week */
  CASE 
	WHEN [WeightGoal] = 1 THEN -1000 /* Lose 2 lbs./week */
	WHEN [WeightGoal] = 2 THEN -500 /* Lose 1 lbs./week */
	WHEN [WeightGoal] = 3 THEN 0  /* Maintain weight */
	WHEN [WeightGoal] = 4 THEN 500 /* Gain 1 lbs./week */
	WHEN [WeightGoal] = 5 THEN 1000 /* Gain 2 lbs./week */
  END
  )
)
GO

CREATE TABLE [DailyUserStats] (
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [UserProfileId] int NOT NULL,
  [WaterConsumed] int NOT NULL DEFAULT (0),
  [ExerciseMinutes] int NOT NULL DEFAULT (0),
  [Date] datetime NOT NULL
)
GO

CREATE TABLE [UserType] (
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [Name] nvarchar(20) NOT NULL
)
GO

CREATE TABLE [Ingredient] (
  [Id] nvarchar(100) PRIMARY KEY,
  [Name] nvarchar(100) NOT NULL,
  [CaloriesPerServing] int NOT NULL,
  [Quantity] decimal(18, 2) NOT NULL,
  [Measurement] nvarchar(50) NOT NULL
)
GO

CREATE TABLE [Meal] (
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [UserProfileId] int NOT NULL,
  [MealTypeId] int NOT NULL,
  [Date] datetime NOT NULL DEFAULT(CAST(CAST(GETDATE() AS DATE) AS DATETIME))
)
GO

CREATE TABLE [MealType] (
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [Name] nvarchar(15) NOT NULL
)
GO

CREATE TABLE [MealIngredient] (
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [Amount] int NOT NULL,
  [MealId] int NOT NULL,
  [IngredientId] nvarchar(100) NOT NULL
)
GO

CREATE TABLE [Ticket] (
	[Id] int PRIMARY KEY IDENTITY(1, 1),
	[Title] nvarchar(100) NOT NULL,
	[DateOpened] datetime NOT NULL DEFAULT(GETDATE()),
	[DateClosed] datetime NULL,
	[TicketCategoryId] int NOT NULL,
	[UserProfileId] int NOT NULL
)
GO

CREATE TABLE [TicketCategory] (
	[Id] int PRIMARY KEY IDENTITY(1, 1),
	[Name] nvarchar(30) NOT NULL UNIQUE
)
GO

CREATE TABLE [TicketMessage] (
	[Id] int PRIMARY KEY IDENTITY(1, 1),
	[Message] varchar NOT NULL,
	[DateSent] datetime NOT NULL DEFAULT(GETDATE()),
	[TicketId] int NOT NULL,
	[UserProfileId] int NOT NULL
)

ALTER TABLE [UserProfile] ADD FOREIGN KEY ([UserTypeId]) REFERENCES [UserType] ([Id])
GO

ALTER TABLE [Meal] ADD FOREIGN KEY ([UserProfileId]) REFERENCES [UserProfile] ([Id])
GO

ALTER TABLE [MealIngredient] ADD FOREIGN KEY ([MealId]) REFERENCES [Meal] ([Id])
GO

ALTER TABLE [Meal] ADD FOREIGN KEY ([MealTypeId]) REFERENCES [MealType] ([Id])
GO

ALTER TABLE [DailyUserStats] ADD FOREIGN KEY ([UserProfileId]) REFERENCES [UserProfile] ([Id])
GO

ALTER TABLE [MealIngredient] ADD FOREIGN KEY ([IngredientId]) REFERENCES [Ingredient] ([Id])
GO
