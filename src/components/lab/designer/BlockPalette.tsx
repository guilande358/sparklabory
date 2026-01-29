import { useState } from "react";
import { Beaker, FlaskConical, Atom, Cog, FileOutput, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BLOCK_CATEGORIES, BlockType } from "@/lib/diagramTypes";

interface BlockPaletteProps {
  onBlockDrag: (type: BlockType, label: string) => void;
  onAddCustomBlock: (type: BlockType, label: string) => void;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Beaker":
      return Beaker;
    case "FlaskConical":
      return FlaskConical;
    case "Atom":
      return Atom;
    case "Cog":
      return Cog;
    case "FileOutput":
      return FileOutput;
    default:
      return Beaker;
  }
};

const BlockPalette = ({ onBlockDrag, onAddCustomBlock }: BlockPaletteProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customLabel, setCustomLabel] = useState("");
  const [selectedType, setSelectedType] = useState<BlockType>("chemical");
  const [openCategories, setOpenCategories] = useState<string[]>(["chemical"]);

  const toggleCategory = (type: string) => {
    setOpenCategories((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleDragStart = (e: React.DragEvent, type: BlockType, label: string) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ type, label }));
    e.dataTransfer.effectAllowed = "copy";
    onBlockDrag(type, label);
  };

  const handleAddCustom = () => {
    if (customLabel.trim()) {
      onAddCustomBlock(selectedType, customLabel.trim());
      setCustomLabel("");
    }
  };

  const filteredCategories = BLOCK_CATEGORIES.map((category) => ({
    ...category,
    examples: category.examples.filter((ex) =>
      ex.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((cat) => cat.examples.length > 0 || searchTerm === "");

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border">
      <div className="p-4 border-b border-border">
        <h3 className="font-bold text-lg mb-3">Blocos</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar blocos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {filteredCategories.map((category) => {
            const Icon = getIcon(category.icon);
            const isOpen = openCategories.includes(category.type);

            return (
              <Collapsible
                key={category.type}
                open={isOpen}
                onOpenChange={() => toggleCategory(category.type)}
              >
                <CollapsibleTrigger asChild>
                  <button
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setSelectedType(category.type)}
                  >
                    <div
                      className="p-1.5 rounded-md"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: category.color }} />
                    </div>
                    <span className="font-medium text-sm flex-1 text-left">
                      {category.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {category.examples.length}
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="ml-4 mt-1 space-y-1">
                    {category.examples.map((example) => (
                      <div
                        key={example}
                        draggable
                        onDragStart={(e) => handleDragStart(e, category.type, example)}
                        className="flex items-center gap-2 p-2 rounded-md bg-muted/50 hover:bg-muted cursor-grab active:cursor-grabbing transition-colors text-sm"
                        style={{ borderLeft: `3px solid ${category.color}` }}
                      >
                        <span>{example}</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <h4 className="font-medium text-sm mb-2">Bloco Personalizado</h4>
        <div className="flex gap-2">
          <Input
            placeholder="Nome do bloco..."
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
            className="text-sm"
          />
          <Button size="icon" onClick={handleAddCustom} disabled={!customLabel.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Tipo: {BLOCK_CATEGORIES.find((c) => c.type === selectedType)?.label}
        </p>
      </div>
    </div>
  );
};

export default BlockPalette;
