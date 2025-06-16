
export interface WebhookPayload {
  text: string;
  language: string;
  intent: string;
  entities: Record<string, any>;
  confidence: number;
  timestamp: string;
  sessionId?: string;
}

export interface WebhookResponse {
  success: boolean;
  message: string;
  action?: string;
  data?: any;
  response_text?: string;
}

export class VoiceWebhookService {
  private static instance: VoiceWebhookService;
  private webhookEndpoint = '/api/voice-webhook';
  private onCommandReceived?: (payload: WebhookPayload) => Promise<WebhookResponse>;

  private constructor() {}

  static getInstance(): VoiceWebhookService {
    if (!VoiceWebhookService.instance) {
      VoiceWebhookService.instance = new VoiceWebhookService();
    }
    return VoiceWebhookService.instance;
  }

  setCommandHandler(handler: (payload: WebhookPayload) => Promise<WebhookResponse>) {
    this.onCommandReceived = handler;
  }

  async processWebhook(payload: WebhookPayload): Promise<WebhookResponse> {
    console.log('Received voice webhook:', payload);

    if (!this.onCommandReceived) {
      return {
        success: false,
        message: 'No command handler configured',
        response_text: 'Voice assistant is not properly configured.'
      };
    }

    try {
      const response = await this.onCommandReceived(payload);
      return {
        ...response,
        success: true,
        response_text: response.message
      };
    } catch (error) {
      console.error('Error processing webhook:', error);
      return {
        success: false,
        message: 'Error processing voice command',
        response_text: 'Sorry, I encountered an error processing your voice command.'
      };
    }
  }

  // Simulate webhook for testing purposes with enhanced NLP
  async simulateWebhook(text: string, language: string = 'en'): Promise<WebhookResponse> {
    const payload: WebhookPayload = {
      text,
      language,
      intent: this.extractIntent(text),
      entities: this.extractEntities(text),
      confidence: 0.85,
      timestamp: new Date().toISOString(),
      sessionId: `session_${Date.now()}`
    };

    return this.processWebhook(payload);
  }

  private extractIntent(text: string): string {
    const lowerText = text.toLowerCase();
    
    // Conversational patterns
    if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) return 'greeting';
    if (lowerText.includes('thank') || lowerText.includes('thanks')) return 'gratitude';
    if (lowerText.includes('help') || lowerText.includes('what can you do')) return 'help_request';
    
    // Supplier management
    if (lowerText.includes('add') && (lowerText.includes('supplier') || lowerText.includes('company'))) return 'add_supplier';
    if (lowerText.includes('edit') && lowerText.includes('supplier')) return 'edit_supplier';
    if (lowerText.includes('delete') && lowerText.includes('supplier')) return 'delete_supplier';
    if (lowerText.includes('remove') && lowerText.includes('supplier')) return 'delete_supplier';
    
    // Scoring
    if (lowerText.includes('score') || lowerText.includes('rate') || lowerText.includes('points')) return 'score_supplier';
    
    // Reports
    if (lowerText.includes('report') || lowerText.includes('generate')) return 'generate_report';
    
    // Navigation
    if (lowerText.includes('show') || lowerText.includes('view') || lowerText.includes('open') || lowerText.includes('display')) return 'navigate';
    
    return 'unknown';
  }

  private extractEntities(text: string): Record<string, any> {
    const entities: Record<string, any> = {};
    
    // Extract supplier names (enhanced pattern matching)
    const supplierPatterns = [
      /(?:supplier|company)\s+(?:named\s+|called\s+)?([a-zA-Z\s&.-]+)/i,
      /add\s+([a-zA-Z\s&.-]+?)(?:\s+(?:supplier|company))?$/i,
      /(?:for|to)\s+([a-zA-Z\s&.-]+?)(?:\s+(?:supplier|company))?/i
    ];
    
    for (const pattern of supplierPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        entities.supplierName = match[1].trim();
        break;
      }
    }

    // Extract scores with better patterns
    const scorePatterns = [
      /score\s+.*?(\d+(?:\.\d+)?)\s*(?:points?|out)/i,
      /(\d+(?:\.\d+)?)\s*(?:points?|score)/i,
      /rate.*?(\d+(?:\.\d+)?)/i
    ];
    
    for (const pattern of scorePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        entities.score = parseFloat(match[1]);
        break;
      }
    }

    // Extract criteria with expanded list
    const criteriaKeywords = [
      'quality', 'price', 'pricing', 'cost', 'delivery', 'service', 'reliability', 
      'performance', 'communication', 'innovation', 'sustainability', 'compliance'
    ];
    
    for (const criteria of criteriaKeywords) {
      if (text.toLowerCase().includes(criteria)) {
        entities.criteria = criteria;
        break;
      }
    }

    // Extract report types
    const reportTypes = ['supplier', 'performance', 'evaluation', 'summary', 'detailed', 'analytics'];
    for (const type of reportTypes) {
      if (text.toLowerCase().includes(type)) {
        entities.reportType = type;
        break;
      }
    }

    // Extract view types
    const viewTypes = ['matrix', 'grid', 'list', 'dashboard', 'analytics', 'table'];
    for (const view of viewTypes) {
      if (text.toLowerCase().includes(view)) {
        entities.view = view;
        break;
      }
    }

    return entities;
  }
}

export const voiceWebhookService = VoiceWebhookService.getInstance();
