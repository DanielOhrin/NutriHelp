use [NutriHelp]
GO

DROP PROCEDURE IF EXISTS dbo.EditStat
GO

CREATE PROCEDURE dbo.EditStat @FirebaseUserId NVARCHAR(28), @Field NVARCHAR(20), @Value INT
AS

IF @Field IN ('exerciseMinutes', 'waterConsumed')
	BEGIN
		DECLARE @UserId INT
		SET @UserId = (
			SELECT Id
			FROM dbo.UserProfile
			WHERE FirebaseId = @FirebaseUserId
		)

		DECLARE @DailyStatsId INT
		SET @DailyStatsId = (
			SELECT Id
			FROM dbo.DailyUserStats
			WHERE [Date] = (SELECT CAST(CAST(GETDATE() AS DATE) AS DATETIME)) AND UserProfileId = @UserId
		)

		IF @DailyStatsId IS NOT NULL
			BEGIN
				IF @Field = 'exerciseMinutes'
					BEGIN
						UPDATE dbo.DailyUserStats
						SET ExerciseMinutes = @Value 
						WHERE Id = @DailyStatsId
					END
				ELSE
					BEGIN
						UPDATE dbo.DailyUserStats
						SET WaterConsumed = @Value
						WHERE Id = @DailyStatsId
					END
			END
		ELSE
			BEGIN 
				INSERT INTO dbo.DailyUserStats (UserProfileId, WaterConsumed, ExerciseMinutes, [Date])
				VALUES (@UserId, IIF(@Field = 'waterConsumed', @Value, 0), IIF(@Field = 'exerciseMinutes', @Value, 0), CAST(CAST(GETDATE() AS DATE) AS DATETIME))
			END
	END
ELSE IF @Field = 'weight'
	BEGIN
		UPDATE dbo.UserProfile
		SET [Weight] = @Value
	END
