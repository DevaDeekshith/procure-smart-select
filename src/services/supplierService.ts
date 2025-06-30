
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
  quality_certifications_score?: number;
  
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

    return data?.map(supplier => ({
      ...supplier,
      contactPerson: supplier.contact_person,
      establishedYear: supplier.established_year || 0,
      createdAt: new Date(supplier.created_at),
      updatedAt: new Date(supplier.updated_at),
      overallScore: supplier.overall_score || 0,
      scores: {
        'Product Specifications Adherence': supplier.product_specifications_adherence || 0,
        'Defect Rate & Quality Control': supplier.defect_rate_quality_control || 0,
        'Quality Certifications': supplier.quality_certifications_score || 0,
        'Unit Pricing Competitiveness': supplier.unit_pricing_competitiveness || 0,
        'Payment Terms Flexibility': supplier.payment_terms_flexibility || 0,
        'Total Cost of Ownership': supplier.total_cost_ownership || 0,
        'On-time Delivery Performance': supplier.ontime_delivery_performance || 0,
        'Lead Time Competitiveness': supplier.lead_time_competitiveness || 0,
        'Emergency Response Capability': supplier.emergency_response_capability || 0,
        'Communication Effectiveness': supplier.communication_effectiveness || 0,
        'Contract Compliance History': supplier.contract_compliance_history || 0,
        'Business Stability & Longevity': supplier.business_stability_longevity || 0,
        'Environmental Certifications': supplier.environmental_certifications || 0,
        'Social Responsibility Programs': supplier.social_responsibility_programs || 0,
        'Sustainable Sourcing Practices': supplier.sustainable_sourcing_practices || 0,
      }
    })) || [];
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

    return {
      ...data,
      contactPerson: data.contact_person,
      establishedYear: data.established_year || 0,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      overallScore: data.overall_score || 0,
      scores: {
        'Product Specifications Adherence': data.product_specifications_adherence || 0,
        'Defect Rate & Quality Control': data.defect_rate_quality_control || 0,
        'Quality Certifications': data.quality_certifications_score || 0,
        'Unit Pricing Competitiveness': data.unit_pricing_competitiveness || 0,
        'Payment Terms Flexibility': data.payment_terms_flexibility || 0,
        'Total Cost of Ownership': data.total_cost_ownership || 0,
        'On-time Delivery Performance': data.ontime_delivery_performance || 0,
        'Lead Time Competitiveness': data.lead_time_competitiveness || 0,
        'Emergency Response Capability': data.emergency_response_capability || 0,
        'Communication Effectiveness': data.communication_effectiveness || 0,
        'Contract Compliance History': data.contract_compliance_history || 0,
        'Business Stability & Longevity': data.business_stability_longevity || 0,
        'Environmental Certifications': data.environmental_certifications || 0,
        'Social Responsibility Programs': data.social_responsibility_programs || 0,
        'Sustainable Sourcing Practices': data.sustainable_sourcing_practices || 0,
      }
    };
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

    return {
      ...data,
      contactPerson: data.contact_person,
      establishedYear: data.established_year || 0,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      overallScore: data.overall_score || 0,
      scores: {
        'Product Specifications Adherence': data.product_specifications_adherence || 0,
        'Defect Rate & Quality Control': data.defect_rate_quality_control || 0,
        'Quality Certifications': data.quality_certifications_score || 0,
        'Unit Pricing Competitiveness': data.unit_pricing_competitiveness || 0,
        'Payment Terms Flexibility': data.payment_terms_flexibility || 0,
        'Total Cost of Ownership': data.total_cost_ownership || 0,
        'On-time Delivery Performance': data.ontime_delivery_performance || 0,
        'Lead Time Competitiveness': data.lead_time_competitiveness || 0,
        'Emergency Response Capability': data.emergency_response_capability || 0,
        'Communication Effectiveness': data.communication_effectiveness || 0,
        'Contract Compliance History': data.contract_compliance_history || 0,
        'Business Stability & Longevity': data.business_stability_longevity || 0,
        'Environmental Certifications': data.environmental_certifications || 0,
        'Social Responsibility Programs': data.social_responsibility_programs || 0,
        'Sustainable Sourcing Practices': data.sustainable_sourcing_practices || 0,
      }
    };
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
