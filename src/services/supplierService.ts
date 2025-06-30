
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
  // Create a basic supplier object first
  const supplier: Supplier = {
    id: String(dbSupplier.id || ''),
    name: String(dbSupplier.name || ''),
    description: String(dbSupplier.description || ''),
    contactPerson: String(dbSupplier.contact_person || ''),
    email: String(dbSupplier.email || ''),
    phone: String(dbSupplier.phone || ''),
    address: String(dbSupplier.address || ''),
    industry: String(dbSupplier.industry || ''),
    establishedYear: Number(dbSupplier.established_year || 0),
    certifications: Array.isArray(dbSupplier.certifications) ? dbSupplier.certifications : [],
    status: (dbSupplier.status || 'pending') as 'active' | 'inactive' | 'pending' | 'rejected',
    website: String(dbSupplier.website || ''),
    overallScore: Number(dbSupplier.overall_score || 0),
    createdAt: new Date(dbSupplier.created_at || Date.now()),
    updatedAt: new Date(dbSupplier.updated_at || Date.now()),
    scores: {}
  };

  // Build scores object separately to avoid type inference issues
  const scoresMap: Record<string, number> = {};
  scoresMap['Product Specifications Adherence'] = Number(dbSupplier.product_specifications_adherence || 0);
  scoresMap['Defect Rate & Quality Control'] = Number(dbSupplier.defect_rate_quality_control || 0);
  scoresMap['Quality Certifications'] = Number(dbSupplier.quality_certification_score || 0);
  scoresMap['Unit Pricing Competitiveness'] = Number(dbSupplier.unit_pricing_competitiveness || 0);
  scoresMap['Payment Terms Flexibility'] = Number(dbSupplier.payment_terms_flexibility || 0);
  scoresMap['Total Cost of Ownership'] = Number(dbSupplier.total_cost_ownership || 0);
  scoresMap['On-time Delivery Performance'] = Number(dbSupplier.ontime_delivery_performance || 0);
  scoresMap['Lead Time Competitiveness'] = Number(dbSupplier.lead_time_competitiveness || 0);
  scoresMap['Emergency Response Capability'] = Number(dbSupplier.emergency_response_capability || 0);
  scoresMap['Communication Effectiveness'] = Number(dbSupplier.communication_effectiveness || 0);
  scoresMap['Contract Compliance History'] = Number(dbSupplier.contract_compliance_history || 0);
  scoresMap['Business Stability & Longevity'] = Number(dbSupplier.business_stability_longevity || 0);
  scoresMap['Environmental Certifications'] = Number(dbSupplier.environmental_certifications || 0);
  scoresMap['Social Responsibility Programs'] = Number(dbSupplier.social_responsibility_programs || 0);
  scoresMap['Sustainable Sourcing Practices'] = Number(dbSupplier.sustainable_sourcing_practices || 0);

  // Assign scores to supplier
  supplier.scores = scoresMap;

  return supplier;
};

export const supplierService = {
  async getAllSuppliers(): Promise<Supplier[]> {
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

    return data?.map(mapSupplierFromDatabase) || [];
  },

  async createSupplier(supplierData: SupplierInsert): Promise<Supplier> {
    // Normalize status to ensure it's valid
    const normalizedData = {
      ...supplierData,
      status: supplierData.status?.toLowerCase() as 'active' | 'inactive' | 'pending' | 'rejected' || 'pending'
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
      status: supplierData.status?.toLowerCase() as 'active' | 'inactive' | 'pending' | 'rejected'
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
      status: supplier.status?.toLowerCase() as 'active' | 'inactive' | 'pending' | 'rejected' || 'pending'
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
