use [NutriHelp]
GO

DROP PROCEDURE IF EXISTS dbo.AddFood
GO

CREATE PROCEDURE dbo.AddFood @FirebaseUserId NVARCHAR(28), @MealTypeId INT, @Amount INT, @IngredientId NVARCHAR(100), @Name NVARCHAR(100), @CaloriesPerServing INT, @Quantity DECIMAL(18, 2), @Measurement NVARCHAR(50)
AS

IF (SELECT COUNT(Id) FROM dbo.Ingredient WHERE Id = @IngredientId) = 0
	BEGIN
		INSERT INTO dbo.Ingredient (Id, [Name], CaloriesPerServing, Quantity, Measurement)
		VALUES (@IngredientId, @Name, @CaloriesPerServing, @Quantity, @Measurement)
	END
ELSE
	BEGIN
		DECLARE @ExistingMealIngredient INT = (
			SELECT mi.Id
			FROM dbo.MealIngredient mi
			LEFT JOIN dbo.Meal m ON m.Id = mi.MealId AND m.MealTypeId = @MealTypeId
			WHERE mi.IngredientId = @IngredientId AND m.[Date] = CAST(CAST(GETDATE() AS DATE) AS DATETIME)
		)

		IF @ExistingMealIngredient IS NOT NULL
			BEGIN
				UPDATE dbo.MealIngredient
				SET Amount += @Amount
				WHERE Id = @ExistingMealIngredient

				RETURN
			END
	END

DECLARE @MealId INT = (
	SELECT Id
	FROM dbo.Meal
	WHERE [Date] = CAST(CAST(GETDATE() AS DATE) AS DATETIME) AND MealTypeId = @MealTypeId
)

IF @MealId IS NULL
	BEGIN
		DECLARE @UserProfileId INT = (SELECT Id FROM UserProfile WHERE FirebaseId = @FirebaseUserId)
		INSERT INTO dbo.Meal (UserProfileId, MealTypeId)	
		VALUES (@UserProfileId, @MealTypeId)

		SET @MealId = SCOPE_IDENTITY()

	END

INSERT INTO dbo.MealIngredient (Amount, MealId, IngredientId)
VALUES (@Amount, @MealId, @IngredientId)