-- 1. Temporarily bypass the foreign key check constraint for ResidentId
ALTER TABLE [ResidentInterests] NOCHECK CONSTRAINT FK_ResidentInterests_Residents_ResidentId;

-- 2. Clear only the ResidentInterests table
DELETE FROM [ResidentInterests];

-- 3. Reseed the identity of ResidentInterests back to 0
DBCC CHECKIDENT ('ResidentInterests', RESEED, 0);

-- 4. Insert the master choice of interests (linked to a default placeholder ResidentId = 1)
INSERT INTO [ResidentInterests] (InterestName, ResidentId) VALUES ('Social Events / સામાજિક કાર્યક્રમો', 1);
INSERT INTO [ResidentInterests] (InterestName, ResidentId) VALUES ('Sport Activities / રમતગમતની પ્રવૃત્તિઓ', 1);
INSERT INTO [ResidentInterests] (InterestName, ResidentId) VALUES ('Security & Safety / સુરક્ષા અને સલામતી', 1);
INSERT INTO [ResidentInterests] (InterestName, ResidentId) VALUES ('Cleanliness Drive / સ્વચ્છતા અભિયાન', 1);
INSERT INTO [ResidentInterests] (InterestName, ResidentId) VALUES ('Cultural Programs / સાંસ્કૃતિક કાર્યક્રમો', 1);
INSERT INTO [ResidentInterests] (InterestName, ResidentId) VALUES ('Gardening & Greenery / બાગકામ અને હરિયાળી', 1);

-- 5. Re-enable the foreign key constraint
ALTER TABLE [ResidentInterests] CHECK CONSTRAINT FK_ResidentInterests_Residents_ResidentId;

-- Output confirmation message
SELECT 'ResidentInterests table cleared, reseeded, and loaded with master choice of interests!' AS [Status];
