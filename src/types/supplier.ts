
export interface Supplier {
  id: string;
  name: string;
  description: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  establishedYear: number;
  certifications: string[];
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  overallScore?: number;
  scores?: Record<string, number>; // Add scores property
  website?: string; // Add website property
  contactEmail?: string; // Add contactEmail as alias
  contactPhone?: string; // Add contactPhone as alias
  createdAt: Date;
  updatedAt: Date;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  weight: number; // Percentage weight in overall score
  maxScore: number;
  category: 'quality' | 'cost' | 'leadTime' | 'sustainability' | 'reliability' | 'innovation' | 'service' | 'risk';
  subCriteria?: SubCriteria[];
}

export interface SubCriteria {
  id: string;
  name: string;
  weight: number; // Percentage within main criteria
  description: string;
}

export interface SupplierScore {
  id: string;
  supplierId: string;
  criteriaId: string;
  score: number;
  comments: string;
  evaluatedBy: string;
  evaluatedAt: Date;
}

export interface SupplierEvaluation {
  id: string;
  supplierId: string;
  totalScore: number;
  weightedScore: number;
  rank: number;
  status: 'draft' | 'completed' | 'approved';
  evaluatedBy: string;
  evaluatedAt: Date;
  scores: SupplierScore[];
}

export const DEFAULT_CRITERIA: EvaluationCriteria[] = [
  {
    id: '1',
    name: 'Product Quality',
    description: 'Assessment of product specifications, defect rates, consistency, and compliance with quality standards',
    weight: 25,
    maxScore: 100,
    category: 'quality',
    subCriteria: [
      { id: '1a', name: 'Product Specifications Adherence', weight: 8, description: 'Compliance with technical specifications' },
      { id: '1b', name: 'Defect Rate & Quality Control', weight: 10, description: 'Quality control processes and defect rates' },
      { id: '1c', name: 'Quality Certifications', weight: 7, description: 'ISO 9001 and other quality certifications' }
    ]
  },
  {
    id: '2',
    name: 'Cost Competitiveness',
    description: 'Overall cost evaluation including pricing, payment terms, and total cost of ownership',
    weight: 20,
    maxScore: 100,
    category: 'cost',
    subCriteria: [
      { id: '2a', name: 'Unit Pricing Competitiveness', weight: 12, description: 'Competitive pricing compared to market' },
      { id: '2b', name: 'Payment Terms Flexibility', weight: 4, description: 'Flexible payment terms and conditions' },
      { id: '2c', name: 'Total Cost of Ownership', weight: 4, description: 'Complete cost including maintenance and support' }
    ]
  },
  {
    id: '3',
    name: 'Lead Time Performance',
    description: 'Ability to meet delivery schedules and responsiveness to urgent requirements',
    weight: 20,
    maxScore: 100,
    category: 'leadTime',
    subCriteria: [
      { id: '3a', name: 'On-time Delivery Performance', weight: 12, description: 'Historical on-time delivery record' },
      { id: '3b', name: 'Lead Time Competitiveness', weight: 5, description: 'Competitive delivery timeframes' },
      { id: '3c', name: 'Emergency Response Capability', weight: 3, description: 'Ability to handle urgent requests' }
    ]
  },
  {
    id: '4',
    name: 'Reliability & Trust',
    description: 'Consistency in business dealings, communication, and long-term partnership potential',
    weight: 20,
    maxScore: 100,
    category: 'reliability',
    subCriteria: [
      { id: '4a', name: 'Communication Effectiveness', weight: 7, description: 'Clear and responsive communication' },
      { id: '4b', name: 'Contract Compliance History', weight: 8, description: 'Track record of meeting contractual obligations' },
      { id: '4c', name: 'Business Stability & Longevity', weight: 5, description: 'Financial stability and business history' }
    ]
  },
  {
    id: '5',
    name: 'Sustainability Practices',
    description: 'Environmental and social responsibility initiatives and certifications',
    weight: 15,
    maxScore: 100,
    category: 'sustainability',
    subCriteria: [
      { id: '5a', name: 'Environmental Certifications', weight: 8, description: 'ISO 14001 and environmental certifications' },
      { id: '5b', name: 'Social Responsibility Programs', weight: 4, description: 'CSR initiatives and programs' },
      { id: '5c', name: 'Sustainable Sourcing Practices', weight: 3, description: 'Sustainable material sourcing' }
    ]
  }
];

export const SCORING_SCALE = {
  EXCELLENT: { min: 90, max: 100, label: 'Excellent', description: 'Exceeds expectations significantly' },
  GOOD: { min: 80, max: 89, label: 'Good', description: 'Meets expectations with some areas of excellence' },
  SATISFACTORY: { min: 70, max: 79, label: 'Satisfactory', description: 'Meets minimum requirements' },
  NEEDS_IMPROVEMENT: { min: 60, max: 69, label: 'Needs Improvement', description: 'Below expectations, requires monitoring' },
  UNACCEPTABLE: { min: 0, max: 59, label: 'Unacceptable', description: 'Does not meet minimum standards' }
};
