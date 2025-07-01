
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
  // Create scores object with explicit type annotation
  const scores: Record<string, number> = {
    'Product Specifications Adherence': dbSupplier.product_specifications_adherence || 0,
    'Defect Rate & Quality Control': dbSupplier.defect_rate_quality_control || 0,
    'Quality Certifications': dbSupplier.quality_certification_score || 0,
    'Unit Pricing Competitiveness': dbSupplier.unit_pricing_competitiveness || 0,
    'Payment Terms Flexibility': dbSupplier.payment_terms_flexibility || 0,
    'Total Cost of Ownership': dbSupplier.total_cost_ownership || 0,
    'On-time Delivery Performance': dbSupplier.ontime_delivery_performance || 0,
    'Lead Time Competitiveness': dbSupplier.lead_time_competitiveness || 0,
    'Emergency Response Capability': dbSupplier.emergency_response_capability || 0,
    'Communication Effectiveness': dbSupplier.communication_effectiveness || 0,
    'Contract Compliance History': dbSupplier.contract_compliance_history || 0,
    'Business Stability & Longevity': dbSupplier.business_stability_longevity || 0,
    'Environmental Certifications': dbSupplier.environmental_certifications || 0,
    'Social Responsibility Programs': dbSupplier.social_responsibility_programs || 0,
    'Sustainable Sourcing Practices': dbSupplier.sustainable_sourcing_practices || 0
  };

  // Create supplier object step by step
  const supplier: Supplier = {
    id: dbSupplier.id || '',
    name: dbSupplier.name || '',
    description: dbSupplier.description || '',
    contactPerson: dbSupplier.contact_person || '',
    email: dbSupplier.email || '',
    phone: dbSupplier.phone || '',
    address: dbSupplier.address || '',
    industry: dbSupplier.industry || '',
    establishedYear: dbSupplier.established_year || 0,
    certifications: Array.isArray(dbSupplier.certifications) ? dbSupplier.certifications : [],
    status: (dbSupplier.status || 'pending') as 'active' | 'inactive' | 'pending' | 'rejected',
    website: dbSupplier.website || '',
    overallScore: dbSupplier.overall_score || 0,
    createdAt: new Date(dbSupplier.created_at || Date.now()),
    updatedAt: new Date(dbSupplier.updated_at || Date.now()),
    scores: scores
  };

  return supplier;
};

export const supplierService = {
  async getAllSuppliers(): Promise<Supplier[]> {
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
    
    const mappedSuppliers = data?.map(mapSupplierFromDatabase) || [];
    
    console.log('Mapped suppliers:', mappedSuppliers);
    console.log('Active suppliers count:', mappedSuppliers.filter(s => s.status === 'active').length);
    
    return mappedSuppliers;
  },

  async createSupplier(supplierData: SupplierInsert): Promise<Supplier> {
    // Normalize status to ensure it's valid
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

    return mapSupplierFromDatabase(data);
  },

  async updateSupplier(id: string, supplierData: Partial<SupplierInsert>): Promise<Supplier> {
    // Normalize status to ensure it's valid
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

    return mapSupplierFromDatabase(data);
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

  async bulkCreateSuppliers(suppliersData: SupplierInsert[]): Promise<Supplier[]> {
    // Normalize all status values to ensure they're valid
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

    return data?.map(mapSupplierFromDatabase) || [];
  }
};
