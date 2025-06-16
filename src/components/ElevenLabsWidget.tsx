
import { useEffect } from 'react';

interface ElevenLabsWidgetProps {
  agentId?: string;
}

export const ElevenLabsWidget = ({ agentId = "agent_01jvpkaxcpes7s810qxj9vmphx" }: ElevenLabsWidgetProps) => {
  useEffect(() => {
    // Load the script dynamically if not already loaded
    if (!document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="fixed top-20 right-6 z-50">
      <div className="liquid-glass p-3 rounded-xl shadow-lg hover-glow smooth-transition">
        <elevenlabs-convai agent-id={agentId}></elevenlabs-convai>
      </div>
    </div>
  );
};
