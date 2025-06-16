
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useVoiceAI, VoiceResponse } from '@/hooks/useVoiceAI';
import { voiceWebhookService, WebhookResponse } from '@/services/voiceWebhookService';
import { Mic, MicOff, Volume2, Loader2, AlertCircle } from 'lucide-react';

interface VoiceAssistantProps {
  onCommand?: (command: any) => void;
}

export const VoiceAssistant = ({ onCommand }: VoiceAssistantProps) => {
  const { isProcessing, handleWebhookCommand } = useVoiceAI();
  const [lastCommand, setLastCommand] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  
  const [supportedLanguages] = useState([
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'te', name: 'తెలుగు' }
  ]);

  useEffect(() => {
    initializeSpeechRecognition();
    setupWebhookHandler();
    
    return () => {
      cleanup();
    };
  }, [handleWebhookCommand, onCommand]);

  const initializeSpeechRecognition = () => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setIsSupported(false);
        setError('Speech recognition not supported in this browser');
        return;
      }

      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      
      // Configure with more reliable settings
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 3;
      
      recognitionInstance.onresult = handleSpeechResult;
      recognitionInstance.onerror = handleSpeechError;
      recognitionInstance.onend = handleSpeechEnd;
      recognitionInstance.onstart = handleSpeechStart;
      
      setRecognition(recognitionInstance);
      recognitionRef.current = recognitionInstance;
      setError('');
    } catch (err) {
      console.error('Error initializing speech recognition:', err);
      setIsSupported(false);
      setError('Failed to initialize speech recognition');
    }
  };

  const handleSpeechResult = (event: any) => {
    try {
      console.log('Speech recognition result:', event);
      
      // Try multiple alternatives for better accuracy
      let transcript = '';
      for (let i = 0; i < event.results[0].length; i++) {
        if (event.results[0][i].confidence > 0.7) {
          transcript = event.results[0][i].transcript;
          break;
        }
      }
      
      if (!transcript && event.results[0].length > 0) {
        transcript = event.results[0][0].transcript;
      }
      
      console.log('Final transcript:', transcript);
      
      if (transcript && transcript.trim()) {
        setLastCommand(transcript);
        processTranscript(transcript);
        setError('');
      }
    } catch (err) {
      console.error('Error processing speech result:', err);
      setError('Error processing speech');
    }
  };

  const handleSpeechError = (event: any) => {
    console.error('Speech recognition error:', event.error);
    setIsListening(false);
    
    const errorMessages: { [key: string]: string } = {
      'network': 'Network error - check your internet connection',
      'not-allowed': 'Microphone access denied - please allow microphone access',
      'no-speech': 'No speech detected - please try again',
      'aborted': 'Speech recognition was aborted',
      'audio-capture': 'No microphone found - check your audio setup',
      'service-not-allowed': 'Speech service not allowed'
    };
    
    setError(errorMessages[event.error] || `Speech error: ${event.error}`);
    
    // Auto-retry for network errors
    if (event.error === 'network' || event.error === 'no-speech') {
      retryTimeoutRef.current = setTimeout(() => {
        if (!isListening && recognition) {
          console.log('Auto-retrying speech recognition...');
          startListening();
        }
      }, 2000);
    }
  };

  const handleSpeechEnd = () => {
    console.log('Speech recognition ended');
    setIsListening(false);
  };

  const handleSpeechStart = () => {
    console.log('Speech recognition started');
    setIsListening(true);
    setError('');
  };

  const setupWebhookHandler = () => {
    voiceWebhookService.setCommandHandler(async (payload): Promise<WebhookResponse> => {
      const response: VoiceResponse = await handleWebhookCommand(payload);
      setLastCommand(payload.text);
      
      if (onCommand && response.action) {
        onCommand({
          action: response.action,
          data: response.data
        });
      }

      return {
        success: true,
        message: response.message,
        action: response.action,
        data: response.data,
        response_text: response.message
      };
    });
  };

  const processTranscript = async (transcript: string) => {
    try {
      console.log('Processing transcript:', transcript);
      await voiceWebhookService.simulateWebhook(transcript, 'en');
    } catch (error) {
      console.error('Error processing transcript:', error);
      setError('Failed to process voice command');
    }
  };

  const startListening = async () => {
    if (!recognition || isProcessing || isListening) {
      return;
    }

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      console.log('Starting speech recognition...');
      setError('');
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setError('Microphone access required');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (!recognition || !isListening) {
      return;
    }

    try {
      console.log('Stopping speech recognition...');
      recognition.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };

  const handleClick = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const testVoiceCommand = async () => {
    const testCommands = [
      "Hello Jarvis, add supplier TechCorp Solutions",
      "Score supplier Quality Corp with 85 points for quality",
      "Generate supplier report",
      "Show matrix view"
    ];
    
    const randomCommand = testCommands[Math.floor(Math.random() * testCommands.length)];
    setLastCommand(randomCommand);
    await voiceWebhookService.simulateWebhook(randomCommand);
  };

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  };

  if (!isSupported) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm">
        <Card className="frosted-glass border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Speech Not Supported</span>
            </div>
            <div className="text-xs text-gray-600">
              Your browser doesn't support speech recognition. Try Chrome, Edge, or Safari.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3">
      {/* Status Card */}
      {(isListening || isProcessing || error) && (
        <Card className="frosted-glass border-0 animate-fade-in max-w-xs">
          <CardContent className="p-3">
            {error ? (
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <div className="text-sm font-semibold text-red-600">Error</div>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  isListening ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <div className="text-sm font-semibold text-gray-700">
                  {isListening ? 'Listening...' : 'Processing...'}
                </div>
              </div>
            )}
            
            <div className="text-xs text-gray-600 mb-2">
              {error || (isListening 
                ? 'Speak clearly and click to stop' 
                : 'Processing your command...'
              )}
            </div>

            {/* Supported Languages */}
            <div className="flex flex-wrap gap-1 mb-2">
              {supportedLanguages.map((lang) => (
                <Badge key={lang.code} variant="secondary" className="text-xs">
                  {lang.name}
                </Badge>
              ))}
            </div>

            {lastCommand && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500">"{lastCommand}"</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Voice Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleClick}
            disabled={isProcessing}
            className={`w-16 h-16 rounded-full shadow-xl transition-all duration-200 relative ${
              error
                ? 'bg-red-600 hover:bg-red-700 text-white border-2 border-red-400'
                : isListening
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse border-2 border-red-400' 
                : isProcessing
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-400'
                : 'bg-black hover:bg-gray-800 text-white border-2 border-gray-300'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : error ? (
              <AlertCircle className="w-6 h-6" />
            ) : isListening ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
            
            {isListening && !error && (
              <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-30"></div>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="glass-card border-0 max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">
              {error 
                ? 'Click to retry'
                : isListening 
                ? 'Listening... Click to Stop' 
                : 'Click to Talk to Jarvis'
              }
            </p>
            <p className="text-xs text-gray-600">
              {error || (isListening 
                ? 'Speak your command clearly' 
                : 'Click to start voice recognition'
              )}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>

      {/* Test Button (Development) */}
      {process.env.NODE_ENV === 'development' && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={testVoiceCommand}
              variant="outline"
              size="sm"
              className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="glass-card border-0">
            <p>Test Voice Command</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
