use [NutriHelp]
GO

DROP PROCEDURE IF EXISTS IsDuplicateUserData;
GO

CREATE PROCEDURE IsDuplicateUserData @Field nvarchar(15), @Value nvarchar(50)
AS

IF @Field = 'Email'
BEGIN
	SELECT COUNT(Id)
	FROM dbo.UserProfile
	WHERE Email = @Value
END
ELSE IF @Field = 'Username'
BEGIN
	SELECT COUNT(Id)
	FROM dbo.UserProfile
	WHERE Username = @Value
END