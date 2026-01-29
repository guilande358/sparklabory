// Diagram types for the 2D Designer

export type BlockType = "chemical" | "equipment" | "molecule" | "process" | "output";

export type EdgeType = "flow" | "reaction" | "heat" | "connection";

export interface Position {
  x: number;
  y: number;
}

export interface BlockData {
  substance?: string;
  quantity?: number;
  unit?: string;
  temperature?: number;
  properties?: Record<string, any>;
}

export interface DiagramNode {
  id: string;
  type: BlockType;
  label: string;
  position: Position;
  data: BlockData;
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: EdgeType;
}

export interface SimulationConfig {
  speed: number;
  autoPlay: boolean;
  showWarnings: boolean;
  showLabels: boolean;
}

export interface LabDesign {
  id: string;
  projectId?: string;
  userId: string;
  name: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  simulationConfig: SimulationConfig;
  createdAt: string;
  updatedAt: string;
}

export interface BlockCategory {
  type: BlockType;
  label: string;
  icon: string;
  color: string;
  examples: string[];
}

export const BLOCK_CATEGORIES: BlockCategory[] = [
  {
    type: "chemical",
    label: "Químicos",
    icon: "Beaker",
    color: "hsl(250 85% 60%)",
    examples: ["H2O", "NaCl", "H2SO4", "HCl", "NaOH"],
  },
  {
    type: "equipment",
    label: "Equipamentos",
    icon: "FlaskConical",
    color: "hsl(150 65% 55%)",
    examples: ["Bunsen Burner", "Flask", "Condenser", "Beaker", "Test Tube"],
  },
  {
    type: "molecule",
    label: "Moléculas",
    icon: "Atom",
    color: "hsl(200 80% 55%)",
    examples: ["DNA", "RNA", "Proteins", "Enzymes", "ATP"],
  },
  {
    type: "process",
    label: "Processos",
    icon: "Cog",
    color: "hsl(25 95% 65%)",
    examples: ["Heating", "Mixing", "Filtering", "Distillation", "Centrifuge"],
  },
  {
    type: "output",
    label: "Saídas",
    icon: "FileOutput",
    color: "hsl(280 70% 60%)",
    examples: ["Result", "Measurement", "Report", "Product", "Waste"],
  },
];

export const getBlockColor = (type: BlockType): string => {
  const category = BLOCK_CATEGORIES.find((c) => c.type === type);
  return category?.color || "hsl(220 20% 60%)";
};

export const generateId = (): string => {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
