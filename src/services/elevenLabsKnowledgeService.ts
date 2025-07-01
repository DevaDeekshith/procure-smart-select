
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const elevenLabsKnowledgeService = {
  async syncKnowledgeBase(): Promise<boolean> {
    try {
      console.log('Syncing knowledge base to ElevenLabs...');
      
      const { data, error } = await supabase.functions.invoke('sync-elevenlabs-knowledge');
      
      if (error) {
        console.error('Error syncing knowledge base:', error);
        toast({
          title: "Sync Error",
          description: "Failed to sync knowledge base with ElevenLabs",
          variant: "destructive"
        });
        return false;
      }

      console.log('Knowledge base sync result:', data);
      
      if (data?.success) {
        toast({
          title: "Knowledge Base Updated",
          description: `Successfully synced ${data.suppliersCount} suppliers to ElevenLabs`,
        });
        return true;
      } else {
        throw new Error(data?.error || 'Unknown sync error');
      }
    } catch (error) {
      console.error('Knowledge base sync error:', error);
      toast({
        title: "Sync Failed",
        description: "Unable to update ElevenLabs knowledge base",
        variant: "destructive"
      });
      return false;
    }
  }
};
