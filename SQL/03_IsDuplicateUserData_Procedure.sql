DROP PROCEDURE IF EXISTS IsDuplicateUserData;
GO

CREATE PROCEDURE IsDuplicateUserData @Field nvarchar(15), @Value nvarchar(50)
AS

DECLARE @result INT;

SET @result = (SELECT COUNT(Id)
FROM dbo.UserProfile
WHERE @Field = @Value);

IF @result > 0
BEGIN
	SET @result = 1;
END
ELSE
BEGIN
	SET @result = 0;
END

RETURN @result;