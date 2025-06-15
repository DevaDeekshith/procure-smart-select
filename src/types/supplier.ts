
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  establishedYear: number;
  certifications: string[];
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  weight: number; // Percentage weight in overall score
  maxScore: number;
  category: 'quality' | 'cost' | 'leadTime' | 'sustainability' | 'reliability';
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
    description: 'Quality of products and services delivered',
    weight: 25,
    maxScore: 100,
    category: 'quality'
  },
  {
    id: '2',
    name: 'Cost Competitiveness',
    description: 'Pricing and overall cost effectiveness',
    weight: 20,
    maxScore: 100,
    category: 'cost'
  },
  {
    id: '3',
    name: 'Lead Time Performance',
    description: 'Ability to meet delivery schedules',
    weight: 20,
    maxScore: 100,
    category: 'leadTime'
  },
  {
    id: '4',
    name: 'Sustainability Practices',
    description: 'Environmental and social responsibility',
    weight: 15,
    maxScore: 100,
    category: 'sustainability'
  },
  {
    id: '5',
    name: 'Reliability & Trust',
    description: 'Consistency and trustworthiness in business dealings',
    weight: 20,
    maxScore: 100,
    category: 'reliability'
  }
];
