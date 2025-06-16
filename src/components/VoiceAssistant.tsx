
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useVoiceAI, VoiceResponse } from '@/hooks/useVoiceAI';
import { voiceWebhookService, WebhookResponse } from '@/services/voiceWebhookService';
import { speechToTextService } from '@/services/speechToTextService';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';

interface VoiceAssistantProps {
  onCommand?: (command: any) => void;
}

export const VoiceAssistant = ({ onCommand }: VoiceAssistantProps) => {
  const { isProcessing, handleWebhookCommand } = useVoiceAI();
  const [lastCommand, setLastCommand] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isRecordingRef = useRef(false);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
    const initializeMediaRecorder = async () => {
      try {
        console.log('Requesting microphone access...');
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 44100
          } 
        });
        
        setStream(mediaStream);
        
        // Try different MIME types for better compatibility
        let mimeType = 'audio/webm;codecs=opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/webm';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'audio/mp4';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
              mimeType = '';
            }
          }
        }
        
        const recorder = new MediaRecorder(mediaStream, {
          mimeType: mimeType || undefined
        });
        
        recorder.ondataavailable = (event) => {
          console.log('Audio data available:', event.data.size);
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          console.log('MediaRecorder stopped, processing audio...');
          processRecordedAudio();
        };

        recorder.onstart = () => {
          console.log('MediaRecorder started');
          audioChunksRef.current = [];
        };

        recorder.onerror = (event) => {
          console.error('MediaRecorder error:', event);
        };

        setMediaRecorder(recorder);
        console.log('MediaRecorder initialized successfully with mimeType:', mimeType);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    initializeMediaRecorder();

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
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [handleWebhookCommand, onCommand]);

  const processRecordedAudio = async () => {
    console.log('Processing recorded audio, chunks:', audioChunksRef.current.length);
    
    if (audioChunksRef.current.length === 0) {
      console.log('No audio chunks to process');
      return;
    }

    try {
      const audioBlob = new Blob(audioChunksRef.current, { 
        type: audioChunksRef.current[0]?.type || 'audio/webm'
      });
      console.log('Audio blob created:', audioBlob.size, 'bytes', 'type:', audioBlob.type);

      if (audioBlob.size === 0) {
        console.log('Audio blob is empty');
        return;
      }

      const transcriptionResult = await speechToTextService.transcribeAudio(audioBlob);
      
      if (transcriptionResult && transcriptionResult.text) {
        console.log('Transcribed text:', transcriptionResult.text);
        setLastCommand(transcriptionResult.text);
        
        await voiceWebhookService.simulateWebhook(transcriptionResult.text, transcriptionResult.language || 'en');
      } else {
        console.log('No transcription result');
      }

      audioChunksRef.current = [];
    } catch (error) {
      console.error('Error processing recorded audio:', error);
    }
  };

  const startRecording = () => {
    if (!mediaRecorder || isProcessing || isRecordingRef.current) {
      console.log('Cannot start recording:', { 
        hasRecorder: !!mediaRecorder, 
        isProcessing, 
        isAlreadyRecording: isRecordingRef.current 
      });
      return;
    }

    console.log('Starting recording...');
    setIsRecording(true);
    isRecordingRef.current = true;
    audioChunksRef.current = [];
    
    try {
      if (mediaRecorder.state === 'inactive') {
        // Start recording with time slices for better data collection
        mediaRecorder.start(250); // Collect data every 250ms
        console.log('MediaRecorder started with state:', mediaRecorder.state);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      isRecordingRef.current = false;
      return;
    }

    // Set maximum recording time
    recordingTimeoutRef.current = setTimeout(() => {
      console.log('Recording timeout reached');
      stopRecording();
    }, 10000); // Maximum 10 seconds
  };

  const stopRecording = () => {
    if (!mediaRecorder || !isRecordingRef.current) {
      console.log('Cannot stop recording:', { 
        hasRecorder: !!mediaRecorder, 
        isRecording: isRecordingRef.current 
      });
      return;
    }

    console.log('Stopping recording...');
    setIsRecording(false);
    isRecordingRef.current = false;

    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }

    try {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        console.log('MediaRecorder stopped, state:', mediaRecorder.state);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startRecording();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    stopRecording();
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRecordingRef.current) {
      stopRecording();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startRecording();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    stopRecording();
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

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-4">
      {(isRecording || isProcessing) && (
        <Card className="frosted-glass border-0 animate-fade-in w-80">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                isRecording ? 'bg-red-500' : 'bg-blue-500'
              }`}></div>
              <div className="text-sm font-semibold text-gray-700">
                {isRecording ? 'Jarvis is Listening...' : 'Processing Your Request...'}
              </div>
            </div>
            
            {isRecording && (
              <div className="text-xs text-gray-600 mb-2">
                Hold the button and speak clearly. Release when done.
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
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            disabled={isProcessing}
            style={{ 
              userSelect: 'none', 
              touchAction: 'none',
              WebkitUserSelect: 'none'
            }}
            className={`w-20 h-20 rounded-full shadow-2xl smooth-transition relative overflow-hidden select-none cursor-pointer touch-none ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse hover-glow border-2 border-red-400' 
                : isProcessing
                ? 'bg-blue-600 hover:bg-blue-700 text-white hover-glow border-2 border-blue-400'
                : 'bg-black hover:bg-gray-800 text-white hover-glow border-2 border-gray-300'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : isRecording ? (
              <Mic className="w-8 h-8 animate-pulse" />
            ) : (
              <MicOff className="w-8 h-8" />
            )}
            
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-30"></div>
                <div className="absolute inset-2 rounded-full border-2 border-red-300 animate-ping opacity-20 animation-delay-300"></div>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="glass-card border-0 max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">
              {isRecording ? 'Recording... Release to Send' : 'Hold to Talk to Jarvis'}
            </p>
            <p className="text-xs text-gray-600">
              {isRecording 
                ? 'Speak clearly and release when done' 
                : 'Press and hold to record your voice command'
              }
            </p>
            <div className="pt-1 border-t border-gray-200">
              <p className="text-xs text-blue-600 font-medium">Instructions:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Hold button down to start recording</li>
                <li>• Speak your command clearly</li>
                <li>• Release button to send to Jarvis</li>
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
