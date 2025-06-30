
-- First, add the missing created_at column to the suppliers table
ALTER TABLE public.suppliers 
ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update the suppliers table to handle CSV imports without errors
-- Make all score columns have default values of 0 to prevent null issues
-- Ensure column names match exactly with CSV headers

-- Add default values for score columns
ALTER TABLE public.suppliers 
ALTER COLUMN product_specifications_adherence SET DEFAULT 0,
ALTER COLUMN defect_rate_quality_control SET DEFAULT 0,
ALTER COLUMN quality_certifications_score SET DEFAULT 0,
ALTER COLUMN unit_pricing_competitiveness SET DEFAULT 0,
ALTER COLUMN payment_terms_flexibility SET DEFAULT 0,
ALTER COLUMN total_cost_ownership SET DEFAULT 0,
ALTER COLUMN ontime_delivery_performance SET DEFAULT 0,
ALTER COLUMN lead_time_competitiveness SET DEFAULT 0,
ALTER COLUMN emergency_response_capability SET DEFAULT 0,
ALTER COLUMN communication_effectiveness SET DEFAULT 0,
ALTER COLUMN contract_compliance_history SET DEFAULT 0,
ALTER COLUMN business_stability_longevity SET DEFAULT 0,
ALTER COLUMN environmental_certifications SET DEFAULT 0,
ALTER COLUMN social_responsibility_programs SET DEFAULT 0,
ALTER COLUMN sustainable_sourcing_practices SET DEFAULT 0;

-- Rename the column to match CSV header exactly
-- The CSV has 'quality_certification_score' but our table has 'quality_certifications_score'
ALTER TABLE public.suppliers 
RENAME COLUMN quality_certifications_score TO quality_certification_score;

-- Update the overall_score column to have a default value
ALTER TABLE public.suppliers 
ALTER COLUMN overall_score SET DEFAULT 0;

-- Make sure the status column has proper default
ALTER TABLE public.suppliers 
ALTER COLUMN status SET DEFAULT 'pending';

-- Update the trigger function to handle the renamed column
CREATE OR REPLACE FUNCTION calculate_overall_score(supplier_row suppliers)
RETURNS DECIMAL(4,1) AS $$
DECLARE
  product_quality_avg DECIMAL(4,1);
  cost_avg DECIMAL(4,1);
  lead_time_avg DECIMAL(4,1);
  reliability_avg DECIMAL(4,1);
  sustainability_avg DECIMAL(4,1);
  total_score DECIMAL(4,1);
BEGIN
  -- Calculate category averages (only if scores exist)
  product_quality_avg = COALESCE((
    COALESCE(supplier_row.product_specifications_adherence, 0) + 
    COALESCE(supplier_row.defect_rate_quality_control, 0) + 
    COALESCE(supplier_row.quality_certification_score, 0)
  ) / NULLIF((
    CASE WHEN supplier_row.product_specifications_adherence IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN supplier_row.defect_rate_quality_control IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN supplier_row.quality_certification_score IS NOT NULL THEN 1 ELSE 0 END
  ), 0), 0);
  
  cost_avg = COALESCE((
    COALESCE(supplier_row.unit_pricing_competitiveness, 0) + 
    COALESCE(supplier_row.payment_terms_flexibility, 0) + 
    COALESCE(supplier_row.total_cost_ownership, 0)
  ) / NULLIF((
    CASE WHEN supplier_row.unit_pricing_competitiveness IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN supplier_row.payment_terms_flexibility IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN supplier_row.total_cost_ownership IS NOT NULL THEN 1 ELSE 0 END
  ), 0), 0);
  
  lead_time_avg = COALESCE((
    COALESCE(supplier_row.ontime_delivery_performance, 0) + 
    COALESCE(supplier_row.lead_time_competitiveness, 0) + 
    COALESCE(supplier_row.emergency_response_capability, 0)
  ) / NULLIF((
    CASE WHEN supplier_row.ontime_delivery_performance IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN supplier_row.lead_time_competitiveness IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN supplier_row.emergency_response_capability IS NOT NULL THEN 1 ELSE 0 END
  ), 0), 0);
  
  reliability_avg = COALESCE((
    COALESCE(supplier_row.communication_effectiveness, 0) + 
    COALESCE(supplier_row.contract_compliance_history, 0) + 
    COALESCE(supplier_row.business_stability_longevity, 0)
  ) / NULLIF((
    CASE WHEN supplier_row.communication_effectiveness IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN supplier_row.contract_compliance_history IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN supplier_row.business_stability_longevity IS NOT NULL THEN 1 ELSE 0 END
  ), 0), 0);
  
  sustainability_avg = COALESCE((
    COALESCE(supplier_row.environmental_certifications, 0) + 
    COALESCE(supplier_row.social_responsibility_programs, 0) + 
    COALESCE(supplier_row.sustainable_sourcing_practices, 0)
  ) / NULLIF((
    CASE WHEN supplier_row.environmental_certifications IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN supplier_row.social_responsibility_programs IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN supplier_row.sustainable_sourcing_practices IS NOT NULL THEN 1 ELSE 0 END
  ), 0), 0);
  
  -- Calculate weighted total score (based on DEFAULT_CRITERIA weights)
  total_score = (product_quality_avg * 0.25 + cost_avg * 0.20 + lead_time_avg * 0.20 + reliability_avg * 0.20 + sustainability_avg * 0.15) * 10;
  
  RETURN total_score;
END;
$$ LANGUAGE plpgsql;
