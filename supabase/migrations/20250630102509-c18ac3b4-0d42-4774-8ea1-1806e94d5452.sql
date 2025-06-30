
-- Set replica identity for the suppliers table to enable updates
ALTER TABLE public.suppliers REPLICA IDENTITY FULL;

-- Fix the status constraint to allow proper values
ALTER TABLE public.suppliers 
DROP CONSTRAINT IF EXISTS suppliers_status_check;

-- Add the correct status constraint
ALTER TABLE public.suppliers 
ADD CONSTRAINT suppliers_status_check 
CHECK (status IN ('active', 'inactive', 'pending', 'rejected'));

-- Ensure any existing data with invalid status gets normalized
UPDATE public.suppliers 
SET status = LOWER(status) 
WHERE status IS NOT NULL;

-- Set default status for any null values
UPDATE public.suppliers 
SET status = 'pending' 
WHERE status IS NULL;
