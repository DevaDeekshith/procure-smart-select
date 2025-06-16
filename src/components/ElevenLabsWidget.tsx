
import { useEffect } from 'react';

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
    <div className="fixed top-20 right-6 z-50">
      <div className="liquid-glass p-2 rounded-xl shadow-lg hover-glow smooth-transition">
        {/* ElevenLabs Conversational AI Widget */}
        <div className="widget-container overflow-hidden rounded-lg">
          <elevenlabs-convai agent-id={agentId}></elevenlabs-convai>
        </div>
      </div>
    </div>
  );
};
