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
  // Create the supplier object step by step with explicit typing
  const id: string = String(dbSupplier.id || '');
  const name: string = String(dbSupplier.name || '');
  const description: string = String(dbSupplier.description || '');
  const contactPerson: string = String(dbSupplier.contact_person || '');
  const email: string = String(dbSupplier.email || '');
  const phone: string = String(dbSupplier.phone || '');
  const address: string = String(dbSupplier.address || '');
  const industry: string = String(dbSupplier.industry || '');
  const establishedYear: number = Number(dbSupplier.established_year || 0);
  const certifications: string[] = Array.isArray(dbSupplier.certifications) ? dbSupplier.certifications : [];
  const status = (dbSupplier.status || 'pending') as 'active' | 'inactive' | 'pending' | 'rejected';
  const website: string = String(dbSupplier.website || '');
  const overallScore: number = Number(dbSupplier.overall_score || 0);
  const createdAt: Date = new Date(dbSupplier.created_at || Date.now());
  const updatedAt: Date = new Date(dbSupplier.updated_at || Date.now());
  
  // Create scores object with explicit typing
  const scores: Record<string, number> = {
    'Product Specifications Adherence': Number(dbSupplier.product_specifications_adherence || 0),
    'Defect Rate & Quality Control': Number(dbSupplier.defect_rate_quality_control || 0),
    'Quality Certifications': Number(dbSupplier.quality_certification_score || 0),
    'Unit Pricing Competitiveness': Number(dbSupplier.unit_pricing_competitiveness || 0),
    'Payment Terms Flexibility': Number(dbSupplier.payment_terms_flexibility || 0),
    'Total Cost of Ownership': Number(dbSupplier.total_cost_ownership || 0),
    'On-time Delivery Performance': Number(dbSupplier.ontime_delivery_performance || 0),
    'Lead Time Competitiveness': Number(dbSupplier.lead_time_competitiveness || 0),
    'Emergency Response Capability': Number(dbSupplier.emergency_response_capability || 0),
    'Communication Effectiveness': Number(dbSupplier.communication_effectiveness || 0),
    'Contract Compliance History': Number(dbSupplier.contract_compliance_history || 0),
    'Business Stability & Longevity': Number(dbSupplier.business_stability_longevity || 0),
    'Environmental Certifications': Number(dbSupplier.environmental_certifications || 0),
    'Social Responsibility Programs': Number(dbSupplier.social_responsibility_programs || 0),
    'Sustainable Sourcing Practices': Number(dbSupplier.sustainable_sourcing_practices || 0)
  };

  // Return the supplier object with explicit property assignment
  return {
    id,
    name,
    description,
    contactPerson,
    email,
    phone,
    address,
    industry,
    establishedYear,
    certifications,
    status,
    website,
    overallScore,
    createdAt,
    updatedAt,
    scores
  };
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
