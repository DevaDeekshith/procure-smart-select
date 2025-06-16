import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useVoiceAI, VoiceResponse } from '@/hooks/useVoiceAI';
import { voiceWebhookService, WebhookResponse } from '@/services/voiceWebhookService';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';

interface VoiceAssistantProps {
  onCommand?: (command: any) => void;
}

export const VoiceAssistant = ({ onCommand }: VoiceAssistantProps) => {
  const { isProcessing, handleWebhookCommand } = useVoiceAI();
  const [lastCommand, setLastCommand] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const [supportedLanguages] = useState([
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'mr', name: 'मराठी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'gu', name: 'ગુજરાતી' }
  ]);

  useEffect(() => {
    // Check if Speech Recognition is supported with proper type casting
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      
      // Configure speech recognition
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 1;
      
      // Handle results
      recognitionInstance.onresult = (event: any) => {
        console.log('Speech recognition result:', event);
        const transcript = event.results[0][0].transcript;
        console.log('Transcript:', transcript);
        
        if (transcript && transcript.trim()) {
          setLastCommand(transcript);
          processTranscript(transcript);
        }
      };
      
      // Handle errors
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      // Handle end
      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };
      
      // Handle start
      recognitionInstance.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };
      
      setRecognition(recognitionInstance);
      recognitionRef.current = recognitionInstance;
    } else {
      console.warn('Speech Recognition not supported in this browser');
      setIsSupported(false);
    }

    // Set up webhook handler
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

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [handleWebhookCommand, onCommand]);

  const processTranscript = async (transcript: string) => {
    try {
      console.log('Processing transcript:', transcript);
      await voiceWebhookService.simulateWebhook(transcript, 'en');
    } catch (error) {
      console.error('Error processing transcript:', error);
    }
  };

  const startListening = () => {
    if (!recognition || isProcessing || isListening) {
      console.log('Cannot start listening:', { 
        hasRecognition: !!recognition, 
        isProcessing, 
        isListening 
      });
      return;
    }

    try {
      console.log('Starting speech recognition...');
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
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

  if (!isSupported) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="frosted-glass border-0 w-80">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-sm font-semibold text-red-600 mb-2">
                Speech Recognition Not Supported
              </div>
              <div className="text-xs text-gray-600">
                Your browser doesn't support speech recognition. Please try Chrome, Edge, or Safari.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-4">
      {(isListening || isProcessing) && (
        <Card className="frosted-glass border-0 animate-fade-in w-80">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                isListening ? 'bg-red-500' : 'bg-blue-500'
              }`}></div>
              <div className="text-sm font-semibold text-gray-700">
                {isListening ? 'Jarvis is Listening...' : 'Processing Your Request...'}
              </div>
            </div>
            
            {isListening && (
              <div className="text-xs text-gray-600 mb-2">
                Speak clearly. Click the button again to stop listening.
              </div>
            )}

            {isProcessing && (
              <div className="text-xs text-gray-600 mb-2">
                Processing your voice command...
              </div>
            )}

            <div className="text-xs text-gray-600 mb-2 font-medium">Supported Languages:</div>
            <div className="flex flex-wrap gap-1 mb-3">
              {supportedLanguages.slice(0, 4).map((lang) => (
                <Badge key={lang.code} variant="secondary" className="text-xs">
                  {lang.name}
                </Badge>
              ))}
            </div>

            {lastCommand && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500">Last command: "{lastCommand}"</div>
              </div>
            )}

            <div className="mt-3 pt-2 border-t border-gray-200">
              <div className="text-xs text-blue-600 font-medium mb-1">Try saying:</div>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• "Hello Jarvis, add supplier ABC Corp"</li>
                <li>• "Score TechCorp 90 points for quality"</li>
                <li>• "Generate a supplier report"</li>
                <li>• "Show me the matrix view"</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleClick}
            disabled={isProcessing}
            className={`w-20 h-20 rounded-full shadow-2xl transition-all duration-200 relative overflow-hidden ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse border-2 border-red-400' 
                : isProcessing
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-400'
                : 'bg-black hover:bg-gray-800 text-white border-2 border-gray-300'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : isListening ? (
              <Mic className="w-8 h-8" />
            ) : (
              <MicOff className="w-8 h-8" />
            )}
            
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-30"></div>
                <div className="absolute inset-2 rounded-full border-2 border-red-300 animate-ping opacity-20"></div>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="glass-card border-0 max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">
              {isListening ? 'Listening... Click to Stop' : 'Click to Talk to Jarvis'}
            </p>
            <p className="text-xs text-gray-600">
              {isListening 
                ? 'Speak your command clearly' 
                : 'Click to start voice recognition'
              }
            </p>
            <div className="pt-1 border-t border-gray-200">
              <p className="text-xs text-blue-600 font-medium">Instructions:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Click button to start listening</li>
                <li>• Speak your command clearly</li>
                <li>• Click again to stop and process</li>
                <li>• Wait for Jarvis to respond</li>
              </ul>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>

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
