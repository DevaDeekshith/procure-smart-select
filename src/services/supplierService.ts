import { supabase } from "@/integrations/supabase/client";
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

export const supplierService = {
  async getAllSuppliers() {
    console.log('Fetching suppliers from database...');
    
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching suppliers:', error);
      toast({
        title: "Error fetching suppliers",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }

    console.log('Raw supplier data from database:', data);
    
    const mappedSuppliers = data?.map((item) => ({
      id: item.id || '',
      name: item.name || '',
      description: item.description || '',
      contactPerson: item.contact_person || '',
      email: item.email || '',
      phone: item.phone || '',
      address: item.address || '',
      industry: item.industry || '',
      establishedYear: item.established_year || 0,
      certifications: Array.isArray(item.certifications) ? item.certifications : [],
      status: (item.status || 'pending') as 'active' | 'inactive' | 'pending' | 'rejected',
      website: item.website || '',
      overallScore: Number(item.overall_score) || 0,
      createdAt: new Date(item.created_at || Date.now()),
      updatedAt: new Date(item.updated_at || Date.now()),
      scores: {
        'Product Specifications Adherence': Number(item.product_specifications_adherence) || 0,
        'Defect Rate & Quality Control': Number(item.defect_rate_quality_control) || 0,
        'Quality Certifications': Number(item.quality_certification_score) || 0,
        'Unit Pricing Competitiveness': Number(item.unit_pricing_competitiveness) || 0,
        'Payment Terms Flexibility': Number(item.payment_terms_flexibility) || 0,
        'Total Cost of Ownership': Number(item.total_cost_ownership) || 0,
        'On-time Delivery Performance': Number(item.ontime_delivery_performance) || 0,
        'Lead Time Competitiveness': Number(item.lead_time_competitiveness) || 0,
        'Emergency Response Capability': Number(item.emergency_response_capability) || 0,
        'Communication Effectiveness': Number(item.communication_effectiveness) || 0,
        'Contract Compliance History': Number(item.contract_compliance_history) || 0,
        'Business Stability & Longevity': Number(item.business_stability_longevity) || 0,
        'Environmental Certifications': Number(item.environmental_certifications) || 0,
        'Social Responsibility Programs': Number(item.social_responsibility_programs) || 0,
        'Sustainable Sourcing Practices': Number(item.sustainable_sourcing_practices) || 0
      }
    })) || [];
    
    console.log('Mapped suppliers:', mappedSuppliers);
    console.log('Active suppliers count:', mappedSuppliers.filter(s => s.status === 'active').length);
    
    // Log individual scores for debugging
    mappedSuppliers.forEach(supplier => {
      console.log(`${supplier.name} scores:`, supplier.scores);
    });
    
    return mappedSuppliers;
  },

  async createSupplier(supplierData: SupplierInsert) {
    const normalizedData = {
      ...supplierData,
      status: (supplierData.status?.toLowerCase() || 'pending') as 'active' | 'inactive' | 'pending' | 'rejected'
    };

    const { data, error } = await supabase
      .from('suppliers')
      .insert([normalizedData])
      .select()
      .single();

    if (error) {
      console.error('Error creating supplier:', error);
      toast({
        title: "Error creating supplier",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }

    return {
      id: data.id || '',
      name: data.name || '',
      description: data.description || '',
      contactPerson: data.contact_person || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      industry: data.industry || '',
      establishedYear: data.established_year || 0,
      certifications: Array.isArray(data.certifications) ? data.certifications : [],
      status: (data.status || 'pending') as 'active' | 'inactive' | 'pending' | 'rejected',
      website: data.website || '',
      overallScore: Number(data.overall_score) || 0,
      createdAt: new Date(data.created_at || Date.now()),
      updatedAt: new Date(data.updated_at || Date.now()),
      scores: {
        'Product Specifications Adherence': Number(data.product_specifications_adherence) || 0,
        'Defect Rate & Quality Control': Number(data.defect_rate_quality_control) || 0,
        'Quality Certifications': Number(data.quality_certification_score) || 0,
        'Unit Pricing Competitiveness': Number(data.unit_pricing_competitiveness) || 0,
        'Payment Terms Flexibility': Number(data.payment_terms_flexibility) || 0,
        'Total Cost of Ownership': Number(data.total_cost_ownership) || 0,
        'On-time Delivery Performance': Number(data.ontime_delivery_performance) || 0,
        'Lead Time Competitiveness': Number(data.lead_time_competitiveness) || 0,
        'Emergency Response Capability': Number(data.emergency_response_capability) || 0,
        'Communication Effectiveness': Number(data.communication_effectiveness) || 0,
        'Contract Compliance History': Number(data.contract_compliance_history) || 0,
        'Business Stability & Longevity': Number(data.business_stability_longevity) || 0,
        'Environmental Certifications': Number(data.environmental_certifications) || 0,
        'Social Responsibility Programs': Number(data.social_responsibility_programs) || 0,
        'Sustainable Sourcing Practices': Number(data.sustainable_sourcing_practices) || 0
      }
    };
  },

  async updateSupplier(id: string, supplierData: Partial<SupplierInsert>) {
    const normalizedData = {
      ...supplierData,
      status: supplierData.status ? (supplierData.status.toLowerCase() as 'active' | 'inactive' | 'pending' | 'rejected') : undefined
    };

    const { data, error } = await supabase
      .from('suppliers')
      .update(normalizedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating supplier:', error);
      toast({
        title: "Error updating supplier",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }

    return {
      id: data.id || '',
      name: data.name || '',
      description: data.description || '',
      contactPerson: data.contact_person || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      industry: data.industry || '',
      establishedYear: data.established_year || 0,
      certifications: Array.isArray(data.certifications) ? data.certifications : [],
      status: (data.status || 'pending') as 'active' | 'inactive' | 'pending' | 'rejected',
      website: data.website || '',
      overallScore: Number(data.overall_score) || 0,
      createdAt: new Date(data.created_at || Date.now()),
      updatedAt: new Date(data.updated_at || Date.now()),
      scores: {
        'Product Specifications Adherence': Number(data.product_specifications_adherence) || 0,
        'Defect Rate & Quality Control': Number(data.defect_rate_quality_control) || 0,
        'Quality Certifications': Number(data.quality_certification_score) || 0,
        'Unit Pricing Competitiveness': Number(data.unit_pricing_competitiveness) || 0,
        'Payment Terms Flexibility': Number(data.payment_terms_flexibility) || 0,
        'Total Cost of Ownership': Number(data.total_cost_ownership) || 0,
        'On-time Delivery Performance': Number(data.ontime_delivery_performance) || 0,
        'Lead Time Competitiveness': Number(data.lead_time_competitiveness) || 0,
        'Emergency Response Capability': Number(data.emergency_response_capability) || 0,
        'Communication Effectiveness': Number(data.communication_effectiveness) || 0,
        'Contract Compliance History': Number(data.contract_compliance_history) || 0,
        'Business Stability & Longevity': Number(data.business_stability_longevity) || 0,
        'Environmental Certifications': Number(data.environmental_certifications) || 0,
        'Social Responsibility Programs': Number(data.social_responsibility_programs) || 0,
        'Sustainable Sourcing Practices': Number(data.sustainable_sourcing_practices) || 0
      }
    };
  },

  async deleteSupplier(id: string): Promise<void> {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting supplier:', error);
      toast({
        title: "Error deleting supplier",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  },

  async bulkCreateSuppliers(suppliersData: SupplierInsert[]) {
    const normalizedData = suppliersData.map(supplier => ({
      ...supplier,
      status: (supplier.status?.toLowerCase() || 'pending') as 'active' | 'inactive' | 'pending' | 'rejected'
    }));

    const { data, error } = await supabase
      .from('suppliers')
      .insert(normalizedData)
      .select();

    if (error) {
      console.error('Error bulk creating suppliers:', error);
      toast({
        title: "Error importing suppliers",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }

    return data?.map((item) => ({
      id: item.id || '',
      name: item.name || '',
      description: item.description || '',
      contactPerson: item.contact_person || '',
      email: item.email || '',
      phone: item.phone || '',
      address: item.address || '',
      industry: item.industry || '',
      establishedYear: item.established_year || 0,
      certifications: Array.isArray(item.certifications) ? item.certifications : [],
      status: (item.status || 'pending') as 'active' | 'inactive' | 'pending' | 'rejected',
      website: item.website || '',
      overallScore: Number(item.overall_score) || 0,
      createdAt: new Date(item.created_at || Date.now()),
      updatedAt: new Date(item.updated_at || Date.now()),
      scores: {
        'Product Specifications Adherence': Number(item.product_specifications_adherence) || 0,
        'Defect Rate & Quality Control': Number(item.defect_rate_quality_control) || 0,
        'Quality Certifications': Number(item.quality_certification_score) || 0,
        'Unit Pricing Competitiveness': Number(item.unit_pricing_competitiveness) || 0,
        'Payment Terms Flexibility': Number(item.payment_terms_flexibility) || 0,
        'Total Cost of Ownership': Number(item.total_cost_ownership) || 0,
        'On-time Delivery Performance': Number(item.ontime_delivery_performance) || 0,
        'Lead Time Competitiveness': Number(item.lead_time_competitiveness) || 0,
        'Emergency Response Capability': Number(item.emergency_response_capability) || 0,
        'Communication Effectiveness': Number(item.communication_effectiveness) || 0,
        'Contract Compliance History': Number(item.contract_compliance_history) || 0,
        'Business Stability & Longevity': Number(item.business_stability_longevity) || 0,
        'Environmental Certifications': Number(item.environmental_certifications) || 0,
        'Social Responsibility Programs': Number(item.social_responsibility_programs) || 0,
        'Sustainable Sourcing Practices': Number(item.sustainable_sourcing_practices) || 0
      }
    })) || [];
  }
};