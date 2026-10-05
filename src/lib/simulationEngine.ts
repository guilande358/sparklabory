// Simulation engine for processing diagram designs

import { DiagramNode, DiagramEdge, SimulationConfig } from "./diagramTypes";
import { getChemicalByName, checkCompatibility, ReactionResult } from "./chemicalDatabase";

export interface SimulationState {
  isRunning: boolean;
  currentTime: number;
  activeEffects: SimulationEffect[];
  warnings: SimulationWarning[];
  nodeStates: Map<string, NodeState>;
}

export interface SimulationEffect {
  id: string;
  type: "explosion" | "fire" | "smoke" | "bubbles" | "color_change" | "leak" | "glow" | "precipitate";
  position: { x: number; y: number; z: number };
  intensity: number;
  duration: number;
  startTime: number;
  color?: string;
}

export interface SimulationWarning {
  id: string;
  type: "danger" | "caution" | "info";
  message: string;
  nodeIds: string[];
}

export interface NodeState {
  nodeId: string;
  temperature: number;
  quantity: number;
  active: boolean;
  effects: string[];
}

export class SimulationEngine {
  private nodes: DiagramNode[] = [];
  private edges: DiagramEdge[] = [];
  private config: SimulationConfig;
  private state: SimulationState;
  private animationFrame: number | null = null;
  private lastUpdate: number = 0;
  private onStateChange?: (state: SimulationState) => void;

  constructor(config?: Partial<SimulationConfig>) {
    this.config = {
      speed: 1,
      autoPlay: false,
      showWarnings: true,
      showLabels: true,
      ...config,
    };

    this.state = {
      isRunning: false,
      currentTime: 0,
      activeEffects: [],
      warnings: [],
      nodeStates: new Map(),
    };
  }

  parseDesign(nodes: DiagramNode[], edges: DiagramEdge[]): void {
    this.nodes = nodes;
    this.edges = edges;
    this.initializeNodeStates();
    this.validateConnections();
  }

  private initializeNodeStates(): void {
    this.state.nodeStates.clear();
    
    for (const node of this.nodes) {
      this.state.nodeStates.set(node.id, {
        nodeId: node.id,
        temperature: node.data.temperature || 25,
        quantity: node.data.quantity || 1,
        active: true,
        effects: [],
      });
    }
  }

  validateConnections(): SimulationWarning[] {
    const warnings: SimulationWarning[] = [];

    // Check for hazardous chemical combinations
    for (const edge of this.edges) {
      const sourceNode = this.nodes.find((n) => n.id === edge.source);
      const targetNode = this.nodes.find((n) => n.id === edge.target);

      if (sourceNode && targetNode) {
        const sourceSubstance = sourceNode.data.substance || sourceNode.label;
        const targetSubstance = targetNode.data.substance || targetNode.label;

        const reaction = checkCompatibility(sourceSubstance, targetSubstance);
        
        if (reaction) {
          if (reaction.type === "explosive") {
            warnings.push({
              id: `warning_${edge.id}`,
              type: "danger",
              message: `⚠️ PERIGO: ${sourceSubstance} + ${targetSubstance} pode causar explosão! ${reaction.description}`,
              nodeIds: [sourceNode.id, targetNode.id],
            });
          } else if (reaction.type === "toxic") {
            warnings.push({
              id: `warning_${edge.id}`,
              type: "danger",
              message: `☠️ TÓXICO: A combinação de ${sourceSubstance} e ${targetSubstance} pode ser perigosa`,
              nodeIds: [sourceNode.id, targetNode.id],
            });
          } else if (reaction.type === "exothermic") {
            warnings.push({
              id: `warning_${edge.id}`,
              type: "caution",
              message: `🔥 Atenção: Reação exotérmica entre ${sourceSubstance} e ${targetSubstance}`,
              nodeIds: [sourceNode.id, targetNode.id],
            });
          }
        }
      }
    }

    this.state.warnings = warnings;
    return warnings;
  }

