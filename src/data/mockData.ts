
import { Supplier, SupplierScore, SupplierEvaluation } from '@/types/supplier';

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'TechFlow Solutions',
    description: 'Leading provider of technology components and electronic systems with focus on innovation and quality',
    contactPerson: 'John Anderson',
    email: 'j.anderson@techflow.com',
    phone: '+1-555-0123',
    address: '123 Business Park, San Francisco, CA 94105',
    industry: 'Technology Components',
    establishedYear: 2010,
    certifications: ['ISO 9001', 'ISO 14001', 'SOC 2'],
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-10')
  },
  {
    id: '2',
    name: 'Global Manufacturing Corp',
    description: 'Established manufacturing company with extensive experience in precision components and automotive parts',
    contactPerson: 'Sarah Chen',
    email: 's.chen@globalmanuf.com',
    phone: '+1-555-0124',
    address: '456 Industrial Ave, Detroit, MI 48201',
    industry: 'Manufacturing',
    establishedYear: 1995,
    certifications: ['ISO 9001', 'IATF 16949', 'ISO 45001'],
    status: 'active',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-06-12')
  },
  {
    id: '3',
    name: 'EcoSupply Partners',
    description: 'Sustainable materials supplier committed to environmental responsibility and ethical sourcing practices',
    contactPerson: 'Michael Rodriguez',
    email: 'm.rodriguez@ecosupply.com',
    phone: '+1-555-0125',
    address: '789 Green Valley Rd, Austin, TX 78701',
    industry: 'Sustainable Materials',
    establishedYear: 2018,
    certifications: ['B Corp', 'FSC', 'Fair Trade', 'ISO 14001'],
    status: 'active',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-06-08')
  },
  {
    id: '4',
    name: 'Precision Components Ltd',
    description: 'Specialized precision engineering company offering high-quality components for aerospace and medical industries',
    contactPerson: 'Emma Thompson',
    email: 'e.thompson@precision.com',
    phone: '+1-555-0126',
    address: '321 Manufacturing Dr, Cleveland, OH 44101',
    industry: 'Precision Engineering',
    establishedYear: 2005,
    certifications: ['ISO 9001', 'AS9100', 'ISO 13485'],
    status: 'active',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-06-01')
  },
  {
    id: '5',
    name: 'FlexiLogistics Pro',
    description: 'Logistics and supply chain solutions provider with advanced tracking and delivery capabilities',
    contactPerson: 'David Kim',
    email: 'd.kim@flexilogistics.com',
    phone: '+1-555-0127',
    address: '654 Logistics Blvd, Phoenix, AZ 85001',
    industry: 'Logistics & Supply Chain',
    establishedYear: 2012,
    certifications: ['ISO 9001', 'C-TPAT'],
    status: 'pending',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-14')
  },
  {
    id: '6',
    name: 'Reliable Parts Inc',
    description: 'Established parts supplier with strong reliability record and competitive pricing for industrial components',
    contactPerson: 'Lisa Wang',
    email: 'l.wang@reliableparts.com',
    phone: '+1-555-0128',
    address: '987 Industrial Way, Houston, TX 77001',
    industry: 'Industrial Components',
    establishedYear: 2001,
    certifications: ['ISO 9001'],
    status: 'active',
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-06-05')
  }
];

