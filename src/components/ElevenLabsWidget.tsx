
import { useEffect } from 'react';
import { websiteContextService } from '@/services/websiteContextService';

interface ElevenLabsWidgetProps {
  agentId?: string;
}

export const ElevenLabsWidget = ({ agentId = "agent_01jvpkaxcpes7s810qxj9vmphx" }: ElevenLabsWidgetProps) => {
  useEffect(() => {
    // Load the script if not already loaded
    if (!document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      document.head.appendChild(script);
    }

    // Set up message listener for Eleven Labs widget
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === 'elevenlabs-request-context') {
        // Send current website context to the widget
        const context = websiteContextService.generateContextString();
        const widget = document.querySelector('elevenlabs-convai');
        
        if (widget) {
          // Send context to the widget (this would be the actual implementation)
          console.log('Sending context to Eleven Labs widget:', context);
          
          // In a real implementation, you'd send this context to the Eleven Labs API
          // through their appropriate channels or configuration
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    // Update the widget with current context when it changes
    const context = websiteContextService.getContext();
    if (context) {
      console.log('Website context updated for Eleven Labs:', context);
      
      // Here you would send the context to the Eleven Labs agent
      // This could be done through their API or widget configuration
      const widget = document.querySelector('elevenlabs-convai') as any;
      if (widget && widget.updateContext) {
        widget.updateContext(websiteContextService.generateContextString());
      }
    }
  });

  return (
    <div className="elevenlabs-widget-container">
      <elevenlabs-convai agent-id={agentId}></elevenlabs-convai>
    </div>
  );
};
