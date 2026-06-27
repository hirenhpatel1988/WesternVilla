-- Disable foreign key constraints temporarily to allow clearing tables cleanly
ALTER TABLE [FamilyMembers] NOCHECK CONSTRAINT ALL;
ALTER TABLE [Vehicles] NOCHECK CONSTRAINT ALL;
ALTER TABLE [ResidentInterests] NOCHECK CONSTRAINT ALL;
ALTER TABLE [Residents] NOCHECK CONSTRAINT ALL;

-- Remove all data from all tables
DELETE FROM [FamilyMembers];
DELETE FROM [Vehicles];
DELETE FROM [ResidentInterests];
DELETE FROM [Residents];

-- Reseed identity columns back to 0
DBCC CHECKIDENT ('FamilyMembers', RESEED, 0);
DBCC CHECKIDENT ('Vehicles', RESEED, 0);
DBCC CHECKIDENT ('ResidentInterests', RESEED, 0);
DBCC CHECKIDENT ('Residents', RESEED, 0);

-- Re-enable foreign key constraints
ALTER TABLE [FamilyMembers] CHECK CONSTRAINT ALL;
ALTER TABLE [Vehicles] CHECK CONSTRAINT ALL;
ALTER TABLE [ResidentInterests] CHECK CONSTRAINT ALL;
ALTER TABLE [Residents] CHECK CONSTRAINT ALL;

SELECT 'All table data successfully cleared and identity seeds reset to 0!' AS [Status];
