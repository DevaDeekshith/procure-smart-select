
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ELEVENLABS_API_KEY = "sk_86e3b671a655957a5c76825e01f1a161ceb461eb60ab3efc"

interface Supplier {
  id: string;
  name: string;
  description: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  established_year: number;
  status: string;
  overall_score: number;
  website: string;
  certifications: string[];
  created_at: string;
  updated_at: string;
  product_specifications_adherence: number;
  defect_rate_quality_control: number;
  quality_certification_score: number;
  unit_pricing_competitiveness: number;
  payment_terms_flexibility: number;
  total_cost_ownership: number;
  ontime_delivery_performance: number;
  lead_time_competitiveness: number;
  emergency_response_capability: number;
  communication_effectiveness: number;
  contract_compliance_history: number;
  business_stability_longevity: number;
  environmental_certifications: number;
  social_responsibility_programs: number;
  sustainable_sourcing_practices: number;
}

const formatSuppliersForKnowledgeBase = (suppliers: Supplier[]): string => {
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
  const averageScore = suppliers.length > 0 
    ? suppliers.reduce((sum, s) => sum + (s.overall_score || 0), 0) / suppliers.length 
    : 0;

  // Calculate top 10% performers
  const topPerformersCount = Math.ceil(suppliers.length * 0.1);
  const topPerformers = suppliers
    .filter(s => s.overall_score && s.overall_score > 0)
    .sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0))
    .slice(0, topPerformersCount);

  // Group by industry
  const industriesMap = suppliers.reduce((acc, supplier) => {
    const industry = supplier.industry || 'Unknown';
    if (!acc[industry]) {
      acc[industry] = [];
    }
    acc[industry].push(supplier);
    return acc;
  }, {} as Record<string, Supplier[]>);

  // Group by status
  const statusMap = suppliers.reduce((acc, supplier) => {
    const status = supplier.status || 'unknown';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(supplier);
    return acc;
  }, {} as Record<string, Supplier[]>);

  let knowledgeText = `# CHANAKYA Supplier Management System Knowledge Base

## OVERVIEW
Total Suppliers: ${totalSuppliers}
Active Suppliers: ${activeSuppliers}
Average Overall Score: ${averageScore.toFixed(1)}
Top Performers (Top 10%): ${topPerformers.length}

## TOP PERFORMING SUPPLIERS (Top 10%)
${topPerformers.map((supplier, index) => `
${index + 1}. ${supplier.name}
   - Industry: ${supplier.industry}
   - Overall Score: ${supplier.overall_score?.toFixed(1)}%
   - Status: ${supplier.status}
   - Contact: ${supplier.contact_person} (${supplier.email})
   - Established: ${supplier.established_year}
   - Address: ${supplier.address}
   - Website: ${supplier.website}
   - Key Strengths:
     * Product Quality: ${((supplier.product_specifications_adherence + supplier.defect_rate_quality_control + supplier.quality_certification_score) / 3).toFixed(1)}%
     * Cost Competitiveness: ${((supplier.unit_pricing_competitiveness + supplier.payment_terms_flexibility + supplier.total_cost_ownership) / 3).toFixed(1)}%
     * Lead Time Performance: ${((supplier.ontime_delivery_performance + supplier.lead_time_competitiveness + supplier.emergency_response_capability) / 3).toFixed(1)}%
     * Reliability: ${((supplier.communication_effectiveness + supplier.contract_compliance_history + supplier.business_stability_longevity) / 3).toFixed(1)}%
     * Sustainability: ${((supplier.environmental_certifications + supplier.social_responsibility_programs + supplier.sustainable_sourcing_practices) / 3).toFixed(1)}%
`).join('')}

## SUPPLIERS BY INDUSTRY
${Object.entries(industriesMap).map(([industry, suppliers]) => `
### ${industry} (${suppliers.length} suppliers)
Average Score: ${(suppliers.reduce((sum, s) => sum + (s.overall_score || 0), 0) / suppliers.length).toFixed(1)}%
Top Supplier: ${suppliers.sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0))[0]?.name} (${suppliers.sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0))[0]?.overall_score?.toFixed(1)}%)
${suppliers.map(s => `- ${s.name}: ${s.overall_score?.toFixed(1)}% (${s.status})`).join('\n')}
`).join('')}

## SUPPLIERS BY STATUS
${Object.entries(statusMap).map(([status, suppliers]) => `
### ${status.toUpperCase()} (${suppliers.length} suppliers)
${suppliers.map(s => `- ${s.name}: ${s.overall_score?.toFixed(1)}% (${s.industry})`).join('\n')}
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

