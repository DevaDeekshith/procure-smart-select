

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

const mapSupplierFromDatabase = (dbSupplier: any): Supplier => {
  // Build scores object with explicit typing
  const scores: { [key: string]: number } = {};
  scores['Product Specifications Adherence'] = Number(dbSupplier.product_specifications_adherence) || 0;
  scores['Defect Rate & Quality Control'] = Number(dbSupplier.defect_rate_quality_control) || 0;
  scores['Quality Certifications'] = Number(dbSupplier.quality_certification_score) || 0;
  scores['Unit Pricing Competitiveness'] = Number(dbSupplier.unit_pricing_competitiveness) || 0;
  scores['Payment Terms Flexibility'] = Number(dbSupplier.payment_terms_flexibility) || 0;
  scores['Total Cost of Ownership'] = Number(dbSupplier.total_cost_ownership) || 0;
  scores['On-time Delivery Performance'] = Number(dbSupplier.ontime_delivery_performance) || 0;
  scores['Lead Time Competitiveness'] = Number(dbSupplier.lead_time_competitiveness) || 0;
  scores['Emergency Response Capability'] = Number(dbSupplier.emergency_response_capability) || 0;
  scores['Communication Effectiveness'] = Number(dbSupplier.communication_effectiveness) || 0;
  scores['Contract Compliance History'] = Number(dbSupplier.contract_compliance_history) || 0;
  scores['Business Stability & Longevity'] = Number(dbSupplier.business_stability_longevity) || 0;
  scores['Environmental Certifications'] = Number(dbSupplier.environmental_certifications) || 0;
  scores['Social Responsibility Programs'] = Number(dbSupplier.social_responsibility_programs) || 0;
  scores['Sustainable Sourcing Practices'] = Number(dbSupplier.sustainable_sourcing_practices) || 0;

  // Build supplier object step by step to avoid deep type inference
  const supplier = {} as Supplier;
  supplier.id = String(dbSupplier.id);
  supplier.name = String(dbSupplier.name);
  supplier.description = String(dbSupplier.description || '');
  supplier.contactPerson = String(dbSupplier.contact_person);
  supplier.email = String(dbSupplier.email);
  supplier.phone = String(dbSupplier.phone);
  supplier.address = String(dbSupplier.address || '');
  supplier.industry = String(dbSupplier.industry);
  supplier.establishedYear = Number(dbSupplier.established_year) || 0;
  supplier.certifications = Array.isArray(dbSupplier.certifications) ? dbSupplier.certifications : [];
  supplier.status = dbSupplier.status as 'active' | 'inactive' | 'pending' | 'rejected';
  supplier.website = String(dbSupplier.website || '');
  supplier.overallScore = Number(dbSupplier.overall_score) || 0;
  supplier.createdAt = new Date(dbSupplier.created_at);
  supplier.updatedAt = new Date(dbSupplier.updated_at);
  supplier.scores = scores;

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

