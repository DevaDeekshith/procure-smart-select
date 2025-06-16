import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { elevenLabsService } from '@/services/elevenLabsService';
import { websiteContextService } from '@/services/websiteContextService';

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
      // Get current website context
      const websiteContext = websiteContextService.generateContextString();
      console.log('Website context:', websiteContext);
      
      let response: VoiceResponse;
      
      // Handle greetings and conversational elements with context awareness
      const lowerText = command.rawText.toLowerCase();
      
      if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
        if (lowerText.includes('jarvis')) {
          const contextSummary = websiteContextService.getContext();
          const supplierCount = contextSummary?.totalSuppliers || 0;
          response = {
            message: `Hello! I'm Jarvis, your AI assistant for supplier management. You currently have ${supplierCount} suppliers in your system. I can help you add, edit, score suppliers, generate reports, or answer questions about your data. What would you like me to do?`
          };
        } else {
          response = {
            message: `Hi there! I'm your supplier management assistant with full access to your current data. How can I help you today?`
          };
        }
      } else if (lowerText.includes('thank') || lowerText.includes('thanks')) {
        response = {
          message: `You're welcome! I'm always here to help with your supplier management needs and I have real-time access to all your supplier data. Is there anything else I can do for you?`
        };
      } else if (lowerText.includes('what can you do') || lowerText.includes('help')) {
        const contextSummary = websiteContextService.getContext();
        const supplierCount = contextSummary?.totalSuppliers || 0;
        response = {
          message: `I have full access to your supplier management system with ${supplierCount} suppliers. I can add, edit, and delete suppliers, assign scores, generate reports, navigate views, answer questions about supplier data, provide analytics, and much more. I'm connected to your real-time data!`
        };
      } else {
        // Use enhanced processing with website context
        const enhancedMessage = await elevenLabsService.processTextWithContext(command.rawText, websiteContext);
        
        // Process specific commands with context awareness
        switch (command.intent) {
          case 'add_supplier':
            const supplierName = command.entities.supplierName || 'new supplier';
            response = {
              message: `I'm adding ${supplierName} to your supplier system. ${enhancedMessage}`,
              action: 'add_supplier',
              data: command.entities
            };
            break;
          
          case 'edit_supplier':
            response = {
              message: `I'm updating the information for ${command.entities.supplierName || command.entities.supplierId}. The changes will be reflected immediately in your system.`,
              action: 'edit_supplier',
              data: command.entities
            };
            break;
          
          case 'delete_supplier':
            response = {
              message: `I'm removing ${command.entities.supplierName || command.entities.supplierId} from your supplier database. This action is irreversible.`,
              action: 'delete_supplier',
              data: command.entities
            };
            break;
          
          case 'score_supplier':
            response = {
              message: `I've assigned a score of ${command.entities.score} points for ${command.entities.criteria} to ${command.entities.supplierName}. Your evaluation matrix has been updated.`,
              action: 'score_supplier',
              data: command.entities
            };
            break;
          
          case 'generate_report':
            const contextSummary = websiteContextService.getContext();
            const reportDetails = contextSummary ? ` for your ${contextSummary.totalSuppliers} suppliers` : '';
            response = {
              message: `I'm generating a ${command.entities.reportType || 'comprehensive supplier'} report${reportDetails}. This will include all current evaluations and rankings from your system.`,
              action: 'generate_report',
              data: command.entities
            };
            break;
          
          case 'navigate':
            response = {
              message: `I'm switching to the ${command.entities.view || command.entities.section} view for you. You should see the updated interface now.`,
              action: 'navigate',
              data: command.entities
            };
            break;
          
          default:
            response = {
              message: enhancedMessage || `I heard "${command.rawText}". I have access to all your supplier data, but I need clarification on what action you'd like me to take. Try asking about your suppliers, their scores, or specific actions like "add supplier" or "generate report".`
            };
        }
      }

      // Speak the response using Eleven Labs with context
      try {
        await elevenLabsService.speakResponseWithContext(response.message, websiteContext, command.language);
      } catch (error) {
        console.error('Error speaking response:', error);
      }

      return response;
    } catch (error) {
      console.error('Error processing voice command:', error);
      const errorResponse = {
        message: 'I apologize, but I encountered an error while processing your request. However, I still have access to all your supplier data. Could you please try again?'
      };
      
      try {
        await elevenLabsService.speakResponseWithContext(errorResponse.message, '', command.language);
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
        title: "Jarvis Assistant",
        description: response.message,
      });

      return response;
    } catch (error) {
      console.error('Error handling webhook command:', error);
      const errorResponse = {
        message: 'I apologize for the technical difficulty. Let me try to help you again.'
      };
      
      toast({
        title: "Jarvis Assistant",
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
        title: "Jarvis Assistant Activated",
        description: "I'm listening and ready to help with your supplier management tasks...",
      });
      
      // Speak activation message
      try {
        await elevenLabsService.speakResponse("Hello! Jarvis is now active and ready to assist you. What would you like me to help you with today?");
      } catch (error) {
        console.error('Error speaking activation message:', error);
      }
    } else {
      toast({
        title: "Jarvis Assistant Deactivated",
        description: "I'm going to sleep now. Call me anytime you need assistance.",
      });
      
      // Speak deactivation message
      try {
        await elevenLabsService.speakResponse("Jarvis is going offline. Have a great day!");
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
