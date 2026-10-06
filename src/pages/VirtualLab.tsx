import { useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Beaker, Microscope, Atom, Dna, TestTube, Brain, ArrowLeft, Box, PenTool } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import FloatingAssistant from "@/components/FloatingAssistant";
import Simulation3D from "@/components/lab/Simulation3D";
import Designer2D from "@/components/lab/Designer2D";
import ExternalSimulatorConfig from "@/components/lab/ExternalSimulatorConfig";
import virtualLabImage from "@/assets/virtual-lab.jpg";
import { DiagramNode, DiagramEdge } from "@/lib/diagramTypes";

type ViewMode = "list" | "designer";

const VirtualLab = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("project");
  const [viewMode, setViewMode] = useState<ViewMode>(projectId ? "designer" : "list");
  const [externalConfig, setExternalConfig] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"designer" | "preview">("designer");

  // Chave de persistência isolada por projeto ou rascunho global
  const storageKey = projectId ? `lab_design_${projectId}` : "lab_design_draft";

  // Carrega estado inicial do localStorage
  const [designData, setDesignData] = useState<{ nodes: DiagramNode[]; edges: DiagramEdge[] }>(() => {
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          nodes: parsed.nodes || [],
          edges: parsed.edges || [],
        };
      }
    } catch (e) {
      console.error("Erro ao carregar design do localStorage:", e);
    }
    return { nodes: [], edges: [] };
  });

  // Salva automaticamente no localStorage sempre que o diagrama 2D mudar
  const handleDesignChange = useCallback(
    (nodes: DiagramNode[], edges: DiagramEdge[]) => {
      setDesignData({ nodes, edges });
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ nodes, edges, updatedAt: new Date().toISOString() })
        );
      } catch (e) {
        console.error("Erro ao persistir design:", e);
      }
    },
    [storageKey]
  );

  const handleRunSimulation = useCallback(
    (nodes: DiagramNode[], edges: DiagramEdge[]) => {
      handleDesignChange(nodes, edges);
      setActiveTab("preview");
    },
    [handleDesignChange]
  );

  const handleBackToDesigner = useCallback(() => {
    setActiveTab("designer");
  }, []);

  const experiments = [
    {
      icon: Beaker,
      title: "Reações Químicas",
      description: "Misture substâncias virtuais e observe reações em tempo real",
      difficulty: "Intermediário",
      color: "text-accent",
    },
    {
      icon: Microscope,
      title: "Biologia Celular",
      description: "Explore estruturas celulares e suas funções",
      difficulty: "Iniciante",
      color: "text-primary",
    },
    {
      icon: Atom,
      title: "Estrutura Atômica",
      description: "Visualize átomos, elétrons e mecânica quântica",
      difficulty: "Avançado",
      color: "text-secondary",
    },
    {
      icon: Dna,
      title: "Sequenciamento de DNA",
      description: "Aprenda sobre códigos genéticos e síntese de proteínas",
      difficulty: "Intermediário",
      color: "text-primary",
    },
    {
      icon: TestTube,
      title: "Experimento de Titulação",
      description: "Domine técnicas de titulação ácido-base",
      difficulty: "Iniciante",
      color: "text-accent",
    },
    {
      icon: Brain,
      title: "Redes Neurais",
      description: "Entenda como neurônios comunicam e processam informação",
      difficulty: "Avançado",
      color: "text-secondary",
    },
  ];

  if (viewMode === "list") {
    return (
      <div className="min-h-screen bg-gradient-hero pb-20">
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
          <div className="max-w-md mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Laboratório Virtual
            </h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6 space-y-6">
          <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={virtualLabImage} 
              alt="Virtual Laboratory" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-xl font-bold text-card-foreground mb-1">
                Explore Ciência com Segurança
              </h2>
              <p className="text-sm text-muted-foreground">
                Conduza experimentos sem bagunça ou perigo
              </p>
            </div>
          </div>

          <Button 
            className="w-full gap-2" 
            size="lg"
            onClick={() => setViewMode("designer")}
          >
            <PenTool className="w-5 h-5" />
            Criar Novo Projeto
          </Button>

          <div>
            <h3 className="text-lg font-bold mb-4">Experimentos Disponíveis</h3>
            <div className="grid grid-cols-1 gap-4">
              {experiments.map((experiment, index) => {
                const Icon = experiment.icon;
                return (
                  <Card 
                    key={index}
                    className="p-5 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setViewMode("designer")}
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
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setViewMode("list")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent flex-1">
            Laboratório de Simulação
          </h1>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "designer" | "preview")}>
            <TabsList className="grid w-auto grid-cols-2">
              <TabsTrigger value="designer" className="gap-2">
                <PenTool className="w-4 h-4" />
                <span className="hidden sm:inline">Designer 2D</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Box className="w-4 h-4" />
                <span className="hidden sm:inline">Preview 3D</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <ExternalSimulatorConfig onConnect={setExternalConfig} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4">
        <div className="h-[calc(100vh-10rem)]">
          {activeTab === "designer" ? (
            <Designer2D 
              onRunSimulation={handleRunSimulation}
              onChange={handleDesignChange}
              initialNodes={designData.nodes}
              initialEdges={designData.edges}
            />
          ) : (
            <Card className="h-full p-4">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-lg">Pré-visualização 3D</h2>
                    <p className="text-sm text-muted-foreground">
                      {designData.nodes.length > 0 
                        ? `${designData.nodes.length} equipamentos conectados na bancada`
                        : "Adicione elementos no Designer 2D para vê-los na bancada"}
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleBackToDesigner}>
                    <PenTool className="w-4 h-4 mr-2" />
                    Voltar ao Designer
                  </Button>
                </div>
                <div className="flex-1">
                  <Simulation3D 
                    projectData={designData}
                    onBackToDesigner={handleBackToDesigner}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Navigation />
      <FloatingAssistant 
        context={`Laboratório Virtual - ${activeTab === "designer" ? "Designer 2D" : "Preview 3D"}`} 
      />
    </div>
  );
};

export default VirtualLab;