  calculateReactions(): SimulationEffect[] {
    const effects: SimulationEffect[] = [];

    for (const edge of this.edges) {
      const sourceNode = this.nodes.find((n) => n.id === edge.source);
      const targetNode = this.nodes.find((n) => n.id === edge.target);

      if (sourceNode && targetNode) {
        const sourceSubstance = sourceNode.data.substance || sourceNode.label;
        const targetSubstance = targetNode.data.substance || targetNode.label;

        const reaction = checkCompatibility(sourceSubstance, targetSubstance);
        
        if (reaction?.effect) {
          // Calculate midpoint for effect position
          const midX = (sourceNode.position.x + targetNode.position.x) / 2;
          const midY = (sourceNode.position.y + targetNode.position.y) / 2;

          effects.push({
            id: `effect_${edge.id}`,
            type: reaction.effect,
            position: { x: midX, y: midY, z: 0 },
            intensity: reaction.type === "explosive" ? 1.0 : 0.5,
            duration: reaction.type === "explosive" ? 2000 : 5000,
            startTime: this.state.currentTime,
            color: this.getEffectColor(reaction.effect),
          });
        }
      }
    }

    return effects;
  }

  private getEffectColor(effect: string): string {
    switch (effect) {
      case "explosion":
        return "#ff4444";
      case "fire":
        return "#ff8800";
      case "smoke":
        return "#666666";
      case "bubbles":
        return "#88ccff";
      case "color_change":
        return "#aa44ff";
      case "leak":
        return "#44ff88";
      default:
        return "#ffffff";
    }
  }

  start(onStateChange?: (state: SimulationState) => void): void {
    this.onStateChange = onStateChange;
    this.state.isRunning = true;
    this.lastUpdate = performance.now();
    this.runLoop();
  }

  pause(): void {
    this.state.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  reset(): void {
    this.pause();
    this.state.currentTime = 0;
    this.state.activeEffects = [];
    this.initializeNodeStates();
    this.notifyChange();
  }

  private runLoop(): void {
    if (!this.state.isRunning) return;

    const now = performance.now();
    const delta = (now - this.lastUpdate) * this.config.speed;
    this.lastUpdate = now;

    this.state.currentTime += delta;
    this.updateEffects(delta);
    this.notifyChange();

    this.animationFrame = requestAnimationFrame(() => this.runLoop());
  }

  private updateEffects(delta: number): void {
    // Remove expired effects
    this.state.activeEffects = this.state.activeEffects.filter((effect) => {
      const elapsed = this.state.currentTime - effect.startTime;
      return elapsed < effect.duration;
    });

    // Add new effects based on reactions
    if (this.state.currentTime % 1000 < delta) {
      const newEffects = this.calculateReactions();
      for (const effect of newEffects) {
        if (!this.state.activeEffects.some((e) => e.id === effect.id)) {
          this.state.activeEffects.push(effect);
        }
      }
    }
  }

  private notifyChange(): void {
    if (this.onStateChange) {
      this.onStateChange({ ...this.state });
    }
  }

  getState(): SimulationState {
    return { ...this.state };
  }

  setSpeed(speed: number): void {
    this.config.speed = Math.max(0.1, Math.min(5, speed));
  }

  triggerEffect(type: SimulationEffect["type"], position: { x: number; y: number }): void {
    this.state.activeEffects.push({
      id: `manual_${Date.now()}`,
      type,
      position: { ...position, z: 0 },
      intensity: 1.0,
      duration: 3000,
      startTime: this.state.currentTime,
      color: this.getEffectColor(type),
    });
  }

  dispose(): void {
    this.pause();
    this.nodes = [];
    this.edges = [];
    this.state.activeEffects = [];
    this.state.warnings = [];
    this.state.nodeStates.clear();
  }
}

// Singleton instance for global access
let engineInstance: SimulationEngine | null = null;

export const getSimulationEngine = (): SimulationEngine => {
  if (!engineInstance) {
    engineInstance = new SimulationEngine();
  }
  return engineInstance;
};

export const resetSimulationEngine = (): void => {
  if (engineInstance) {
    engineInstance.dispose();
  }
  engineInstance = new SimulationEngine();
};
