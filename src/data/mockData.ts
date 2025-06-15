
import { Supplier, SupplierScore, SupplierEvaluation } from '@/types/supplier';

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'TechFlow Solutions',
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
    contactPerson: 'Michael Rodriguez',
    email: 'm.rodriguez@ecosupply.com',
    phone: '+1-555-0125',
    address: '789 Green Valley Rd, Austin, TX 78701',
    industry: 'Sustainable Materials',
    establishedYear: 2018,
    certifications: ['B Corp', 'FSC', 'Fair Trade'],
    status: 'active',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-06-08')
  },
  {
    id: '4',
    name: 'Precision Components Ltd',
    contactPerson: 'Emma Thompson',
    email: 'e.thompson@precision.com',
    phone: '+1-555-0126',
    address: '321 Manufacturing Dr, Cleveland, OH 44101',
    industry: 'Precision Engineering',
    establishedYear: 2005,
    certifications: ['ISO 9001', 'AS9100'],
    status: 'pending',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-06-01')
  }
];

export const mockScores: SupplierScore[] = [
  // TechFlow Solutions scores
  { id: '1', supplierId: '1', criteriaId: '1', score: 85, comments: 'Excellent product quality', evaluatedBy: 'Alice Johnson', evaluatedAt: new Date('2024-06-01') },
  { id: '2', supplierId: '1', criteriaId: '2', score: 78, comments: 'Competitive pricing', evaluatedBy: 'Alice Johnson', evaluatedAt: new Date('2024-06-01') },
  { id: '3', supplierId: '1', criteriaId: '3', score: 92, comments: 'Always on time', evaluatedBy: 'Alice Johnson', evaluatedAt: new Date('2024-06-01') },
  { id: '4', supplierId: '1', criteriaId: '4', score: 75, comments: 'Good sustainability practices', evaluatedBy: 'Alice Johnson', evaluatedAt: new Date('2024-06-01') },
  { id: '5', supplierId: '1', criteriaId: '5', score: 88, comments: 'Very reliable partner', evaluatedBy: 'Alice Johnson', evaluatedAt: new Date('2024-06-01') },
  
  // Global Manufacturing Corp scores
  { id: '6', supplierId: '2', criteriaId: '1', score: 92, comments: 'Outstanding quality control', evaluatedBy: 'Bob Wilson', evaluatedAt: new Date('2024-06-02') },
  { id: '7', supplierId: '2', criteriaId: '2', score: 82, comments: 'Fair pricing structure', evaluatedBy: 'Bob Wilson', evaluatedAt: new Date('2024-06-02') },
  { id: '8', supplierId: '2', criteriaId: '3', score: 88, comments: 'Good delivery performance', evaluatedBy: 'Bob Wilson', evaluatedAt: new Date('2024-06-02') },
  { id: '9', supplierId: '2', criteriaId: '4', score: 70, comments: 'Working on sustainability', evaluatedBy: 'Bob Wilson', evaluatedAt: new Date('2024-06-02') },
  { id: '10', supplierId: '2', criteriaId: '5', score: 90, comments: 'Highly reliable', evaluatedBy: 'Bob Wilson', evaluatedAt: new Date('2024-06-02') },
  
  // EcoSupply Partners scores
  { id: '11', supplierId: '3', criteriaId: '1', score: 80, comments: 'Good quality, improving', evaluatedBy: 'Carol Davis', evaluatedAt: new Date('2024-06-03') },
  { id: '12', supplierId: '3', criteriaId: '2', score: 85, comments: 'Excellent value proposition', evaluatedBy: 'Carol Davis', evaluatedAt: new Date('2024-06-03') },
  { id: '13', supplierId: '3', criteriaId: '3', score: 75, comments: 'Delivery times acceptable', evaluatedBy: 'Carol Davis', evaluatedAt: new Date('2024-06-03') },
  { id: '14', supplierId: '3', criteriaId: '4', score: 95, comments: 'Exceptional sustainability', evaluatedBy: 'Carol Davis', evaluatedAt: new Date('2024-06-03') },
  { id: '15', supplierId: '3', criteriaId: '5', score: 82, comments: 'Trustworthy partner', evaluatedBy: 'Carol Davis', evaluatedAt: new Date('2024-06-03') },
];
