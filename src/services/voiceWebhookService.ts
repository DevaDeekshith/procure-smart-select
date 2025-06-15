
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

  // Simulate webhook for testing purposes
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
    
    if (lowerText.includes('add') && lowerText.includes('supplier')) return 'add_supplier';
    if (lowerText.includes('edit') && lowerText.includes('supplier')) return 'edit_supplier';
    if (lowerText.includes('delete') && lowerText.includes('supplier')) return 'delete_supplier';
    if (lowerText.includes('score') || lowerText.includes('rate')) return 'score_supplier';
    if (lowerText.includes('report') || lowerText.includes('generate')) return 'generate_report';
    if (lowerText.includes('show') || lowerText.includes('view') || lowerText.includes('open')) return 'navigate';
    
    return 'unknown';
  }

  private extractEntities(text: string): Record<string, any> {
    const entities: Record<string, any> = {};
    
    // Extract supplier names (basic pattern matching)
    const supplierMatch = text.match(/supplier\s+(?:named\s+)?([a-zA-Z\s]+)/i);
    if (supplierMatch) {
      entities.supplierName = supplierMatch[1].trim();
    }

    // Extract scores
    const scoreMatch = text.match(/score\s+(\d+(?:\.\d+)?)/i);
    if (scoreMatch) {
      entities.score = parseFloat(scoreMatch[1]);
    }

    // Extract criteria
    const criteriaKeywords = ['quality', 'price', 'delivery', 'service', 'reliability'];
    for (const criteria of criteriaKeywords) {
      if (text.toLowerCase().includes(criteria)) {
        entities.criteria = criteria;
        break;
      }
    }

    return entities;
  }
}

export const voiceWebhookService = VoiceWebhookService.getInstance();
