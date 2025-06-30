import { supabase } from "@/integrations/supabase/client";
import { Supplier } from "@/types/supplier";
import { toast } from "@/hooks/use-toast";

export interface SupplierInsert {
  name: string;
  description?: string;
  contact_person: string;
  email: string;
  phone: string;
  address?: string;
  industry: string;
  established_year?: number;
  certifications?: string[];
  status?: 'active' | 'inactive' | 'pending' | 'rejected';
  website?: string;
  
  // Product Quality scores
  product_specifications_adherence?: number;
  defect_rate_quality_control?: number;
  quality_certification_score?: number;
  
  // Cost Competitiveness scores
  unit_pricing_competitiveness?: number;
  payment_terms_flexibility?: number;
  total_cost_ownership?: number;
  
  // Lead Time Performance scores
  ontime_delivery_performance?: number;
  lead_time_competitiveness?: number;
  emergency_response_capability?: number;
  
  // Reliability & Trust scores
  communication_effectiveness?: number;
  contract_compliance_history?: number;
  business_stability_longevity?: number;
  
  // Sustainability scores
  environmental_certifications?: number;
  social_responsibility_programs?: number;
  sustainable_sourcing_practices?: number;
}

// Helper function to create scores object
const createScoresObject = (dbSupplier: any): Record<string, number> => {
  return {
    'Product Specifications Adherence': Number(dbSupplier.product_specifications_adherence) || 0,
    'Defect Rate & Quality Control': Number(dbSupplier.defect_rate_quality_control) || 0,
    'Quality Certifications': Number(dbSupplier.quality_certification_score) || 0,
    'Unit Pricing Competitiveness': Number(dbSupplier.unit_pricing_competitiveness) || 0,
    'Payment Terms Flexibility': Number(dbSupplier.payment_terms_flexibility) || 0,
    'Total Cost of Ownership': Number(dbSupplier.total_cost_ownership) || 0,
    'On-time Delivery Performance': Number(dbSupplier.ontime_delivery_performance) || 0,
    'Lead Time Competitiveness': Number(dbSupplier.lead_time_competitiveness) || 0,
    'Emergency Response Capability': Number(dbSupplier.emergency_response_capability) || 0,
    'Communication Effectiveness': Number(dbSupplier.communication_effectiveness) || 0,
    'Contract Compliance History': Number(dbSupplier.contract_compliance_history) || 0,
    'Business Stability & Longevity': Number(dbSupplier.business_stability_longevity) || 0,
    'Environmental Certifications': Number(dbSupplier.environmental_certifications) || 0,
    'Social Responsibility Programs': Number(dbSupplier.social_responsibility_programs) || 0,
    'Sustainable Sourcing Practices': Number(dbSupplier.sustainable_sourcing_practices) || 0
  };
};

const mapSupplierFromDatabase = (dbSupplier: any): Supplier => {
  const scores = createScoresObject(dbSupplier);
  
  const supplier: Supplier = {
    id: String(dbSupplier.id),
    name: String(dbSupplier.name),
    description: String(dbSupplier.description || ''),
    contactPerson: String(dbSupplier.contact_person),
    email: String(dbSupplier.email),
    phone: String(dbSupplier.phone),
    address: String(dbSupplier.address || ''),
    industry: String(dbSupplier.industry),
    establishedYear: Number(dbSupplier.established_year) || 0,
    certifications: Array.isArray(dbSupplier.certifications) ? dbSupplier.certifications : [],
    status: dbSupplier.status as 'active' | 'inactive' | 'pending' | 'rejected',
    website: String(dbSupplier.website || ''),
    overallScore: Number(dbSupplier.overall_score) || 0,
    createdAt: new Date(dbSupplier.created_at),
    updatedAt: new Date(dbSupplier.updated_at),
    scores
  };

  return supplier;
};

export const supplierService = {
  async getAllSuppliers(): Promise<Supplier[]> {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching suppliers",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }

    return data?.map(mapSupplierFromDatabase) || [];
  },

  async createSupplier(supplierData: SupplierInsert): Promise<Supplier> {
    const { data, error } = await supabase
      .from('suppliers')
      .insert([supplierData])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating supplier",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }

    return mapSupplierFromDatabase(data);
  },

  async updateSupplier(id: string, supplierData: Partial<SupplierInsert>): Promise<Supplier> {
    const { data, error } = await supabase
      .from('suppliers')
      .update(supplierData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error updating supplier",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }

    return mapSupplierFromDatabase(data);
  },

  async deleteSupplier(id: string): Promise<void> {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error deleting supplier",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  }
};
