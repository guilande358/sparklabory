import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;

export const useProjects = (userId: string | undefined) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const createProject = async (projectData: {
    title: string;
    category: string;
    description?: string;
    deadline?: string;
  }) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from("projects")
        .insert([{ ...projectData, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      
      fetchProjects();
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", projectId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update project",
        variant: "destructive",
      });
    }
  };

  return {
    projects,
    loading,
    createProject,
    updateProject,
    refetch: fetchProjects,
  };
};
