use [NutriHelp]

DROP PROCEDURE IF EXISTS dbo.CloseTicket
GO

CREATE PROCEDURE dbo.CloseTicket @TicketId INT, @FirebaseUserId NVARCHAR(28)
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

IF @TicketUserProfileId = (SELECT Id FROM @UserProfile) OR (SELECT UserTypeId FROM @UserProfile) = 1
	BEGIN
		UPDATE dbo.Ticket
		SET DateClosed = GETDATE()
		WHERE Id = @TicketId

		SELECT 1
		RETURN
	END;

SELECT 0
RETURN