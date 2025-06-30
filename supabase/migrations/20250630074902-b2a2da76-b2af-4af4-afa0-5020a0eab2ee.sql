
-- Create suppliers table with all evaluation criteria
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  industry TEXT NOT NULL,
  established_year INTEGER,
  certifications TEXT[],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending', 'rejected')),
  website TEXT,
  
  -- Product Quality scores (out of 10)
  product_specifications_adherence DECIMAL(3,1) CHECK (product_specifications_adherence >= 0 AND product_specifications_adherence <= 10),
  defect_rate_quality_control DECIMAL(3,1) CHECK (defect_rate_quality_control >= 0 AND defect_rate_quality_control <= 10),
  quality_certifications_score DECIMAL(3,1) CHECK (quality_certifications_score >= 0 AND quality_certifications_score <= 10),
  
  -- Cost Competitiveness scores (out of 10)
  unit_pricing_competitiveness DECIMAL(3,1) CHECK (unit_pricing_competitiveness >= 0 AND unit_pricing_competitiveness <= 10),
  payment_terms_flexibility DECIMAL(3,1) CHECK (payment_terms_flexibility >= 0 AND payment_terms_flexibility <= 10),
  total_cost_ownership DECIMAL(3,1) CHECK (total_cost_ownership >= 0 AND total_cost_ownership <= 10),
  
  -- Lead Time Performance scores (out of 10)
  ontime_delivery_performance DECIMAL(3,1) CHECK (ontime_delivery_performance >= 0 AND ontime_delivery_performance <= 10),
  lead_time_competitiveness DECIMAL(3,1) CHECK (lead_time_competitiveness >= 0 AND lead_time_competitiveness <= 10),
  emergency_response_capability DECIMAL(3,1) CHECK (emergency_response_capability >= 0 AND emergency_response_capability <= 10),
  
  -- Reliability & Trust scores (out of 10)
  communication_effectiveness DECIMAL(3,1) CHECK (communication_effectiveness >= 0 AND communication_effectiveness <= 10),
  contract_compliance_history DECIMAL(3,1) CHECK (contract_compliance_history >= 0 AND contract_compliance_history <= 10),
  business_stability_longevity DECIMAL(3,1) CHECK (business_stability_longevity >= 0 AND business_stability_longevity <= 10),
  
  -- Sustainability scores (out of 10)
  environmental_certifications DECIMAL(3,1) CHECK (environmental_certifications >= 0 AND environmental_certifications <= 10),
  social_responsibility_programs DECIMAL(3,1) CHECK (social_responsibility_programs >= 0 AND social_responsibility_programs <= 10),
  sustainable_sourcing_practices DECIMAL(3,1) CHECK (sustainable_sourcing_practices >= 0 AND sustainable_sourcing_practices <= 10),
  
  -- Calculated overall score
  overall_score DECIMAL(4,1),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create function to calculate overall score
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
    COALESCE(supplier_row.quality_certifications_score, 0)
  ) / NULLIF((
    CASE WHEN supplier_row.product_specifications_adherence IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN supplier_row.defect_rate_quality_control IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN supplier_row.quality_certifications_score IS NOT NULL THEN 1 ELSE 0 END
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

-- Create trigger to automatically calculate overall score
CREATE OR REPLACE FUNCTION update_overall_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.overall_score = calculate_overall_score(NEW);
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER suppliers_calculate_score_trigger
  BEFORE INSERT OR UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION update_overall_score();

-- Enable Row Level Security (for future authentication)
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (can be restricted later with authentication)
CREATE POLICY "Allow public access to suppliers" ON public.suppliers
  FOR ALL USING (true) WITH CHECK (true);
