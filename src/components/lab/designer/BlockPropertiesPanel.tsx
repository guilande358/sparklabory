import { DiagramNode, DiagramEdge, BLOCK_CATEGORIES, getBlockColor } from "@/lib/diagramTypes";
import { getChemicalByName, isHazardous, isFlammable } from "@/lib/chemicalDatabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Trash2, AlertTriangle, Flame, FlaskConical } from "lucide-react";

interface BlockPropertiesPanelProps {
  selectedNode: DiagramNode | null;
  selectedEdge: DiagramEdge | null;
  onNodeUpdate: (id: string, updates: Partial<DiagramNode>) => void;
  onNodeDelete: (id: string) => void;
  onEdgeDelete: (id: string) => void;
}

const BlockPropertiesPanel = ({
  selectedNode,
  selectedEdge,
  onNodeUpdate,
  onNodeDelete,
  onEdgeDelete,
}: BlockPropertiesPanelProps) => {
  if (!selectedNode && !selectedEdge) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <FlaskConical className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">Nenhum elemento selecionado</p>
        <p className="text-sm mt-1">Clique em um bloco ou conexão para editar suas propriedades</p>
      </div>
    );
  }

  if (selectedEdge) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Conexão</h3>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onEdgeDelete(selectedEdge.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <Label className="text-muted-foreground text-sm">Tipo</Label>
            <p className="font-medium capitalize">{selectedEdge.type}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-sm">De</Label>
            <p className="font-medium">{selectedEdge.source}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-sm">Para</Label>
            <p className="font-medium">{selectedEdge.target}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Pressione Delete para remover esta conexão
        </p>
      </div>
    );
  }

  const node = selectedNode!;
  const color = getBlockColor(node.type);
  const chemical = node.type === "chemical" ? getChemicalByName(node.data.substance || node.label) : null;
  const hazardous = isHazardous(node.data.substance || node.label);
  const flammable = isFlammable(node.data.substance || node.label);

  const handleLabelChange = (value: string) => {
    onNodeUpdate(node.id, { 
      label: value,
      data: { ...node.data, substance: node.type === "chemical" ? value : node.data.substance }
    });
  };

  const handleQuantityChange = (value: number) => {
    onNodeUpdate(node.id, { data: { ...node.data, quantity: value } });
  };

  const handleUnitChange = (value: string) => {
    onNodeUpdate(node.id, { data: { ...node.data, unit: value } });
  };

  const handleTemperatureChange = (value: number[]) => {
    onNodeUpdate(node.id, { data: { ...node.data, temperature: value[0] } });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="font-bold text-lg">Propriedades</h3>
        </div>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onNodeDelete(node.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Warnings */}
      {(hazardous || flammable) && (
        <div className="flex flex-wrap gap-2">
          {hazardous && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Perigoso
            </Badge>
          )}
          {flammable && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-orange-500/20 text-orange-600">
              <Flame className="w-3 h-3" />
              Inflamável
            </Badge>
          )}
        </div>
      )}

      <div className="space-y-4">
        {/* Label */}
        <div className="space-y-2">
          <Label>Nome</Label>
          <Input
            value={node.label}
            onChange={(e) => handleLabelChange(e.target.value)}
            placeholder="Nome do bloco"
          />
        </div>

        {/* Type (read-only) */}
        <div className="space-y-2">
          <Label>Tipo</Label>
          <div className="px-3 py-2 bg-muted rounded-md text-sm capitalize">
            {BLOCK_CATEGORIES.find((c) => c.type === node.type)?.label || node.type}
          </div>
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <Label>Quantidade</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={node.data.quantity || 1}
              onChange={(e) => handleQuantityChange(parseFloat(e.target.value) || 1)}
              min={0}
              step={0.1}
              className="flex-1"
            />
            <Select value={node.data.unit || "mol"} onValueChange={handleUnitChange}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mol">mol</SelectItem>
                <SelectItem value="g">g</SelectItem>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="mL">mL</SelectItem>
                <SelectItem value="L">L</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <Label>Temperatura: {node.data.temperature || 25}°C</Label>
          <Slider
            value={[node.data.temperature || 25]}
            onValueChange={handleTemperatureChange}
            min={-50}
            max={500}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>-50°C</span>
            <span>500°C</span>
          </div>
        </div>

        {/* Chemical properties (if available) */}
        {chemical && (
          <div className="space-y-2 pt-4 border-t border-border">
            <Label className="text-muted-foreground">Propriedades Químicas</Label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Fórmula:</span>
                <span className="ml-1 font-medium">{chemical.formula}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Estado:</span>
                <span className="ml-1 font-medium capitalize">{chemical.state}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Massa molar:</span>
                <span className="ml-1 font-medium">{chemical.molarMass} g/mol</span>
              </div>
              {chemical.boilingPoint && (
                <div>
                  <span className="text-muted-foreground">P. Ebulição:</span>
                  <span className="ml-1 font-medium">{chemical.boilingPoint}°C</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground pt-2">
        Pressione Delete para remover este bloco
      </p>
    </div>
  );
};

export default BlockPropertiesPanel;
