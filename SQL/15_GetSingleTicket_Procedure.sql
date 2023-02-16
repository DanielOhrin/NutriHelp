use [NutriHelp]
GO

DROP PROCEDURE IF EXISTS dbo.GetTicket
GO

CREATE PROCEDURE dbo.GetTicket @TicketId INT, @FirebaseUserId NVARCHAR(28)
AS

DECLARE @UserTypeId INT = (
	SELECT UserTypeId
	FROM dbo.UserProfile
	WHERE FirebaseId = @FirebaseUserId
)

DECLARE @TicketUserProfileId INT = (
	SELECT UserProfileId
	FROM dbo.Ticket
	WHERE Id = @TicketId
)

IF @UserTypeId = 1 OR @TicketUserProfileId = (SELECT Id FROM dbo.UserProfile WHERE FirebaseId = @FirebaseUserId)
	BEGIN
		SELECT t.Id, t.Title, t.DateOpened, t.DateClosed, t.TicketCategoryId, t.UserProfileId,
				tm.Id MessageId, tm.DateSent, tm.[Message], tm.TicketId, tm.UserProfileId MessageUserProfileId,
				tc.[Name],
				up.Username,
				1 IsAuthorized
		FROM dbo.Ticket t
		LEFT JOIN dbo.TicketMessage tm ON tm.TicketId = t.Id
		LEFT JOIN dbo.TicketCategory tc ON tc.Id = t.TicketCategoryId
		LEFT JOIN dbo.UserProfile up ON up.Id = tm.UserProfileId
		WHERE t.Id = @TicketId

		RETURN
	END

SELECT 0 IsAuthorized
RETURN