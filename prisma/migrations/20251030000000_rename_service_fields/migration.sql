-- Migration: Rename service table columns to correct semantics
-- This table stores SERVICES (not categories), so renaming from service_category_* to service_*

-- Rename primary key column (if not already renamed)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service' AND column_name = 'service_category_id') THEN
        ALTER TABLE "service" RENAME COLUMN "service_category_id" TO "service_id";
    END IF;
END $$;

-- Rename name column (if not already renamed)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service' AND column_name = 'service_category_name') THEN
        ALTER TABLE "service" RENAME COLUMN "service_category_name" TO "service_name";
    END IF;
END $$;

-- Update constraint name for unique service name (if not already renamed)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'service' AND constraint_name = 'uq_service_category_name') THEN
        ALTER TABLE "service" RENAME CONSTRAINT "uq_service_category_name" TO "uq_service_name";
    END IF;
END $$;

-- Update foreign key columns in service_order table (if not already renamed)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_order' AND column_name = 'service_category_id') THEN
        ALTER TABLE "service_order" RENAME COLUMN "service_category_id" TO "service_id";
    END IF;
END $$;

-- Update foreign key columns in services_realized table (if not already renamed)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services_realized' AND column_name = 'service_category_id') THEN
        ALTER TABLE "services_realized" RENAME COLUMN "service_category_id" TO "service_id";
    END IF;
END $$;
