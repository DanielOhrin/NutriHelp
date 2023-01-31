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
  [Email] nvarchar(50) UNIQUE NOT NULL,
  [UserName] nvarchar(50) UNIQUE NOT NULL,
  [FirstName] nvarchar(50) NOT NULL,
  [LastName] nvarchar(50) NOT NULL,
  [Gender] nvarchar(1) NOT NULL,
  [BirthDate] datetime NOT NULL,
  [Weight] int NOT NULL,
  [Height] int NOT NULL,
  [ActivityLevel] int NOT NULL,
  [WeightGoal] int NOT NULL,
  [DateCreated] datetime NOT NULL,
  [IsActive] bit NOT NULL DEFAULT (1),
  [UserTypeId] int NOT NULL,
  [CalorieDiff] AS ( /* Determined by their goals (lose or gain 1/2 lbs. per week */
  CASE 
	WHEN [WeightGoal] = 1 THEN 500 /* Gain 1 lbs./week */
	WHEN [WeightGoal] = 2 THEN 1000 /* Gain 2 lbs./week */
	WHEN [WeightGoal] = 3 THEN -500 /* Lose 1 lbs./week */
	WHEN [WeightGoal] = 4 THEN -1000 /* Lose 2 lbs./week */
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
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [Name] nvarchar(100),
  [CaloriesPerServing] int NOT NULL,
  [ServingSize] nvarchar(50) NOT NULL
)
GO

CREATE TABLE [Meal] (
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [UserProfileId] int NOT NULL,
  [MealTypeId] int NOT NULL,
  [Date] datetime NOT NULL
)
GO

CREATE TABLE [MealType] (
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [name] nvarchar(15) NOT NULL
)
GO

CREATE TABLE [MealIngredient] (
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [Amount] int NOT NULL,
  [MealId] int NOT NULL,
  [IngredientId] int NOT NULL
)
GO

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
