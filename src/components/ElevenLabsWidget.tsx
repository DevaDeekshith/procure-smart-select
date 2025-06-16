
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Mic, MessageCircle } from 'lucide-react';

interface ElevenLabsWidgetProps {
  agentId?: string;
}

export const ElevenLabsWidget = ({ agentId = "agent_01jvpkaxcpes7s810qxj9vmphx" }: ElevenLabsWidgetProps) => {
  useEffect(() => {
    // Ensure the widget is properly initialized after component mount
    const initWidget = () => {
      const widget = document.querySelector('elevenlabs-convai');
      if (widget) {
        widget.setAttribute('agent-id', agentId);
      }
    };

    // Initialize after a small delay to ensure the script is loaded
    const timeout = setTimeout(initWidget, 1000);
    
    return () => clearTimeout(timeout);
  }, [agentId]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="frosted-glass border-0 p-3 max-w-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="glass-card p-2 rounded-full">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">AI Assistant</h4>
                  <p className="text-xs text-gray-600">Talk to Jarvis</p>
                </div>
              </div>
              
              {/* ElevenLabs Conversational AI Widget */}
              <div className="widget-container">
                <elevenlabs-convai agent-id={agentId}></elevenlabs-convai>
              </div>
              
              <div className="mt-3 text-xs text-gray-500 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Mic className="w-3 h-3" />
                  <span>Voice-enabled AI assistant</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="left" className="glass-card border-0">
          <p>Click to start conversation with Jarvis AI Assistant</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
