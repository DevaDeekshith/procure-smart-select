export interface ElevenLabsConfig {
  apiKey: string;
  voiceId?: string;
  modelId?: string;
}

export interface TextToSpeechOptions {
  text: string;
  voiceId?: string;
  modelId?: string;
  voiceSettings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

class ElevenLabsService {
  private static instance: ElevenLabsService;
  private config: ElevenLabsConfig;
  private audioContext: AudioContext | null = null;

  private constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || 'sk_87427d8cfff8003c6c1ddd1e268347fcf743a07d4f435e1a',
      voiceId: '9BWtsMINqrJLrRacOk9x', // Aria voice
      modelId: 'eleven_multilingual_v2'
    };
  }

  static getInstance(): ElevenLabsService {
    if (!ElevenLabsService.instance) {
      ElevenLabsService.instance = new ElevenLabsService();
    }
    return ElevenLabsService.instance;
  }

  async synthesizeSpeech(options: TextToSpeechOptions): Promise<void> {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${options.voiceId || this.config.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          text: options.text,
          model_id: options.modelId || this.config.modelId,
          voice_settings: options.voiceSettings || {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      await this.playAudio(audioBuffer);
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      throw error;
    }
  }

  private async playAudio(audioBuffer: ArrayBuffer): Promise<void> {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioData = await this.audioContext.decodeAudioData(audioBuffer);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioData;
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.error('Error playing audio:', error);
      // Fallback to simple audio element
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      await audio.play();
      URL.revokeObjectURL(url);
    }
  }

  async getAvailableVoices(): Promise<any[]> {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': this.config.apiKey,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      return [];
    }
  }

  // Method to speak response messages
  async speakResponse(message: string, language: string = 'en'): Promise<void> {
    console.log('Speaking response:', message);
    
    try {
      await this.synthesizeSpeech({
        text: message,
        voiceSettings: {
          stability: 0.6,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true
        }
      });
    } catch (error) {
      console.error('Error speaking response:', error);
    }
  }

  // Enhanced method to speak response with context awareness
  async speakResponseWithContext(message: string, context?: string, language: string = 'en'): Promise<void> {
    console.log('Speaking response with context:', message);
    
    try {
      // If context is provided, we could potentially modify the response based on it
      let enhancedMessage = message;
      
      if (context) {
        // Add context-aware enhancements to the message
        enhancedMessage = this.enhanceMessageWithContext(message, context);
      }

      await this.synthesizeSpeech({
        text: enhancedMessage,
        voiceSettings: {
          stability: 0.6,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true
        }
      });
    } catch (error) {
      console.error('Error speaking response with context:', error);
    }
  }

  private enhanceMessageWithContext(message: string, context: string): string {
    // Add conversational enhancements based on context
    if (message.includes('supplier') && context.includes('Total Suppliers:')) {
      const supplierCount = context.match(/Total Suppliers: (\d+)/)?.[1];
      if (supplierCount) {
        return message.replace(/suppliers?/g, `suppliers (you currently have ${supplierCount} in total)`);
      }
    }
    
    return message;
  }

  // Method to process speech input with website context
  async processVoiceWithContext(audioBlob: Blob, websiteContext: string): Promise<string> {
    try {
      // First, convert speech to text (this would use a real STT service)
      const transcript = await this.simulateSpeechToText(audioBlob);
      
      // Then process the transcript with context
      const response = await this.processTextWithContext(transcript, websiteContext);
      
      return response;
    } catch (error) {
      console.error('Error processing voice with context:', error);
      return 'I apologize, but I encountered an error processing your voice command.';
    }
  }

  private async simulateSpeechToText(audioBlob: Blob): Promise<string> {
    // Simulate speech-to-text conversion
    // In production, this would call a real STT API
    return new Promise((resolve) => {
      setTimeout(() => {
        const simulatedTranscripts = [
          "How many suppliers do we have?",
          "What's the status of TechCorp?",
          "Show me all active suppliers",
          "Generate a performance report",
          "What are the average scores?",
          "Add a new supplier called Innovation Systems",
          "Score Quality Corp 90 points for delivery"
        ];
        
        const randomTranscript = simulatedTranscripts[Math.floor(Math.random() * simulatedTranscripts.length)];
        resolve(randomTranscript);
      }, 1000);
    });
  }

  private async processTextWithContext(text: string, context: string): Promise<string> {
    const lowerText = text.toLowerCase();
    
    // Parse context for specific data
    const supplierCount = context.match(/Total Suppliers: (\d+)/)?.[1];
    const activeCount = context.match(/Active Suppliers: (\d+)/)?.[1];
    const pendingCount = context.match(/Pending Suppliers: (\d+)/)?.[1];
    
    // Process different types of queries
    if (lowerText.includes('how many') && lowerText.includes('supplier')) {
      return `You currently have ${supplierCount} suppliers in total. ${activeCount} are active, ${pendingCount} are pending review.`;
    }
    
    if (lowerText.includes('status') || lowerText.includes('what') && lowerText.includes('supplier')) {
      const supplierName = this.extractSupplierName(text);
      if (supplierName) {
        const supplierInfo = this.findSupplierInContext(supplierName, context);
        return supplierInfo || `I couldn't find information about ${supplierName} in your current supplier database.`;
      }
    }
    
    if (lowerText.includes('show') || lowerText.includes('list')) {
      if (lowerText.includes('active')) {
        return `Here are your active suppliers. You have ${activeCount} active suppliers. Would you like me to navigate to the supplier list view?`;
      }
      return `I can show you various views of your supplier data. You have options like grid view, matrix view, and analytics dashboard.`;
    }
    
    if (lowerText.includes('report') || lowerText.includes('generate')) {
      return `I can generate comprehensive reports for your ${supplierCount} suppliers. This will include performance metrics, scores, and analytics. Shall I proceed with generating the report?`;
    }
    
    if (lowerText.includes('average') && lowerText.includes('score')) {
      const averageScores = context.match(/AVERAGE SCORES:\n([^]*?)(?=\n\n|\n[A-Z]|$)/)?.[1];
      if (averageScores) {
        return `Here are the current average scores across all suppliers: ${averageScores.replace(/\n/g, ', ')}`;
      }
    }
    
    if (lowerText.includes('add') && lowerText.includes('supplier')) {
      const supplierName = this.extractSupplierName(text);
      return `I'll help you add ${supplierName || 'a new supplier'} to your system. This will create a new supplier entry that you can then score and evaluate.`;
    }
    
    if (lowerText.includes('score') && lowerText.includes('points')) {
      const supplierName = this.extractSupplierName(text);
      const score = text.match(/(\d+)\s*points?/)?.[1];
      return `I'll record a score of ${score} points for ${supplierName || 'the supplier'}. This will update their evaluation metrics in your system.`;
    }
    
    return `I understand you're asking about "${text}". Based on your current supplier management system with ${supplierCount} suppliers, I can help you with adding, editing, scoring suppliers, generating reports, or navigating different views. Could you please be more specific about what you'd like me to do?`;
  }

  private extractSupplierName(text: string): string | null {
    // Try to extract supplier name from various patterns
    const patterns = [
      /(?:status of|about|for|supplier|company)\s+([A-Za-z\s&.-]+?)(?:\s|$)/i,
      /([A-Za-z\s&.-]+?)\s+(?:supplier|company|corp|systems|solutions)/i,
      /add\s+(?:supplier\s+)?([A-Za-z\s&.-]+)/i,
      /score\s+([A-Za-z\s&.-]+?)\s+\d+/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return null;
  }

  private findSupplierInContext(supplierName: string, context: string): string | null {
    const lines = context.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().includes(supplierName.toLowerCase()) && line.includes('Status:')) {
        const statusMatch = line.match(/Status:\s*(\w+)/);
        const industryMatch = line.match(/\(([^)]+)\)/);
        
        if (statusMatch) {
          const status = statusMatch[1];
          const industry = industryMatch?.[1] || 'Unknown industry';
          return `${supplierName} is a ${industry} company with status: ${status}.`;
        }
      }
    }
    return null;
  }
}

export const elevenLabsService = ElevenLabsService.getInstance();
