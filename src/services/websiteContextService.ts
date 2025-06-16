
import { Supplier } from '@/types/supplier';

export interface WebsiteContext {
  suppliers: Supplier[];
  currentView: string;
  totalSuppliers: number;
  activeSuppliers: number;
  pendingSuppliers: number;
  rejectedSuppliers: number;
  averageScores: Record<string, number>;
  recentActivity: string[];
  availableViews: string[];
  evaluationCriteria: string[];
}

class WebsiteContextService {
  private static instance: WebsiteContextService;
  private currentContext: WebsiteContext | null = null;

  private constructor() {}

  static getInstance(): WebsiteContextService {
    if (!WebsiteContextService.instance) {
      WebsiteContextService.instance = new WebsiteContextService();
    }
    return WebsiteContextService.instance;
  }

  updateContext(context: Partial<WebsiteContext>) {
    this.currentContext = {
      ...this.currentContext,
      ...context
    } as WebsiteContext;
  }

  getContext(): WebsiteContext | null {
    return this.currentContext;
  }

  generateContextString(): string {
    if (!this.currentContext) {
      return "No website data available currently.";
    }

    const ctx = this.currentContext;
    
    return `
SUPPLIER MANAGEMENT SYSTEM CONTEXT:

CURRENT STATUS:
- Total Suppliers: ${ctx.totalSuppliers}
- Active Suppliers: ${ctx.activeSuppliers}
- Pending Suppliers: ${ctx.pendingSuppliers}
- Rejected Suppliers: ${ctx.rejectedSuppliers}
- Current View: ${ctx.currentView}

SUPPLIERS LIST:
${ctx.suppliers.map(supplier => `
- ${supplier.name} (${supplier.industry}) - Status: ${supplier.status}
  Contact: ${supplier.contactEmail}
  Phone: ${supplier.contactPhone}
  Address: ${supplier.address}
  Website: ${supplier.website}
  Description: ${supplier.description}
`).join('')}

EVALUATION CRITERIA:
${ctx.evaluationCriteria.join(', ')}

AVERAGE SCORES:
${Object.entries(ctx.averageScores).map(([criteria, score]) => `${criteria}: ${score.toFixed(1)}/10`).join('\n')}

AVAILABLE VIEWS:
${ctx.availableViews.join(', ')}

RECENT ACTIVITY:
${ctx.recentActivity.join('\n')}

SYSTEM CAPABILITIES:
- Add new suppliers with company details
- Edit existing supplier information
- Delete suppliers from the system
- Score suppliers on various criteria (Quality, Price, Delivery, Service, etc.)
- Generate comprehensive reports
- Navigate between different views (Grid, Matrix, Analytics)
- Search and filter suppliers
- Export data and reports

USER INSTRUCTIONS:
Users can ask me to perform actions like "add supplier TechCorp", "score ABC Company 85 points for quality", "generate a report", "show matrix view", etc. I can also answer questions about current suppliers, their scores, status, and provide analytics.
    `.trim();
  }

  formatSupplierData(suppliers: Supplier[]): string {
    return suppliers.map(supplier => {
      const scores = supplier.scores || {};
      const scoreText = Object.entries(scores).length > 0 
        ? `Scores: ${Object.entries(scores).map(([criteria, score]) => `${criteria}: ${score}/10`).join(', ')}`
        : 'No scores assigned yet';
      
      return `${supplier.name}: ${supplier.industry} company, Status: ${supplier.status}, ${scoreText}`;
    }).join('\n');
  }
}

export const websiteContextService = WebsiteContextService.getInstance();
