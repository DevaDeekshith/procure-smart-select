import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useVoiceAI, VoiceResponse } from '@/hooks/useVoiceAI';
import { voiceWebhookService, WebhookResponse } from '@/services/voiceWebhookService';
import { Mic, MicOff, Volume2, Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react';

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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const recognitionRef = useRef<any>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCount = useRef(0);
  const maxRetries = 3;
  
  const [supportedLanguages] = useState([
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'te', name: 'తెలుగు' }
  ]);

  useEffect(() => {
    // Monitor online status
    const handleOnline = () => {
      setIsOnline(true);
      setError('');
      console.log('Connection restored');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setError('No internet connection');
      console.log('Connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    initializeSpeechRecognition();
    setupWebhookHandler();
    
    return () => {
      cleanup();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleWebhookCommand, onCommand]);

  const initializeSpeechRecognition = () => {
    try {
      // Check if browser supports speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setIsSupported(false);
        setError('Speech recognition not supported in this browser. Try Chrome, Edge, or Safari.');
        return;
      }

      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      
      // Configure with optimized settings for better reliability
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 1;
      
      // Add timeout to prevent hanging
      recognitionInstance.grammars = undefined;
      
      recognitionInstance.onresult = handleSpeechResult;
      recognitionInstance.onerror = handleSpeechError;
      recognitionInstance.onend = handleSpeechEnd;
      recognitionInstance.onstart = handleSpeechStart;
      recognitionInstance.onnomatch = handleNoMatch;
      recognitionInstance.onsoundstart = () => console.log('Sound detected');
      recognitionInstance.onspeechstart = () => console.log('Speech detected');
      
      setRecognition(recognitionInstance);
      recognitionRef.current = recognitionInstance;
      setError('');
      retryCount.current = 0;
    } catch (err) {
      console.error('Error initializing speech recognition:', err);
      setIsSupported(false);
      setError('Failed to initialize speech recognition');
    }
  };

  const handleSpeechResult = (event: any) => {
    try {
      console.log('Speech recognition result:', event);
      
      if (event.results && event.results.length > 0) {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        
        console.log('Transcript:', transcript, 'Confidence:', confidence);
        
        if (transcript && transcript.trim()) {
          setLastCommand(transcript);
          processTranscript(transcript);
          setError('');
          retryCount.current = 0; // Reset retry count on success
        }
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
      'network': 'Network error - trying offline mode',
      'not-allowed': 'Microphone access denied - please allow microphone access',
      'no-speech': 'No speech detected - please try again',
      'aborted': 'Speech recognition was stopped',
      'audio-capture': 'No microphone found - check your audio setup',
      'service-not-allowed': 'Speech service not allowed',
      'bad-grammar': 'Grammar error - trying again',
      'language-not-supported': 'Language not supported - using English'
    };
    
    const errorMessage = errorMessages[event.error] || `Speech error: ${event.error}`;
    setError(errorMessage);
    
    // Handle network errors with fallback
    if (event.error === 'network') {
      if (!isOnline) {
        setError('Offline mode - voice commands will be simulated');
        // Use offline simulation
        handleOfflineMode();
      } else if (retryCount.current < maxRetries) {
        retryCount.current++;
        retryTimeoutRef.current = setTimeout(() => {
          console.log(`Retrying speech recognition (${retryCount.current}/${maxRetries})...`);
          if (!isListening && recognition) {
            startListening();
          }
        }, 2000);
      }
    }
    
    // Auto-retry for certain errors
    if ((event.error === 'no-speech' || event.error === 'aborted') && retryCount.current < maxRetries) {
      retryCount.current++;
      retryTimeoutRef.current = setTimeout(() => {
        if (!isListening && recognition) {
          console.log('Auto-retrying speech recognition...');
          startListening();
        }
      }, 1500);
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

  const handleNoMatch = () => {
    console.log('No speech match found');
    setError('Could not understand speech - please try again');
  };

  const handleOfflineMode = () => {
    // Simulate voice command processing when offline
    const simulatedCommands = [
      "Hello Jarvis, show me all suppliers",
      "Add supplier TechCorp Solutions", 
      "Generate a supplier report"
    ];
    
    const randomCommand = simulatedCommands[Math.floor(Math.random() * simulatedCommands.length)];
    setLastCommand(randomCommand);
    processTranscript(randomCommand);
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
      // Check online status first
      if (!isOnline) {
        setError('Offline - using simulated voice commands');
        handleOfflineMode();
        return;
      }

      // Request microphone permission with better error handling
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        // Stop the stream immediately as we just needed permission
        stream.getTracks().forEach(track => track.stop());
      } catch (permissionError) {
        console.error('Microphone permission error:', permissionError);
        setError('Microphone access required - please allow microphone access');
        return;
      }
      
      console.log('Starting speech recognition...');
      setError('');
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setError('Failed to start voice recognition');
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
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };

  const handleClick = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    
    retryCount.current = 0; // Reset retry count on manual action
    
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
      try {
        recognitionRef.current.abort();
      } catch (error) {
        console.error('Error aborting recognition:', error);
      }
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
      {/* Connection Status */}
      {!isOnline && (
        <Card className="frosted-glass border-0 animate-fade-in max-w-xs">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm font-semibold">Offline Mode</span>
            </div>
            <div className="text-xs text-gray-600">
              Voice commands will be simulated
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Card */}
      {(isListening || isProcessing || error) && (
        <Card className="frosted-glass border-0 animate-fade-in max-w-xs">
          <CardContent className="p-3">
            {error ? (
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <div className="text-sm font-semibold text-red-600">
                  {retryCount.current > 0 ? `Retry ${retryCount.current}/${maxRetries}` : 'Error'}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  isListening ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <div className="text-sm font-semibold text-gray-700">
                  {isListening ? 'Listening...' : 'Processing...'}
                </div>
                {isOnline && <Wifi className="w-3 h-3 text-green-500" />}
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
              error && retryCount.current >= maxRetries
                ? 'bg-red-600 hover:bg-red-700 text-white border-2 border-red-400'
                : !isOnline
                ? 'bg-orange-600 hover:bg-orange-700 text-white border-2 border-orange-400'
                : isListening
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse border-2 border-red-400' 
                : isProcessing
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-400'
                : 'bg-black hover:bg-gray-800 text-white border-2 border-gray-300'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : error && retryCount.current >= maxRetries ? (
              <AlertCircle className="w-6 h-6" />
            ) : !isOnline ? (
              <WifiOff className="w-6 h-6" />
            ) : isListening ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
            
            {isListening && !error && isOnline && (
              <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-30"></div>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="glass-card border-0 max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">
              {error && retryCount.current >= maxRetries
                ? 'Click to retry'
                : !isOnline
                ? 'Offline Mode - Click for Demo'
                : isListening 
                ? 'Listening... Click to Stop' 
                : 'Click to Talk to Jarvis'
              }
            </p>
            <p className="text-xs text-gray-600">
              {error && retryCount.current >= maxRetries 
                ? 'Maximum retries reached'
                : !isOnline
                ? 'No internet connection detected'
                : isListening 
                ? 'Speak your command clearly' 
                : 'Click to start voice recognition'
              }
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
