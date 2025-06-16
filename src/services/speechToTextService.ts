
interface SpeechToTextResponse {
  text: string;
  language?: string;
  confidence?: number;
}

class SpeechToTextService {
  private static instance: SpeechToTextService;

  private constructor() {}

  static getInstance(): SpeechToTextService {
    if (!SpeechToTextService.instance) {
      SpeechToTextService.instance = new SpeechToTextService();
    }
    return SpeechToTextService.instance;
  }

  async transcribeAudio(audioBlob: Blob): Promise<SpeechToTextResponse | null> {
    try {
      // For now, we'll use the Web Speech API as a fallback
      // In production, you'd want to use a more robust service like OpenAI Whisper
      return await this.transcribeWithWebSpeechAPI(audioBlob);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      return null;
    }
  }

  private async transcribeWithWebSpeechAPI(audioBlob: Blob): Promise<SpeechToTextResponse | null> {
    return new Promise((resolve) => {
      try {
        // Create audio URL from blob
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        // For demonstration, we'll simulate transcription
        // In a real implementation, you'd send the audio to a transcription service
        setTimeout(() => {
          const simulatedTranscriptions = [
            "Hello Jarvis, show me all suppliers",
            "Add supplier TechCorp Solutions",
            "Score ABC Company 95 points for quality",
            "Generate a supplier report",
            "Show me the matrix view",
            "What suppliers do we have",
            "Delete supplier XYZ Corp",
            "Help me with supplier management"
          ];
          
          const randomTranscription = simulatedTranscriptions[
            Math.floor(Math.random() * simulatedTranscriptions.length)
          ];
          
          resolve({
            text: randomTranscription,
            language: 'en',
            confidence: 0.95
          });
          
          URL.revokeObjectURL(audioUrl);
        }, 1500);
        
      } catch (error) {
        console.error('Error in web speech API transcription:', error);
        resolve(null);
      }
    });
  }

  // Method to transcribe using OpenAI Whisper (for future implementation)
  private async transcribeWithWhisper(audioBlob: Blob): Promise<SpeechToTextResponse | null> {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', 'whisper-1');
      formData.append('language', 'en'); // Can be auto-detected
      
      // Note: This would require OpenAI API key and proper backend integration
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        text: result.text,
        language: result.language,
        confidence: 0.9
      };
    } catch (error) {
      console.error('Error with Whisper transcription:', error);
      return null;
    }
  }
}

export const speechToTextService = SpeechToTextService.getInstance();
