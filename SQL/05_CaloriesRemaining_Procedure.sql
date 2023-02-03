use [NutriHelp]
GO

DROP PROCEDURE IF EXISTS dbo.CaloriesRemaining
GO

CREATE PROCEDURE dbo.CaloriesRemaining @FirebaseUserId nvarchar(28)
AS

SELECT (dbo.CalorieGoal(up.Gender, up.[Weight], up.Height, up.BirthDate, up.ActivityLevel, up.CalorieDiff) - COALESCE(SUM(i.CaloriesPerServing * mi.Amount), 0)) Calories
FROM dbo.UserProfile up
	LEFT JOIN dbo.Meal m ON m.UserProfileId = up.Id AND m.[Date] > (SELECT CAST(CAST(GETDATE() AS DATE) AS DATETIME))
	LEFT JOIN dbo.MealIngredient mi ON mi.MealId = m.Id
	LEFT JOIN dbo.Ingredient i ON i.Id = mi.IngredientId
WHERE up.FirebaseId = @FirebaseUserId 
GROUP BY up.Id, up.Gender, up.[Weight], up.Height, up.BirthDate, up.ActivityLevel, up.CalorieDiff
