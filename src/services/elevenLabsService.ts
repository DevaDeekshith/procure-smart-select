
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
      apiKey: 'sk_87427d8cfff8003c6c1ddd1e268347fcf743a07d4f435e1a',
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
}

export const elevenLabsService = ElevenLabsService.getInstance();
