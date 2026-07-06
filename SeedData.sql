-- Disable foreign key constraints temporarily to clear data cleanly
ALTER TABLE [FamilyMembers] NOCHECK CONSTRAINT ALL;
ALTER TABLE [Vehicles] NOCHECK CONSTRAINT ALL;
ALTER TABLE [ResidentInterests] NOCHECK CONSTRAINT ALL;
ALTER TABLE [Residents] NOCHECK CONSTRAINT ALL;

-- Clear all data
DELETE FROM [FamilyMembers];
DELETE FROM [Vehicles];
DELETE FROM [ResidentInterests];
DELETE FROM [Residents];

-- Reseed identities to 0
DBCC CHECKIDENT ('FamilyMembers', RESEED, 0);
DBCC CHECKIDENT ('Vehicles', RESEED, 0);
DBCC CHECKIDENT ('ResidentInterests', RESEED, 0);
DBCC CHECKIDENT ('Residents', RESEED, 0);

-- Enable foreign key constraints back
ALTER TABLE [FamilyMembers] CHECK CONSTRAINT ALL;
ALTER TABLE [Vehicles] CHECK CONSTRAINT ALL;
ALTER TABLE [ResidentInterests] CHECK CONSTRAINT ALL;
ALTER TABLE [Residents] CHECK CONSTRAINT ALL;

-- Declare variables for tracking Resident IDs
DECLARE @ResId1 INT;
DECLARE @ResId2 INT;
DECLARE @ResId3 INT;

-- 1. Insert Residents (Owners/Tenants)
INSERT INTO [Residents] (OwnerFirstName, OwnerMiddleName, OwnerSurName, IsTenant, TenantFirstName, TenantMiddleName, TenantSurName, HouseNumber, MobileNumber, Email, IsMaintenancePaid, IsReceiptReceived, ReceiptNumber, Gender, OwnerOccupationType, OwnerOccupationDetails, TenantOccupationType, TenantOccupationDetails)
VALUES ('Ramesh', 'Kanti', 'Patel', 'No', NULL, NULL, NULL, '101', '9876543210', 'ramesh.patel@gmail.com', 'Yes', 'Yes', 'REC-101', 'Male', 'Business', 'Patel Electronics', NULL, NULL);
SET @ResId1 = SCOPE_IDENTITY();

INSERT INTO [Residents] (OwnerFirstName, OwnerMiddleName, OwnerSurName, IsTenant, TenantFirstName, TenantMiddleName, TenantSurName, HouseNumber, MobileNumber, Email, IsMaintenancePaid, IsReceiptReceived, ReceiptNumber, Gender, OwnerOccupationType, OwnerOccupationDetails, TenantOccupationType, TenantOccupationDetails)
VALUES ('Suresh', 'Bhai', 'Shah', 'Yes', 'Jignesh', 'Harish', 'Mehta', '102', '9822334455', 'jignesh.mehta@yahoo.com', 'Yes', 'No', NULL, 'Male', 'None', NULL, 'Job', 'Software Engineer');
SET @ResId2 = SCOPE_IDENTITY();

INSERT INTO [Residents] (OwnerFirstName, OwnerMiddleName, OwnerSurName, IsTenant, TenantFirstName, TenantMiddleName, TenantSurName, HouseNumber, MobileNumber, Email, IsMaintenancePaid, IsReceiptReceived, ReceiptNumber, Gender, OwnerOccupationType, OwnerOccupationDetails, TenantOccupationType, TenantOccupationDetails)
VALUES ('Amit', 'R.', 'Sharma', 'No', NULL, NULL, NULL, '103', '9988776655', 'amit.sharma@outlook.com', 'No', 'No', NULL, 'Male', 'Job', 'Bank Manager', NULL, NULL);
SET @ResId3 = SCOPE_IDENTITY();

-- 2. Insert Resident Interests (Choice of Interest of Society Tasks)
-- For House 101 (Ramesh Patel)
INSERT INTO [ResidentInterests] (InterestName, ResidentId) VALUES ('Social Events / સામાજિક કાર્યક્રમો', @ResId1);
INSERT INTO [ResidentInterests] (InterestName, ResidentId) VALUES ('Sport Activities / રમતગમત પ્રવૃત્તિઓ', @ResId1);
INSERT INTO [ResidentInterests] (InterestName, ResidentId) VALUES ('Cleanliness Drive / સ્વચ્છતા અભિયાન', @ResId1);

-- For House 102 (Jignesh Mehta - Tenant)
INSERT INTO [ResidentInterests] (InterestName, ResidentId) VALUES ('Cultural Programs / સાંસ્કૃતિક કાર્યક્રમો', @ResId2);
INSERT INTO [ResidentInterests] (InterestName, ResidentId) VALUES ('Security & Safety / સુરક્ષા અને સલામતી', @ResId2);

-- For House 103 (Amit Sharma)
INSERT INTO [ResidentInterests] (InterestName, ResidentId) VALUES ('Gardening & Greenery / બાગકામ અને હરિયાળી', @ResId3);

-- 3. Insert Family Members
INSERT INTO [FamilyMembers] (FirstName, MiddleName, SurName, Age, MobileNumber, OccupationType, OccupationDetails, BloodGroup, ResidentId)
VALUES ('Kokila', 'Ramesh', 'Patel', 45, '9876543211', 'None', NULL, 'O+', @ResId1);
INSERT INTO [FamilyMembers] (FirstName, MiddleName, SurName, Age, MobileNumber, OccupationType, OccupationDetails, BloodGroup, ResidentId)
VALUES ('Hardik', 'Ramesh', 'Patel', 21, NULL, 'Study', 'LD College of Engineering', 'B+', @ResId1);

INSERT INTO [FamilyMembers] (FirstName, MiddleName, SurName, Age, MobileNumber, OccupationType, OccupationDetails, BloodGroup, ResidentId)
VALUES ('Priti', 'Jignesh', 'Mehta', 38, '9822334456', 'Business', 'Mehta Boutique', 'A+', @ResId2);

-- 4. Insert Vehicles
INSERT INTO [Vehicles] (VehicleType, FuelType, VehicleNumber, ResidentId)
VALUES ('Four', 'Petrol', 'GJ-01-AA-9999', @ResId1);
INSERT INTO [Vehicles] (VehicleType, FuelType, VehicleNumber, ResidentId)
VALUES ('Two', 'Electric', 'GJ-01-EE-1111', @ResId1);

INSERT INTO [Vehicles] (VehicleType, FuelType, VehicleNumber, ResidentId)
VALUES ('Two', 'Petrol', 'GJ-01-XX-5555', @ResId2);

-- Output confirmation message
SELECT 'Database successfully cleared, reseeded, and populated with sample data!' AS [Status];
