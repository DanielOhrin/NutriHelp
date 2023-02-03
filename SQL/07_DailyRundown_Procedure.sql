use [NutriHelp]
GO

DROP PROCEDURE IF EXISTS dbo.DailyRundown
GO

CREATE PROCEDURE dbo.DailyRundown @FirebaseUserId nvarchar(28)
AS
SELECT 
	dbo.CalorieGoal(up.Gender, up.[Weight], up.Height, up.BirthDate, up.ActivityLevel, up.CalorieDiff) CalorieGoal,
	(dbo.CalorieGoal(up.Gender, up.[Weight], up.Height, up.BirthDate, up.ActivityLevel, up.CalorieDiff) - COALESCE(SUM(i.CaloriesPerServing * mi.Amount), 0)) Calories,
	dbo.WaterGoal(up.[Weight]) WaterGoal,
	(dbo.WaterGoal(up.[Weight]) - COALESCE(dus.WaterConsumed, 0)) WaterRemaining,
	up.FirstName,
	COALESCE(dus.ExerciseMinutes, 0) Exercise
FROM dbo.UserProfile up
	LEFT JOIN dbo.DailyUserStats dus ON dus.UserProfileId = up.Id AND dus.[Date] > (SELECT CAST(CAST(GETDATE() AS DATE) AS DATETIME))
	LEFT JOIN dbo.Meal m ON m.UserProfileId = up.Id AND m.[Date] > (SELECT CAST(CAST(GETDATE() AS DATE) AS DATETIME))
	LEFT JOIN dbo.MealIngredient mi ON mi.MealId = m.Id
	LEFT JOIN dbo.Ingredient i ON i.Id = mi.IngredientId
WHERE up.FirebaseId = @FirebaseUserId
GROUP BY up.Id, up.FirstName, up.Gender, up.[Weight], up.Height, up.BirthDate, up.ActivityLevel, up.CalorieDiff, dus.WaterConsumed, dus.ExerciseMinutes
