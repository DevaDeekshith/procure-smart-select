
import { useState, useEffect } from 'react';
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
  const { isListening, isProcessing, toggleListening, handleWebhookCommand } = useVoiceAI();
  const [lastCommand, setLastCommand] = useState<string>('');
  const [isConversing, setIsConversing] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
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
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = async (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        if (event.results[event.results.length - 1].isFinal) {
          console.log('Final transcript:', transcript);
          setLastCommand(transcript);
          
          // Process the command
          const response = await voiceWebhookService.simulateWebhook(transcript);
          
          if (onCommand && response.action) {
            onCommand({
              action: response.action,
              data: response.data
            });
          }
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognitionInstance.onend = () => {
        if (isListening && isConversing) {
          // Restart recognition if still listening
          recognitionInstance.start();
        }
      };

      setRecognition(recognitionInstance);
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
  }, [handleWebhookCommand, onCommand, isListening, isConversing]);

  const handleVoiceToggle = async () => {
    if (!recognition) {
      console.error('Speech recognition not supported');
      return;
    }

    if (isListening) {
      // Stop listening
      setIsConversing(false);
      recognition.stop();
      await toggleListening();
    } else {
      // Start listening
      setIsConversing(true);
      recognition.start();
      await toggleListening();
    }
  };

  // Test function for demonstration
  const testVoiceCommand = async () => {
    const testCommands = [
      "Add supplier TechCorp Solutions",
      "Score supplier Quality Corp with 85 points for quality",
      "Generate supplier report",
      "Show matrix view"
    ];
    
    const randomCommand = testCommands[Math.floor(Math.random() * testCommands.length)];
    await voiceWebhookService.simulateWebhook(randomCommand);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-4">
      {/* Language Support Indicator */}
      {isListening && (
        <Card className="frosted-glass border-0 animate-fade-in w-80">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="text-sm font-semibold text-gray-700">Jarvis Assistant Active</div>
            </div>
            <div className="text-xs text-gray-600 mb-2 font-medium">Listening in Multiple Languages:</div>
            <div className="flex flex-wrap gap-1 mb-3">
              {supportedLanguages.slice(0, 4).map((lang) => (
                <Badge key={lang.code} variant="secondary" className="text-xs">
                  {lang.name}
                </Badge>
              ))}
            </div>
            {lastCommand && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500">You said: "{lastCommand}"</div>
              </div>
            )}
            <div className="mt-3 pt-2 border-t border-gray-200">
              <div className="text-xs text-blue-600 font-medium mb-1">Try saying:</div>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• "Hello Jarvis, add supplier ABC Corp"</li>
                <li>• "Score TechCorp 90 points for quality"</li>
                <li>• "Generate a supplier report"</li>
                <li>• "Show me the matrix view"</li>
                <li>• "What suppliers do we have?"</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Voice Button - Bigger and Black */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleVoiceToggle}
            disabled={isProcessing}
            className={`w-20 h-20 rounded-full shadow-2xl smooth-transition relative overflow-hidden ${
              isListening 
                ? 'bg-black hover:bg-gray-800 text-white animate-pulse hover-glow border-2 border-blue-400' 
                : 'bg-black hover:bg-gray-800 text-white hover-glow border-2 border-gray-300'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : isListening ? (
              <Mic className="w-8 h-8 animate-pulse" />
            ) : (
              <MicOff className="w-8 h-8" />
            )}
            
            {/* Listening animation rings */}
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-30"></div>
                <div className="absolute inset-2 rounded-full border-2 border-blue-300 animate-ping opacity-20 animation-delay-300"></div>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="glass-card border-0 max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">
              {isListening ? 'Jarvis is Listening' : 'Activate Jarvis Assistant'}
            </p>
            <p className="text-xs text-gray-600">
              {isListening 
                ? 'Speak naturally - I can understand multiple languages' 
                : 'Click to start conversing with your AI assistant'
              }
            </p>
            <div className="pt-1 border-t border-gray-200">
              <p className="text-xs text-blue-600 font-medium">Example commands:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• "Hello Jarvis, show me all suppliers"</li>
                <li>• "Add a new supplier called XYZ Corp"</li>
                <li>• "Score ABC Company 95 for delivery"</li>
                <li>• "Generate a performance report"</li>
              </ul>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>

      {/* Test Button (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={testVoiceCommand}
              variant="outline"
              size="sm"
              className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 hover-glow"
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
