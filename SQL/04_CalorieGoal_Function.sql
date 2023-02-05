use [NutriHelp]
GO

DROP FUNCTION IF EXISTS dbo.CalorieGoal
GO

CREATE FUNCTION dbo.CalorieGoal(@Gender CHAR, @Weight INT, @Height INT, @BirthDate DATETIME, @ActivityLevel DECIMAL, @CalorieDiff INT)
RETURNS INT
AS

BEGIN
	DECLARE @Result INT

	DECLARE @MaleBase DECIMAL(18, 4) = 66.5
	DECLARE @MaleBase2 DECIMAL(18, 4) = 13.8
	DECLARE @MaleBase3 DECIMAL(18, 4) = 5
	DECLARE @MaleBase4 DECIMAL(18, 4) = 6.75

	DECLARE @FemaleBase DECIMAL(18, 4) = 655.1
	DECLARE @FemaleBase2 DECIMAL(18, 4) = 9.6
	DECLARE @FemaleBase3 DECIMAL(18, 4) = 1.85
	DECLARE @FemaleBase4 DECIMAL(18, 4) = 4.7
	
	IF @Gender = 'M'
		BEGIN
			SET @Result = ((@MaleBase + (@MaleBase2 * CAST(@Weight AS DECIMAL(18, 4))) + (@MaleBase3 * CAST(@Height AS DECIMAL) - (@MaleBase4 * CAST(DATEDIFF(year, @BirthDate, GETDATE()) AS DECIMAL)))) * (1 + (CAST(IIF(@ActivityLevel > 1, @ActivityLevel, 0) AS DECIMAL) / 10))) + @CalorieDiff
		END
	ELSE
		BEGIN
			SET @Result = ((@FemaleBase + (@FemaleBase2 * CAST(@Weight AS DECIMAL(18, 4))) + (@FemaleBase3 * CAST(@Height AS DECIMAL) - (@FemaleBase4 * CAST(DATEDIFF(year, @BirthDate, GETDATE()) AS DECIMAL)))) * (1 + (CAST(IIF(@ActivityLevel > 1, @ActivityLevel, 0) AS DECIMAL) / 10))) + @CalorieDiff
		END
	RETURN @Result
END