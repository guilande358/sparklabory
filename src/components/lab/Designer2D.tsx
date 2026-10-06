import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDiagramEditor } from "@/hooks/useDiagramEditor";
import { DiagramNode, DiagramEdge, BlockType, Position } from "@/lib/diagramTypes";
import { SimulationEngine, SimulationWarning } from "@/lib/simulationEngine";
import DiagramCanvas from "./designer/DiagramCanvas";
import BlockPalette from "./designer/BlockPalette";
import BlockPropertiesPanel from "./designer/BlockPropertiesPanel";
import DesignerToolbar from "./designer/DesignerToolbar";
import ReactionsPanel from "./designer/ReactionsPanel";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

interface Designer2DProps {
  onRunSimulation: (nodes: DiagramNode[], edges: DiagramEdge[]) => void;
  onChange?: (nodes: DiagramNode[], edges: DiagramEdge[]) => void;
  initialNodes?: DiagramNode[];
  initialEdges?: DiagramEdge[];
}

const Designer2D = ({
  onRunSimulation,
  onChange,
  initialNodes = [],
  initialEdges = [],
}: Designer2DProps) => {
  const { toast } = useToast();
  const [state, actions] = useDiagramEditor(initialNodes, initialEdges);
  const [warnings, setWarnings] = useState<SimulationWarning[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set());

  // Notifica o componente pai sempre que os nós ou arestas forem alterados
  useEffect(() => {
    if (onChange) {
      onChange(state.nodes, state.edges);
    }
  }, [state.nodes, state.edges, onChange]);

  // Validação contínua do motor de simulação
  useEffect(() => {
    const engine = new SimulationEngine();
    engine.parseDesign(state.nodes, state.edges);
    const newWarnings = engine.validateConnections();
    setWarnings(newWarnings);
    engine.dispose();
  }, [state.nodes, state.edges]);

  const handleBlockDrag = useCallback((type: BlockType, label: string) => {
    // Espaço reservado para visualização em drag
  }, []);

  const handleAddCustomBlock = useCallback(
    (type: BlockType, label: string) => {
      actions.addNode(type, label, { x: 200, y: 200 });
      toast({
        title: "Bloco adicionado",
        description: `"${label}" foi adicionado ao canvas`,
      });
    },
    [actions, toast]
  );

  const handleAddNode = useCallback(
    (type: BlockType, label: string, position: Position) => {
      actions.addNode(type, label, position);
    },
    [actions]
  );

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const design = {
        nodes: state.nodes,
        edges: state.edges,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("lab_design_draft", JSON.stringify(design));
      toast({
        title: "Design salvo",
        description: "Seu design foi salvo localmente",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o design",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [state.nodes, state.edges, toast]);

  const handleLoad = useCallback(() => {
    try {
      const saved = localStorage.getItem("lab_design_draft");
      if (saved) {
        const design = JSON.parse(saved);
        actions.loadDesign(design.nodes, design.edges);
        toast({
          title: "Design carregado",
          description: "Seu design foi restaurado",
        });
      } else {
        toast({
          title: "Nenhum design encontrado",
          description: "Não há design salvo para carregar",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar o design",
        variant: "destructive",
      });
    }
  }, [actions, toast]);

  const handleClear = useCallback(() => {
    if (state.nodes.length > 0) {
      actions.clearAll();
      toast({
        title: "Canvas limpo",
        description: "Todos os blocos foram removidos",
      });
    }
  }, [actions, state.nodes.length, toast]);

  const handleRunSimulation = useCallback(() => {
    if (state.nodes.length === 0) {
      toast({
        title: "Canvas vazio",
        description: "Adicione blocos ao canvas antes de simular",
        variant: "destructive",
      });
      return;
    }
    onRunSimulation(state.nodes, state.edges);
  }, [state.nodes, state.edges, onRunSimulation, toast]);

  const handleExport = useCallback(() => {
    const design = {
      nodes: state.nodes,
      edges: state.edges,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(design, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lab-design.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Design exportado",
      description: "Arquivo JSON baixado com sucesso",
    });
  }, [state.nodes, state.edges, toast]);

  const handleDismissWarning = (warningId: string) => {
    setDismissedWarnings((prev) => new Set([...prev, warningId]));
  };

  const selectedNode = state.nodes.find((n) => n.id === state.selectedNodeId) || null;
  const selectedEdge = state.edges.find((e) => e.id === state.selectedEdgeId) || null;
  const visibleWarnings = warnings.filter((w) => !dismissedWarnings.has(w.id));

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "s") {
          e.preventDefault();
          handleSave();
        }
      } else if (e.key === "r" && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
          handleRunSimulation();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, handleRunSimulation]);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Barra de Ferramentas */}
      <DesignerToolbar
        zoom={state.zoom}
        onZoomIn={() => actions.setZoom(state.zoom + 0.1)}
        onZoomOut={() => actions.setZoom(state.zoom - 0.1)}
        onSave={handleSave}
        onLoad={handleLoad}
        onClear={handleClear}
        onRunSimulation={handleRunSimulation}
        onExport={handleExport}
        isSaving={isSaving}
      />

      {/* Avisos de Segurança Quimica */}
      {visibleWarnings.length > 0 && (
        <div className="space-y-2">
          {visibleWarnings.slice(0, 3).map((warning) => (
            <Alert
              key={warning.id}
              variant={warning.type === "danger" ? "destructive" : "default"}
              className="relative pr-10"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{warning.message}</AlertDescription>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => handleDismissWarning(warning.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Alert>
          ))}
        </div>
      )}

      {/* Painel de Reações e Análise com IA */}
      <ReactionsPanel nodes={state.nodes} edges={state.edges} />

      {/* Área de Trabalho Dividida */}
      <ResizablePanelGroup direction="horizontal" className="flex-1 rounded-xl border border-border">
        {/* Paleta de Blocos */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <BlockPalette
            onBlockDrag={handleBlockDrag}
            onAddCustomBlock={handleAddCustomBlock}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Canvas do Diagrama */}
        <ResizablePanel defaultSize={55} minSize={40}>
          <DiagramCanvas
            nodes={state.nodes}
            edges={state.edges}
            selectedNodeId={state.selectedNodeId}
            selectedEdgeId={state.selectedEdgeId}
            isConnecting={state.isConnecting}
            connectingFrom={state.connectingFrom}
            zoom={state.zoom}
            pan={state.pan}
            onNodeSelect={actions.selectNode}
            onEdgeSelect={actions.selectEdge}
            onNodeMove={actions.moveNode}
            onNodeDelete={actions.deleteNode}
            onEdgeDelete={actions.deleteEdge}
            onStartConnecting={actions.startConnecting}
            onFinishConnecting={actions.finishConnecting}
            onCancelConnecting={actions.cancelConnecting}
            onAddNode={handleAddNode}
            onZoomChange={actions.setZoom}
            onPanChange={actions.setPan}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Painel Lateral de Propriedades */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          <div className="h-full bg-card rounded-r-xl border-l border-border overflow-auto">
            <BlockPropertiesPanel
              selectedNode={selectedNode}
              selectedEdge={selectedEdge}
              onNodeUpdate={actions.updateNode}
              onNodeDelete={actions.deleteNode}
              onEdgeDelete={actions.deleteEdge}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Designer2D;