## DETAILED SUPPLIER DATABASE
${suppliers.map(supplier => `
**${supplier.name}** (ID: ${supplier.id})
- Industry: ${supplier.industry}
- Status: ${supplier.status}
- Overall Score: ${supplier.overall_score?.toFixed(1)}%
- Contact Person: ${supplier.contact_person}
- Email: ${supplier.email}
- Phone: ${supplier.phone}
- Address: ${supplier.address}
- Website: ${supplier.website}
- Established: ${supplier.established_year}
- Description: ${supplier.description}
- Certifications: ${supplier.certifications?.join(', ') || 'None listed'}

Detailed Scores:
- Product Specifications Adherence: ${supplier.product_specifications_adherence}%
- Defect Rate & Quality Control: ${supplier.defect_rate_quality_control}%
- Quality Certifications: ${supplier.quality_certification_score}%
- Unit Pricing Competitiveness: ${supplier.unit_pricing_competitiveness}%
- Payment Terms Flexibility: ${supplier.payment_terms_flexibility}%
- Total Cost of Ownership: ${supplier.total_cost_ownership}%
- On-time Delivery Performance: ${supplier.ontime_delivery_performance}%
- Lead Time Competitiveness: ${supplier.lead_time_competitiveness}%
- Emergency Response Capability: ${supplier.emergency_response_capability}%
- Communication Effectiveness: ${supplier.communication_effectiveness}%
- Contract Compliance History: ${supplier.contract_compliance_history}%
- Business Stability & Longevity: ${supplier.business_stability_longevity}%
- Environmental Certifications: ${supplier.environmental_certifications}%
- Social Responsibility Programs: ${supplier.social_responsibility_programs}%
- Sustainable Sourcing Practices: ${supplier.sustainable_sourcing_practices}%

Last Updated: ${supplier.updated_at}
---
`).join('')}

## COMMON QUERIES AND ANSWERS
- "Who is the best supplier?" - ${topPerformers[0]?.name || 'No scored suppliers yet'} with ${topPerformers[0]?.overall_score?.toFixed(1) || '0'}% overall score
- "Which industry has the best suppliers?" - ${Object.entries(industriesMap).sort(([,a], [,b]) => (b.reduce((sum, s) => sum + (s.overall_score || 0), 0) / b.length) - (a.reduce((sum, s) => sum + (s.overall_score || 0), 0) / a.length))[0]?.[0] || 'No data'} industry
- "How many active suppliers?" - ${activeSuppliers} out of ${totalSuppliers} suppliers
- "What's the average supplier score?" - ${averageScore.toFixed(1)}%

This knowledge base was last updated: ${new Date().toISOString()}
`;

  return knowledgeText;
};

const syncToElevenLabs = async (knowledgeText: string) => {
  console.log('Syncing knowledge base to ElevenLabs...');
  
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/convai/knowledge-base/text', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: knowledgeText,
        title: 'CHANAKYA Supplier Database',
        description: 'Complete supplier evaluation and management knowledge base'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Successfully synced to ElevenLabs:', result);
    return result;
  } catch (error) {
    console.error('Error syncing to ElevenLabs:', error);
    throw error;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting ElevenLabs knowledge base sync...');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all suppliers from database
    const { data: suppliers, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('overall_score', { ascending: false });

    if (error) {
      console.error('Error fetching suppliers:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log(`Fetched ${suppliers?.length || 0} suppliers from database`);

    // Format data for knowledge base
    const knowledgeText = formatSuppliersForKnowledgeBase(suppliers || []);
    
    // Sync to ElevenLabs
    const result = await syncToElevenLabs(knowledgeText);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Knowledge base synced successfully',
        suppliersCount: suppliers?.length || 0,
        result 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Sync error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});
