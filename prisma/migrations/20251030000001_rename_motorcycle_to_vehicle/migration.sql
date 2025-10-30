-- Migration: Rename motorcycle_id to vehicle_id
-- This makes the system more generic to handle any type of vehicle (cars, motorcycles, scooters, etc)

-- Rename foreign key column in service_order table (if not already renamed)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_order' AND column_name = 'motorcycle_id') THEN
        ALTER TABLE "service_order" RENAME COLUMN "motorcycle_id" TO "vehicle_id";
    END IF;
END $$;
