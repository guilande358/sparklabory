import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProjectCard from "@/components/ProjectCard";
import Navigation from "@/components/Navigation";

const Projects = () => {
  const mockProjects = [
    {
      title: "Plant Growth Experiment",
      description: "Investigating the effects of different light wavelengths on plant photosynthesis rates",
      status: "ongoing" as const,
      members: 4,
      deadline: "May 15",
      category: "Biology",
    },
    {
      title: "Water Quality Analysis",
      description: "Testing local water sources for pH levels, contaminants, and microbial content",
      status: "planning" as const,
      members: 3,
      deadline: "June 1",
      category: "Chemistry",
    },
    {
      title: "Solar Energy Efficiency",
      description: "Comparing different solar panel configurations and their energy output",
      status: "ongoing" as const,
      members: 5,
      deadline: "May 20",
      category: "Physics",
    },
    {
      title: "Earthquake Simulator",
      description: "Building a model to demonstrate seismic waves and structural engineering principles",
      status: "completed" as const,
      members: 4,
      deadline: "Completed",
      category: "Engineering",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            My Projects
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Search and Add */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search projects..." 
              className="pl-10 bg-card"
            />
          </div>
          <Button variant="hero" size="icon" className="shrink-0">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="space-y-4">
          {mockProjects.map((project, index) => (
            <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Projects;
