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
  const result = {} as Supplier;
  
  result.id = String(dbSupplier.id || '');
  result.name = String(dbSupplier.name || '');
  result.description = String(dbSupplier.description || '');
  result.contactPerson = String(dbSupplier.contact_person || '');
  result.email = String(dbSupplier.email || '');
  result.phone = String(dbSupplier.phone || '');
  result.address = String(dbSupplier.address || '');
  result.industry = String(dbSupplier.industry || '');
  result.establishedYear = Number(dbSupplier.established_year || 0);
  result.certifications = Array.isArray(dbSupplier.certifications) ? dbSupplier.certifications : [];
  result.status = (dbSupplier.status || 'pending') as 'active' | 'inactive' | 'pending' | 'rejected';
  result.website = String(dbSupplier.website || '');
  result.overallScore = Number(dbSupplier.overall_score || 0);
  result.createdAt = new Date(dbSupplier.created_at || Date.now());
  result.updatedAt = new Date(dbSupplier.updated_at || Date.now());
  
  const scoreMap = {} as Record<string, number>;
  scoreMap['Product Specifications Adherence'] = Number(dbSupplier.product_specifications_adherence || 0);
  scoreMap['Defect Rate & Quality Control'] = Number(dbSupplier.defect_rate_quality_control || 0);
  scoreMap['Quality Certifications'] = Number(dbSupplier.quality_certification_score || 0);
  scoreMap['Unit Pricing Competitiveness'] = Number(dbSupplier.unit_pricing_competitiveness || 0);
  scoreMap['Payment Terms Flexibility'] = Number(dbSupplier.payment_terms_flexibility || 0);
  scoreMap['Total Cost of Ownership'] = Number(dbSupplier.total_cost_ownership || 0);
  scoreMap['On-time Delivery Performance'] = Number(dbSupplier.ontime_delivery_performance || 0);
  scoreMap['Lead Time Competitiveness'] = Number(dbSupplier.lead_time_competitiveness || 0);
  scoreMap['Emergency Response Capability'] = Number(dbSupplier.emergency_response_capability || 0);
  scoreMap['Communication Effectiveness'] = Number(dbSupplier.communication_effectiveness || 0);
  scoreMap['Contract Compliance History'] = Number(dbSupplier.contract_compliance_history || 0);
  scoreMap['Business Stability & Longevity'] = Number(dbSupplier.business_stability_longevity || 0);
  scoreMap['Environmental Certifications'] = Number(dbSupplier.environmental_certifications || 0);
  scoreMap['Social Responsibility Programs'] = Number(dbSupplier.social_responsibility_programs || 0);
  scoreMap['Sustainable Sourcing Practices'] = Number(dbSupplier.sustainable_sourcing_practices || 0);
  
  result.scores = scoreMap;
  
  return result;
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
