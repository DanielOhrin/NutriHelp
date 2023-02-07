use [NutriHelp]
GO

DROP PROCEDURE IF EXISTS dbo.GetDailyMeals
GO

CREATE PROCEDURE dbo.GetDailyMeals @FirebaseUserId nvarchar(28)
AS

DECLARE @UserId INT = (
	SELECT Id
	FROM dbo.UserProfile
	WHERE FirebaseId = @FirebaseUserId
)

SELECT m.Id MealId, m.[Date] MealDate, m.[UserProfileId], m.MealTypeId, mt.[Name],
		mi.Id MIId, mi.MealId MIMealId, mi.Amount, mi.IngredientId,
		 i.[Name] IngredientName, i.CaloriesPerServing, i.ServingSize
FROM dbo.Meal m
	LEFT JOIN dbo.MealType mt ON mt.Id = m.MealTypeId
	LEFT JOIN dbo.MealIngredient mi ON mi.MealId = m.Id
	LEFT JOIN dbo.Ingredient i ON i.Id = mi.IngredientId
WHERE m.UserProfileId = @UserId AND m.[Date] = CAST(CAST(GETDATE() AS DATE) AS DATETIME)
ORDER BY mt.Id