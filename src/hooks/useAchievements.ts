import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Achievement = Tables<"achievements">;
type Challenge = Tables<"challenges">;

export const useAchievements = (userId: string | undefined) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const [achievementsRes, challengesRes] = await Promise.all([
          supabase.from("achievements").select("*").eq("user_id", userId).order("earned_at", { ascending: false }),
          supabase.from("challenges").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        ]);

        if (achievementsRes.error) throw achievementsRes.error;
        if (challengesRes.error) throw challengesRes.error;

        setAchievements(achievementsRes.data || []);
        setChallenges(challengesRes.data || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch achievements",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return {
    achievements,
    challenges,
    loading,
  };
};
