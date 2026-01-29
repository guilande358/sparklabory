import { Save, FolderOpen, Trash2, ZoomIn, ZoomOut, Undo, Play, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DesignerToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  onRunSimulation: () => void;
  onExport: () => void;
  canUndo?: boolean;
  onUndo?: () => void;
  isSaving?: boolean;
}

const DesignerToolbar = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onSave,
  onLoad,
  onClear,
  onRunSimulation,
  onExport,
  canUndo = false,
  onUndo,
  isSaving = false,
}: DesignerToolbarProps) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 p-2 bg-card rounded-xl border border-border">
        {/* File operations */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onSave} disabled={isSaving}>
              <Save className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Salvar (Ctrl+S)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onLoad}>
              <FolderOpen className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Abrir Design</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onExport}>
              <Download className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Exportar</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Edit operations */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo}>
              <Undo className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Desfazer (Ctrl+Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onClear}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Limpar Tudo</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Zoom controls */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Diminuir Zoom</TooltipContent>
        </Tooltip>

        <span className="px-2 text-sm font-medium min-w-[4rem] text-center">
          {Math.round(zoom * 100)}%
        </span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Aumentar Zoom</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Simulation */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onRunSimulation} className="gap-2">
              <Play className="w-4 h-4" />
              Simular
            </Button>
          </TooltipTrigger>
          <TooltipContent>Executar Simulação 3D (R)</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default DesignerToolbar;
