
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useVoiceAI } from '@/hooks/useVoiceAI';
import { voiceWebhookService } from '@/services/voiceWebhookService';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';

interface VoiceAssistantProps {
  onCommand?: (command: any) => void;
}

export const VoiceAssistant = ({ onCommand }: VoiceAssistantProps) => {
  const { isListening, isProcessing, toggleListening, handleWebhookCommand } = useVoiceAI();
  const [lastCommand, setLastCommand] = useState<string>('');
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
    // Set up webhook handler
    voiceWebhookService.setCommandHandler(async (payload) => {
      const response = await handleWebhookCommand(payload);
      setLastCommand(payload.text);
      
      if (onCommand && response.action) {
        onCommand({
          action: response.action,
          data: response.data
        });
      }

      return response;
    });
  }, [handleWebhookCommand, onCommand]);

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
    <div className="fixed bottom-6 right-6 z-50 space-y-3">
      {/* Language Support Indicator */}
      {isListening && (
        <Card className="frosted-glass border-0 animate-fade-in">
          <CardContent className="p-3">
            <div className="text-xs text-gray-600 mb-2 font-medium">Supported Languages:</div>
            <div className="flex flex-wrap gap-1">
              {supportedLanguages.slice(0, 4).map((lang) => (
                <Badge key={lang.code} variant="secondary" className="text-xs">
                  {lang.name}
                </Badge>
              ))}
            </div>
            {lastCommand && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500">Last: {lastCommand}</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Voice Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleListening}
            disabled={isProcessing}
            className={`w-16 h-16 rounded-full shadow-2xl smooth-transition relative overflow-hidden ${
              isListening 
                ? 'liquid-button text-white animate-pulse hover-glow' 
                : 'frosted-glass border-0 hover-glow'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : isListening ? (
              <Mic className="w-6 h-6 animate-pulse" />
            ) : (
              <MicOff className="w-6 h-6" />
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
        <TooltipContent side="left" className="glass-card border-0">
          <div className="space-y-2">
            <p className="font-medium">
              {isListening ? 'Voice Assistant Active' : 'Activate Voice Assistant'}
            </p>
            <p className="text-xs text-gray-600">
              {isListening 
                ? 'Listening for commands in multiple languages' 
                : 'Click to start voice control'
              }
            </p>
            <div className="pt-1 border-t border-gray-200">
              <p className="text-xs text-blue-600">Try saying:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• "Add supplier [name]"</li>
                <li>• "Score supplier [name]"</li>
                <li>• "Generate report"</li>
                <li>• "Show matrix view"</li>
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
              className="frosted-glass border-0 hover-glow"
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
