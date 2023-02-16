use [NutriHelp]
GO

DROP PROCEDURE IF EXISTS dbo.SendMessage
GO

CREATE PROCEDURE dbo.SendMessage @Message VARCHAR, @MessageUserProfileId INT, @TicketId INT, @FirebaseUserId NVARCHAR(28)
AS

DECLARE @UserProfile TABLE (
	[Id] INT PRIMARY KEY,
	[UserTypeId] INT
)

DECLARE @TicketUserProfileId INT = (
	SELECT UserProfileId
	FROM dbo.Ticket
	WHERE Id = @TicketId
)

INSERT INTO @UserProfile 
SELECT Id, UserTypeId
FROM dbo.UserProfile
WHERE FirebaseId = @FirebaseUserId;

IF (@TicketUserProfileId = (SELECT Id FROM @UserProfile) AND @MessageUserProfileId = (SELECT Id FROM @UserProfile)) OR (SELECT UserTypeId FROM @UserProfile) = 1
	BEGIN
		INSERT INTO dbo.TicketMessage ([Message], DateSent, TicketId, UserProfileId)
		VALUES (@Message, GETDATE(), @TicketId, (SELECT Id FROM @UserProfile))

		SELECT 1
		RETURN
	END;

SELECT 0
RETURN