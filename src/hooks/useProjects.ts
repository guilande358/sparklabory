import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setProjects([]);
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading projects",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: {
    title: string;
    description: string;
    category: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("projects")
        .insert({
          ...projectData,
          user_id: user.id,
          status: "ongoing",
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project created successfully",
      });

      await loadProjects();
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return {
    projects,
    loading,
    loadProjects,
    createProject,
  };
};
