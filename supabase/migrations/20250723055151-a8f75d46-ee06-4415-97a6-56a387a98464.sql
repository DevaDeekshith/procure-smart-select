-- Add missing id column as primary key to suppliers table
ALTER TABLE public.suppliers ADD COLUMN id UUID NOT NULL DEFAULT gen_random_uuid();

-- Set the id column as primary key
ALTER TABLE public.suppliers ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);