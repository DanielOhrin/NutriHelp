use [NutriHelp]
GO

DROP PROCEDURE IF EXISTS dbo.CreateTicket
GO

CREATE PROCEDURE dbo.CreateTicket @Title NVARCHAR(100), @CategoryId INT, @UserProfileId INT, @Message VARCHAR, @MessageUserProfileId INT
AS

IF @UserProfileId <> @MessageUserProfileId
	BEGIN;
		THROW 1, 'User Ids must be matching', 1;
	END;

INSERT INTO dbo.Ticket (Title, TicketCategoryId, UserProfileId)
VALUES (@Title, @CategoryId, @UserProfileId)


INSERT INTO dbo.TicketMessage (TicketId, [Message], UserProfileId) VALUES (SCOPE_IDENTITY(), @Message, @MessageUserProfileId)