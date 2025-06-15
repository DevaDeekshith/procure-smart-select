
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

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
      switch (command.intent) {
        case 'add_supplier':
          return {
            message: `Adding supplier ${command.entities.supplierName || 'new supplier'}...`,
            action: 'add_supplier',
            data: command.entities
          };
        
        case 'edit_supplier':
          return {
            message: `Editing supplier ${command.entities.supplierName || command.entities.supplierId}...`,
            action: 'edit_supplier',
            data: command.entities
          };
        
        case 'delete_supplier':
          return {
            message: `Deleting supplier ${command.entities.supplierName || command.entities.supplierId}...`,
            action: 'delete_supplier',
            data: command.entities
          };
        
        case 'score_supplier':
          return {
            message: `Adding score ${command.entities.score} for ${command.entities.criteria} to supplier ${command.entities.supplierName}...`,
            action: 'score_supplier',
            data: command.entities
          };
        
        case 'generate_report':
          return {
            message: `Generating ${command.entities.reportType || 'supplier'} report...`,
            action: 'generate_report',
            data: command.entities
          };
        
        case 'navigate':
          return {
            message: `Navigating to ${command.entities.view || command.entities.section}...`,
            action: 'navigate',
            data: command.entities
          };
        
        default:
          return {
            message: `I understand you said "${command.rawText}" but I'm not sure how to help with that. Try commands like "add supplier", "score supplier", or "generate report".`
          };
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      return {
        message: 'Sorry, I encountered an error processing your command. Please try again.'
      };
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

  const toggleListening = useCallback(() => {
    setIsListening(prev => !prev);
    
    if (!isListening) {
      toast({
        title: "Voice Assistant Activated",
        description: "Listening for voice commands in multiple languages...",
      });
    } else {
      toast({
        title: "Voice Assistant Deactivated",
        description: "Voice commands are now disabled.",
      });
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
