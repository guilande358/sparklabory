import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Beaker, Microscope, Atom, Dna, TestTube, Brain, ArrowLeft, Layers, Box } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import FloatingAssistant from "@/components/FloatingAssistant";
import Simulation3D from "@/components/lab/Simulation3D";
import Simulation2D from "@/components/lab/Simulation2D";
import ExternalSimulatorConfig from "@/components/lab/ExternalSimulatorConfig";
import virtualLabImage from "@/assets/virtual-lab.jpg";

const VirtualLab = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("project");
  const [viewMode, setViewMode] = useState<"list" | "3d" | "2d">(projectId ? "3d" : "list");
  const [externalConfig, setExternalConfig] = useState<any>(null);

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

  if (viewMode === "list") {
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
                    onClick={() => setViewMode("3d")}
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
        <FloatingAssistant context="Laboratório Virtual - Lista de Experimentos" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setViewMode("list")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent flex-1">
            Interactive Simulation Lab
          </h1>
          <ExternalSimulatorConfig onConnect={setExternalConfig} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Panel */}
          <Card className="lg:col-span-1 p-6 h-fit space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Simulation Mode</h3>
              <div className="flex flex-col gap-2">
                <Button
                  variant={viewMode === "2d" ? "default" : "outline"}
                  onClick={() => setViewMode("2d")}
                  className="justify-start"
                >
                  <Layers className="w-4 h-4 mr-2" />
                  2D Simulation
                </Button>
                <Button
                  variant={viewMode === "3d" ? "default" : "outline"}
                  onClick={() => setViewMode("3d")}
                  className="justify-start"
                >
                  <Box className="w-4 h-4 mr-2" />
                  3D Simulation
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Project Properties</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">Chemical Reaction Sim</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge variant="secondary">Running</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">{viewMode === "3d" ? "3D Interactive" : "2D Particle System"}</p>
                </div>
              </div>
            </div>

            {externalConfig && (
              <div>
                <h3 className="font-bold text-lg mb-2">External Simulator</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{externalConfig.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">URL</p>
                    <p className="font-medium text-xs truncate">{externalConfig.url}</p>
                  </div>
                  <Badge className="bg-secondary">Connected</Badge>
                </div>
              </div>
            )}

            <div>
              <h3 className="font-bold text-lg mb-2">Instructions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Click and drag to rotate</li>
                <li>• Scroll to zoom in/out</li>
                <li>• Use controls to adjust parameters</li>
                <li>• Connect external simulators for advanced features</li>
              </ul>
            </div>
          </Card>

          {/* Main Simulation Area */}
          <div className="lg:col-span-3">
            <Card className="p-6 h-[calc(100vh-12rem)]">
              {viewMode === "3d" ? (
                <Simulation3D />
              ) : (
                <Simulation2D />
              )}
            </Card>
          </div>
        </div>
      </main>

      <Navigation />
      <FloatingAssistant context={`Laboratório Virtual - Simulação ${viewMode.toUpperCase()} - O usuário está trabalhando com uma simulação interativa`} />
    </div>
  );
};

export default VirtualLab;
