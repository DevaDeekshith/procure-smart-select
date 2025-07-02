
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ELEVENLABS_API_KEY = "sk_86e3b671a655957a5c76825e01f1a161ceb461eb60ab3efc";

interface SupplierData {
  id: string;
  name: string;
  industry: string;
  status: string;
  overall_score: number | null;
  contact_person: string;
  email: string;
  phone: string;
  address: string | null;
  website: string | null;
  established_year: number | null;
  description: string | null;
  certifications: string[] | null;
  product_specifications_adherence: number | null;
  defect_rate_quality_control: number | null;
  quality_certification_score: number | null;
  unit_pricing_competitiveness: number | null;
  payment_terms_flexibility: number | null;
  total_cost_ownership: number | null;
  ontime_delivery_performance: number | null;
  lead_time_competitiveness: number | null;
  emergency_response_capability: number | null;
  communication_effectiveness: number | null;
  contract_compliance_history: number | null;
  business_stability_longevity: number | null;
  environmental_certifications: number | null;
  social_responsibility_programs: number | null;
  sustainable_sourcing_practices: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export const elevenLabsKnowledgeService = {
  async syncKnowledgeBase(): Promise<boolean> {
    try {
      console.log('Syncing knowledge base to ElevenLabs...');
      
      // Fetch all suppliers directly from Supabase
      const { data: suppliers, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('overall_score', { ascending: false });

      if (error) {
        console.error('Error fetching suppliers for sync:', error);
        throw error;
      }

      console.log('Fetched suppliers for ElevenLabs sync:', suppliers?.length || 0);

      // Type the suppliers array properly
      const typedSuppliers = (suppliers || []) as SupplierData[];

      // Format supplier data for knowledge base
      const knowledgeText = this.formatSuppliersForKnowledgeBase(typedSuppliers);
      
      // Send directly to ElevenLabs API
      const response = await fetch('https://api.elevenlabs.io/v1/convai/knowledge-base/text', {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: knowledgeText,
          title: 'CHANAKYA Supplier Management System - Complete Database',
          description: 'Comprehensive supplier evaluation and management knowledge base with all supplier data, scores, and analytics'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs API error:', response.status, errorText);
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('ElevenLabs knowledge base sync successful:', result);
      
      toast({
        title: "Knowledge Base Updated",
        description: `Successfully synced ${typedSuppliers.length} suppliers to ElevenLabs`,
      });
      
      return true;
    } catch (error) {
      console.error('Knowledge base sync error:', error);
      toast({
        title: "Sync Failed",
        description: "Unable to update ElevenLabs knowledge base",
        variant: "destructive"
      });
      return false;
    }
  },

  formatSuppliersForKnowledgeBase(suppliers: SupplierData[]): string {
    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
    const averageScore = suppliers.length > 0 
      ? suppliers.reduce((sum, s) => sum + (s.overall_score || 0), 0) / suppliers.length 
      : 0;

    // Calculate top performers
    const topPerformers = suppliers
      .filter(s => s.overall_score && s.overall_score > 0)
      .sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0))
      .slice(0, Math.ceil(suppliers.length * 0.1));

    // Group by industry
    const industriesMap = suppliers.reduce((acc: Record<string, SupplierData[]>, supplier) => {
      const industry = supplier.industry || 'Unknown';
      if (!acc[industry]) {
        acc[industry] = [];
      }
      acc[industry].push(supplier);
      return acc;
    }, {});

    return `# CHANAKYA Supplier Management System - Complete Knowledge Base

## SYSTEM OVERVIEW
- Total Suppliers: ${totalSuppliers}
- Active Suppliers: ${activeSuppliers}
- Pending Suppliers: ${suppliers.filter(s => s.status === 'pending').length}
- Rejected Suppliers: ${suppliers.filter(s => s.status === 'rejected').length}
- Average Overall Score: ${averageScore.toFixed(1)}%

## TOP PERFORMING SUPPLIERS
${topPerformers.map((supplier, index) => `
${index + 1}. **${supplier.name}** (${supplier.industry})
   - Overall Score: ${supplier.overall_score?.toFixed(1)}%
   - Status: ${supplier.status}
   - Contact: ${supplier.contact_person} (${supplier.email})
   - Phone: ${supplier.phone}
   - Address: ${supplier.address}
   - Website: ${supplier.website || 'Not provided'}
   - Established: ${supplier.established_year}
   - Individual Scores:
     * Product Specifications Adherence: ${supplier.product_specifications_adherence || 0}%
     * Defect Rate & Quality Control: ${supplier.defect_rate_quality_control || 0}%
     * Quality Certifications: ${supplier.quality_certification_score || 0}%
     * Unit Pricing Competitiveness: ${supplier.unit_pricing_competitiveness || 0}%
     * Payment Terms Flexibility: ${supplier.payment_terms_flexibility || 0}%
     * Total Cost of Ownership: ${supplier.total_cost_ownership || 0}%
     * On-time Delivery Performance: ${supplier.ontime_delivery_performance || 0}%
     * Lead Time Competitiveness: ${supplier.lead_time_competitiveness || 0}%
     * Emergency Response Capability: ${supplier.emergency_response_capability || 0}%
     * Communication Effectiveness: ${supplier.communication_effectiveness || 0}%
     * Contract Compliance History: ${supplier.contract_compliance_history || 0}%
     * Business Stability & Longevity: ${supplier.business_stability_longevity || 0}%
     * Environmental Certifications: ${supplier.environmental_certifications || 0}%
     * Social Responsibility Programs: ${supplier.social_responsibility_programs || 0}%
     * Sustainable Sourcing Practices: ${supplier.sustainable_sourcing_practices || 0}%
`).join('')}

## ALL SUPPLIERS DETAILED DATABASE
${suppliers.map(supplier => `
**${supplier.name}** (ID: ${supplier.id})
- Industry: ${supplier.industry}
- Status: ${supplier.status}
- Overall Score: ${supplier.overall_score?.toFixed(1) || 0}%
- Contact: ${supplier.contact_person} (${supplier.email})
- Phone: ${supplier.phone}
- Address: ${supplier.address}
- Website: ${supplier.website || 'Not provided'}
- Established: ${supplier.established_year}
- Description: ${supplier.description}
- Certifications: ${Array.isArray(supplier.certifications) ? supplier.certifications.join(', ') : 'None'}

DETAILED PERFORMANCE SCORES:
- Product Specifications Adherence: ${supplier.product_specifications_adherence || 0}%
- Defect Rate & Quality Control: ${supplier.defect_rate_quality_control || 0}%
- Quality Certifications: ${supplier.quality_certification_score || 0}%
- Unit Pricing Competitiveness: ${supplier.unit_pricing_competitiveness || 0}%
- Payment Terms Flexibility: ${supplier.payment_terms_flexibility || 0}%
- Total Cost of Ownership: ${supplier.total_cost_ownership || 0}%
- On-time Delivery Performance: ${supplier.ontime_delivery_performance || 0}%
- Lead Time Competitiveness: ${supplier.lead_time_competitiveness || 0}%
- Emergency Response Capability: ${supplier.emergency_response_capability || 0}%
- Communication Effectiveness: ${supplier.communication_effectiveness || 0}%
- Contract Compliance History: ${supplier.contract_compliance_history || 0}%
- Business Stability & Longevity: ${supplier.business_stability_longevity || 0}%
- Environmental Certifications: ${supplier.environmental_certifications || 0}%
- Social Responsibility Programs: ${supplier.social_responsibility_programs || 0}%
- Sustainable Sourcing Practices: ${supplier.sustainable_sourcing_practices || 0}%

Created: ${supplier.created_at}
Updated: ${supplier.updated_at}
---
`).join('')}

## INDUSTRIES BREAKDOWN
${Object.entries(industriesMap).map(([industry, supplierList]) => `
### ${industry} Industry (${supplierList.length} suppliers)
Average Score: ${(supplierList.reduce((sum, s) => sum + (s.overall_score || 0), 0) / supplierList.length).toFixed(1)}%
Suppliers: ${supplierList.map(s => `${s.name} (${s.overall_score?.toFixed(1) || 0}%)`).join(', ')}
`).join('')}

## EVALUATION CRITERIA DEFINITIONS
1. **Product Quality (25% weight)**
   - Product Specifications Adherence: Compliance with technical specifications
   - Defect Rate & Quality Control: Quality control processes and defect rates
   - Quality Certifications: ISO 9001 and other quality certifications

2. **Cost Competitiveness (20% weight)**
   - Unit Pricing Competitiveness: Competitive pricing compared to market
   - Payment Terms Flexibility: Flexible payment terms and conditions
   - Total Cost of Ownership: Complete cost including maintenance and support

3. **Lead Time Performance (20% weight)**
   - On-time Delivery Performance: Historical on-time delivery record
   - Lead Time Competitiveness: Competitive delivery timeframes
   - Emergency Response Capability: Ability to handle urgent requests

4. **Reliability & Trust (20% weight)**
   - Communication Effectiveness: Clear and responsive communication
   - Contract Compliance History: Track record of meeting contractual obligations
   - Business Stability & Longevity: Financial stability and business history

5. **Sustainability Practices (15% weight)**
   - Environmental Certifications: ISO 14001 and environmental certifications
   - Social Responsibility Programs: CSR initiatives and programs
   - Sustainable Sourcing Practices: Sustainable material sourcing

## COMMON QUERIES AND ANSWERS
- "Who is the best supplier?" - ${topPerformers[0]?.name || 'No scored suppliers yet'} with ${topPerformers[0]?.overall_score?.toFixed(1) || '0'}% overall score
- "Which industry has the best suppliers?" - ${Object.entries(industriesMap).sort(([,a], [,b]) => (b.reduce((sum, s) => sum + (s.overall_score || 0), 0) / b.length) - (a.reduce((sum, s) => sum + (s.overall_score || 0), 0) / a.length))[0]?.[0] || 'No data'} industry
- "How many active suppliers?" - ${activeSuppliers} out of ${totalSuppliers} suppliers
- "What's the average supplier score?" - ${averageScore.toFixed(1)}%

This knowledge base contains complete supplier information with all individual scores and was last updated: ${new Date().toISOString()}
`;
  }
};
