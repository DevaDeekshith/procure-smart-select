
import { useEffect } from 'react';
import { websiteContextService } from '@/services/websiteContextService';
import { elevenLabsKnowledgeService } from '@/services/elevenLabsKnowledgeService';

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

    // Sync knowledge base immediately when component mounts
    const syncKnowledgeBase = async () => {
      console.log('Auto-syncing ElevenLabs knowledge base...');
      try {
        await elevenLabsKnowledgeService.syncKnowledgeBase();
        console.log('ElevenLabs knowledge base sync completed successfully');
      } catch (error) {
        console.error('Failed to sync ElevenLabs knowledge base:', error);
      }
    };

    // Run sync after a short delay to ensure the component is mounted
    const timer = setTimeout(syncKnowledgeBase, 1000);

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
          console.log('Sending context to Eleven Labs widget:', context);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    // Update the widget with current context when it changes
    const context = websiteContextService.getContext();
    if (context) {
      console.log('Website context updated for Eleven Labs:', context);
      
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
