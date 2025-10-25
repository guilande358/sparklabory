import { Beaker, Microscope, Atom, Dna, TestTube, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import virtualLabImage from "@/assets/virtual-lab.jpg";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const VirtualLab = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);
  const experiments = [
    {
      icon: Beaker,
      title: "Chemical Reactions",
      description: "Mix virtual chemicals and observe reactions in real-time",
      difficulty: "Intermediate",
      color: "text-accent",
    },
    {
      icon: Microscope,
      title: "Cell Biology",
      description: "Explore cellular structures and their functions",
      difficulty: "Beginner",
      color: "text-primary",
    },
    {
      icon: Atom,
      title: "Atomic Structure",
      description: "Visualize atoms, electrons, and quantum mechanics",
      difficulty: "Advanced",
      color: "text-secondary",
    },
    {
      icon: Dna,
      title: "DNA Sequencing",
      description: "Learn about genetic codes and protein synthesis",
      difficulty: "Intermediate",
      color: "text-primary",
    },
    {
      icon: TestTube,
      title: "Titration Experiment",
      description: "Master acid-base titration techniques",
      difficulty: "Beginner",
      color: "text-accent",
    },
    {
      icon: Brain,
      title: "Neural Networks",
      description: "Understand how neurons communicate and process information",
      difficulty: "Advanced",
      color: "text-secondary",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Virtual Laboratory
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Hero Image */}
        <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
          <img 
            src={virtualLabImage} 
            alt="Virtual Laboratory" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-xl font-bold text-card-foreground mb-1">
              Explore Science Safely
            </h2>
            <p className="text-sm text-muted-foreground">
              Conduct experiments without the mess or danger
            </p>
          </div>
        </div>

        {/* Experiments Grid */}
        <div>
          <h3 className="text-lg font-bold mb-4">Available Experiments</h3>
          <div className="grid grid-cols-1 gap-4">
            {experiments.map((experiment, index) => {
              const Icon = experiment.icon;
              return (
                <Card 
                  key={index}
                  className="p-5 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-primary/20">
                      <Icon className={`w-6 h-6 ${experiment.color}`} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-card-foreground">{experiment.title}</h4>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {experiment.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {experiment.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default VirtualLab;
