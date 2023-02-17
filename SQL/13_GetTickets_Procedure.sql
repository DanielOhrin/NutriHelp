use [NutriHelp]
GO

DROP PROCEDURE IF EXISTS dbo.GetTickets
GO

CREATE PROCEDURE dbo.GetTickets @FirebaseUserId NVARCHAR(28)
AS

DECLARE @UserTypeId INT = (
	SELECT UserTypeId
	FROM dbo.UserProfile
	WHERE FirebaseId = @FirebaseUserId
)

IF @UserTypeId = 1
	BEGIN
		SELECT t.Id, t.Title, t.DateOpened, t.DateClosed, t.TicketCategoryId, t.UserProfileId,
				tm.Id MessageId, tm.DateSent, tm.[Message], tm.TicketId, tm.UserProfileId MessageUserProfileId,
				tc.[Name]
		FROM dbo.Ticket t
		LEFT JOIN dbo.TicketMessage tm ON tm.TicketId = t.Id
		LEFT JOIN dbo.TicketCategory tc ON tc.Id = t.TicketCategoryId
	END
ELSE
	BEGIN
		DECLARE @UserProfileId INT = (SELECT Id FROM dbo.UserProfile WHERE FirebaseId = @FirebaseUserId);

		SELECT t.Id, t.Title, t.DateOpened, t.DateClosed, t.TicketCategoryId, t.UserProfileId,
				tm.Id MessageId, tm.DateSent, tm.[Message], tm.TicketId, tm.UserProfileId MessageUserProfileId,
				tc.[Name]
		FROM dbo.Ticket t
		LEFT JOIN dbo.TicketMessage tm ON tm.TicketId = t.Id
		LEFT JOIN dbo.TicketCategory tc ON tc.Id = t.TicketCategoryId
		WHERE t.UserProfileId = @UserProfileId
	END