export const mockScores: SupplierScore[] = [
  // TechFlow Solutions scores (Excellent performer)
  { id: '1', supplierId: '1', criteriaId: '1', score: 88, comments: 'Excellent product quality with consistent specifications', evaluatedBy: 'Alice Johnson', evaluatedAt: new Date('2024-06-01') },
  { id: '2', supplierId: '1', criteriaId: '2', score: 82, comments: 'Competitive pricing with good payment terms', evaluatedBy: 'Alice Johnson', evaluatedAt: new Date('2024-06-01') },
  { id: '3', supplierId: '1', criteriaId: '3', score: 92, comments: 'Outstanding delivery performance, always on time', evaluatedBy: 'Alice Johnson', evaluatedAt: new Date('2024-06-01') },
  { id: '4', supplierId: '1', criteriaId: '4', score: 90, comments: 'Highly reliable with excellent communication', evaluatedBy: 'Alice Johnson', evaluatedAt: new Date('2024-06-01') },
  { id: '5', supplierId: '1', criteriaId: '5', score: 78, comments: 'Good sustainability practices, room for improvement', evaluatedBy: 'Alice Johnson', evaluatedAt: new Date('2024-06-01') },
  
  // Global Manufacturing Corp scores (Strong in quality and reliability)
  { id: '6', supplierId: '2', criteriaId: '1', score: 94, comments: 'Outstanding quality control and certifications', evaluatedBy: 'Bob Wilson', evaluatedAt: new Date('2024-06-02') },
  { id: '7', supplierId: '2', criteriaId: '2', score: 79, comments: 'Fair pricing, could be more competitive', evaluatedBy: 'Bob Wilson', evaluatedAt: new Date('2024-06-02') },
  { id: '8', supplierId: '2', criteriaId: '3', score: 85, comments: 'Good delivery performance with minor delays', evaluatedBy: 'Bob Wilson', evaluatedAt: new Date('2024-06-02') },
  { id: '9', supplierId: '2', criteriaId: '4', score: 93, comments: 'Exceptional reliability and business stability', evaluatedBy: 'Bob Wilson', evaluatedAt: new Date('2024-06-02') },
  { id: '10', supplierId: '2', criteriaId: '5', score: 72, comments: 'Working on sustainability initiatives', evaluatedBy: 'Bob Wilson', evaluatedAt: new Date('2024-06-02') },
  
  // EcoSupply Partners scores (Sustainability leader)
  { id: '11', supplierId: '3', criteriaId: '1', score: 83, comments: 'Good quality, improving consistency', evaluatedBy: 'Carol Davis', evaluatedAt: new Date('2024-06-03') },
  { id: '12', supplierId: '3', criteriaId: '2', score: 87, comments: 'Excellent value proposition for sustainable materials', evaluatedBy: 'Carol Davis', evaluatedAt: new Date('2024-06-03') },
  { id: '13', supplierId: '3', criteriaId: '3', score: 76, comments: 'Delivery times acceptable, sometimes delayed', evaluatedBy: 'Carol Davis', evaluatedAt: new Date('2024-06-03') },
  { id: '14', supplierId: '3', criteriaId: '4', score: 84, comments: 'Trustworthy partner with good communication', evaluatedBy: 'Carol Davis', evaluatedAt: new Date('2024-06-03') },
  { id: '15', supplierId: '3', criteriaId: '5', score: 96, comments: 'Exceptional sustainability leadership', evaluatedBy: 'Carol Davis', evaluatedAt: new Date('2024-06-03') },

  // Precision Components Ltd scores (High quality, premium pricing)
  { id: '16', supplierId: '4', criteriaId: '1', score: 96, comments: 'Exceptional precision and quality for aerospace standards', evaluatedBy: 'David Lee', evaluatedAt: new Date('2024-06-04') },
  { id: '17', supplierId: '4', criteriaId: '2', score: 68, comments: 'Premium pricing, justified by quality but expensive', evaluatedBy: 'David Lee', evaluatedAt: new Date('2024-06-04') },
  { id: '18', supplierId: '4', criteriaId: '3', score: 81, comments: 'Good lead times for complex components', evaluatedBy: 'David Lee', evaluatedAt: new Date('2024-06-04') },
  { id: '19', supplierId: '4', criteriaId: '4', score: 89, comments: 'Very reliable for critical applications', evaluatedBy: 'David Lee', evaluatedAt: new Date('2024-06-04') },
  { id: '20', supplierId: '4', criteriaId: '5', score: 74, comments: 'Standard sustainability practices', evaluatedBy: 'David Lee', evaluatedAt: new Date('2024-06-04') },

  // FlexiLogistics Pro scores (Pending evaluation - partial scores)
  { id: '21', supplierId: '5', criteriaId: '1', score: 75, comments: 'Initial assessment shows good service quality', evaluatedBy: 'Emma Brown', evaluatedAt: new Date('2024-06-05') },
  { id: '22', supplierId: '5', criteriaId: '3', score: 88, comments: 'Excellent logistics and delivery capabilities', evaluatedBy: 'Emma Brown', evaluatedAt: new Date('2024-06-05') },

  // Reliable Parts Inc scores (Balanced performer)
  { id: '23', supplierId: '6', criteriaId: '1', score: 79, comments: 'Consistent quality for standard components', evaluatedBy: 'Frank Miller', evaluatedAt: new Date('2024-06-06') },
  { id: '24', supplierId: '6', criteriaId: '2', score: 91, comments: 'Very competitive pricing and good terms', evaluatedBy: 'Frank Miller', evaluatedAt: new Date('2024-06-06') },
  { id: '25', supplierId: '6', criteriaId: '3', score: 83, comments: 'Reliable delivery with good lead times', evaluatedBy: 'Frank Miller', evaluatedAt: new Date('2024-06-06') },
  { id: '26', supplierId: '6', criteriaId: '4', score: 87, comments: 'Strong reliability record over many years', evaluatedBy: 'Frank Miller', evaluatedAt: new Date('2024-06-06') },
  { id: '27', supplierId: '6', criteriaId: '5', score: 65, comments: 'Basic sustainability practices, needs improvement', evaluatedBy: 'Frank Miller', evaluatedAt: new Date('2024-06-06') }
];
