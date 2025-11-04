import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useGrok = () => {
  const { toast } = useToast();

  const askGrok = async (question: string, context?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('lovable-chat', {
        body: { question, context }
      });

      if (error) throw error;
      return data.answer;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao obter resposta do assistente",
        variant: "destructive",
      });
      return null;
    }
  };

  const generateHypothesis = async (projectTitle: string, category: string, description?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('grok-hypothesis', {
        body: { projectTitle, category, description }
      });

      if (error) throw error;
      return data.hypotheses;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate hypotheses",
        variant: "destructive",
      });
      return null;
    }
  };

  const searchResearch = async (topic: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('grok-research', {
        body: { topic }
      });

      if (error) throw error;
      return data.results;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to search research",
        variant: "destructive",
      });
      return null;
    }
  };

  const generateReport = async (project: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('grok-report', {
        body: { project }
      });

      if (error) throw error;
      return data.report;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate report",
        variant: "destructive",
      });
      return null;
    }
  };

  const getDailySuggestion = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke('grok-suggestion', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;
      return data.suggestion;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to get daily suggestion",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    askGrok,
    generateHypothesis,
    searchResearch,
    generateReport,
    getDailySuggestion,
  };
};
