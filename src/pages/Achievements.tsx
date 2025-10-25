import { Trophy, Star, Award, Zap, Target, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAchievements } from "@/hooks/useAchievements";
import { useProjects } from "@/hooks/useProjects";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Achievements = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { achievements, challenges, loading } = useAchievements(user?.id);
  const { projects } = useProjects(user?.id);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const totalPoints = achievements.reduce((sum, ach) => sum + (ach.points || 0), 0);
  const stats = [
    { label: "Total Points", value: totalPoints.toString(), icon: Star, color: "text-accent" },
    { label: "Projects Completed", value: projects.filter(p => p.status === "completed").length.toString(), icon: Target, color: "text-secondary" },
    { label: "Experiments Done", value: "0", icon: Zap, color: "text-primary" },
  ];

  const badges = [
    {
      icon: Trophy,
      title: "Science Champion",
      description: "Complete 10 projects",
      earned: true,
      color: "bg-gradient-accent",
    },
    {
      icon: Award,
      title: "Lab Expert",
      description: "Finish 25 virtual experiments",
      earned: true,
      color: "bg-gradient-secondary",
    },
    {
      icon: Crown,
      title: "Top Researcher",
      description: "Rank in top 10 this month",
      earned: false,
      color: "bg-gradient-primary",
    },
    {
      icon: Star,
      title: "Perfect Score",
      description: "Get 100% on 5 quizzes",
      earned: false,
      color: "bg-gradient-accent",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Achievements
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index}
                className="p-4 text-center space-y-2 hover:shadow-md transition-all animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className={`w-6 h-6 mx-auto ${stat.color}`} />
                <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Badges Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">My Badges</h2>
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <Card 
                  key={index}
                  className={`p-5 text-center space-y-3 transition-all animate-slide-up ${
                    badge.earned ? "hover:scale-105" : "opacity-50"
                  }`}
                  style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                >
                  <div className={`w-16 h-16 mx-auto rounded-full ${badge.color} flex items-center justify-center shadow-glow`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">{badge.title}</h3>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                  {badge.earned && (
                    <Badge className="bg-secondary text-secondary-foreground">
                      Earned
                    </Badge>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Active Challenges */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Active Challenges</h2>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading challenges...</p>
          ) : challenges.length > 0 ? (
            challenges.map((challenge, index) => (
              <Card 
                key={challenge.id}
                className="p-5 space-y-3 hover:shadow-md transition-all animate-slide-up"
                style={{ animationDelay: `${(index + 7) * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-card-foreground mb-1">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {challenge.reward_points} pts
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{Math.round(((challenge.progress || 0) / challenge.target) * 100)}%</span>
                  </div>
                  <Progress value={((challenge.progress || 0) / challenge.target) * 100} className="h-2" />
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No active challenges</p>
          )}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Achievements;
