
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { elevenLabsService } from '@/services/elevenLabsService';

export interface VoiceCommand {
  intent: string;
  language: string;
  entities: Record<string, any>;
  confidence: number;
  rawText: string;
}

export interface VoiceResponse {
  message: string;
  action?: string;
  data?: any;
}

export const useVoiceAI = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processVoiceCommand = useCallback(async (command: VoiceCommand): Promise<VoiceResponse> => {
    console.log('Processing voice command:', command);
    
    try {
      let response: VoiceResponse;
      
      switch (command.intent) {
        case 'add_supplier':
          response = {
            message: `Adding supplier ${command.entities.supplierName || 'new supplier'}...`,
            action: 'add_supplier',
            data: command.entities
          };
          break;
        
        case 'edit_supplier':
          response = {
            message: `Editing supplier ${command.entities.supplierName || command.entities.supplierId}...`,
            action: 'edit_supplier',
            data: command.entities
          };
          break;
        
        case 'delete_supplier':
          response = {
            message: `Deleting supplier ${command.entities.supplierName || command.entities.supplierId}...`,
            action: 'delete_supplier',
            data: command.entities
          };
          break;
        
        case 'score_supplier':
          response = {
            message: `Adding score ${command.entities.score} for ${command.entities.criteria} to supplier ${command.entities.supplierName}...`,
            action: 'score_supplier',
            data: command.entities
          };
          break;
        
        case 'generate_report':
          response = {
            message: `Generating ${command.entities.reportType || 'supplier'} report...`,
            action: 'generate_report',
            data: command.entities
          };
          break;
        
        case 'navigate':
          response = {
            message: `Navigating to ${command.entities.view || command.entities.section}...`,
            action: 'navigate',
            data: command.entities
          };
          break;
        
        default:
          response = {
            message: `I understand you said "${command.rawText}" but I'm not sure how to help with that. Try commands like "add supplier", "score supplier", or "generate report".`
          };
      }

      // Speak the response using Eleven Labs
      try {
        await elevenLabsService.speakResponse(response.message, command.language);
      } catch (error) {
        console.error('Error speaking response:', error);
      }

      return response;
    } catch (error) {
      console.error('Error processing voice command:', error);
      const errorResponse = {
        message: 'Sorry, I encountered an error processing your command. Please try again.'
      };
      
      try {
        await elevenLabsService.speakResponse(errorResponse.message, command.language);
      } catch (speakError) {
        console.error('Error speaking error response:', speakError);
      }
      
      return errorResponse;
    }
  }, []);

  const handleWebhookCommand = useCallback(async (webhookData: any) => {
    setIsProcessing(true);
    
    try {
      const command: VoiceCommand = {
        intent: webhookData.intent || 'unknown',
        language: webhookData.language || 'en',
        entities: webhookData.entities || {},
        confidence: webhookData.confidence || 0.5,
        rawText: webhookData.text || ''
      };

      const response = await processVoiceCommand(command);
      
      toast({
        title: "Voice Command Processed",
        description: response.message,
      });

      return response;
    } catch (error) {
      console.error('Error handling webhook command:', error);
      const errorResponse = {
        message: 'Error processing voice command. Please try again.'
      };
      
      toast({
        title: "Voice Command Error",
        description: errorResponse.message,
        variant: "destructive",
      });

      return errorResponse;
    } finally {
      setIsProcessing(false);
    }
  }, [processVoiceCommand, toast]);

  const toggleListening = useCallback(async () => {
    setIsListening(prev => !prev);
    
    if (!isListening) {
      toast({
        title: "Voice Assistant Activated",
        description: "Listening for voice commands in multiple languages...",
      });
      
      // Speak activation message
      try {
        await elevenLabsService.speakResponse("Voice assistant activated. How can I help you?");
      } catch (error) {
        console.error('Error speaking activation message:', error);
      }
    } else {
      toast({
        title: "Voice Assistant Deactivated",
        description: "Voice commands are now disabled.",
      });
      
      // Speak deactivation message
      try {
        await elevenLabsService.speakResponse("Voice assistant deactivated.");
      } catch (error) {
        console.error('Error speaking deactivation message:', error);
      }
    }
  }, [isListening, toast]);

  return {
    isListening,
    isProcessing,
    toggleListening,
    handleWebhookCommand,
    processVoiceCommand
  };
};
