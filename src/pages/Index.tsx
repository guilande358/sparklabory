import { FlaskConical, FolderKanban, Users, BookOpen, Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import FeatureCard from "@/components/FeatureCard";
import Navigation from "@/components/Navigation";
import heroImage from "@/assets/hero-science.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FolderKanban,
      title: "Project Management",
      description: "Track your scientific research projects step-by-step using the scientific method",
      gradient: "primary" as const,
      onClick: () => navigate("/projects"),
    },
    {
      icon: FlaskConical,
      title: "Virtual Laboratory",
      description: "Conduct safe experiments with realistic simulations in physics, chemistry, and biology",
      gradient: "secondary" as const,
      onClick: () => navigate("/lab"),
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Work together with classmates and teachers on group projects and research",
      gradient: "accent" as const,
      onClick: () => {},
    },
    {
      icon: BookOpen,
      title: "Research Tools",
      description: "Access academic databases, generate citations, and create professional reports",
      gradient: "primary" as const,
      onClick: () => {},
    },
    {
      icon: Trophy,
      title: "Gamification",
      description: "Earn points, badges, and compete in weekly science challenges",
      gradient: "secondary" as const,
      onClick: () => navigate("/achievements"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      {/* Hero Section */}
      <section className="relative h-64 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Science Education Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/60 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="animate-float">
            <Sparkles className="w-12 h-12 text-primary-foreground mb-4 animate-pulse-glow" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-3 drop-shadow-lg">
            ScienceHub
          </h1>
          <p className="text-sm text-primary-foreground/90 max-w-md drop-shadow-md">
            Your complete platform for scientific research and learning
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="max-w-md mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-xl p-4 shadow-md text-center">
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-xs text-muted-foreground">Projects</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-md text-center">
            <p className="text-2xl font-bold text-secondary">28</p>
            <p className="text-xs text-muted-foreground">Experiments</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-md text-center">
            <p className="text-2xl font-bold text-accent">2.4K</p>
            <p className="text-xs text-muted-foreground">Points</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-md mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">Explore Features</h2>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>
        
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-md mx-auto px-4 py-6">
        <div className="bg-gradient-primary rounded-2xl p-6 text-center shadow-lg">
          <h3 className="text-xl font-bold text-primary-foreground mb-2">
            Start Your Next Discovery
          </h3>
          <p className="text-sm text-primary-foreground/90 mb-4">
            Begin a new research project or experiment today
          </p>
          <Button variant="secondary" size="lg" className="shadow-md">
            Create New Project
          </Button>
        </div>
      </section>

      <Navigation />
    </div>
  );
};

export default Index;
