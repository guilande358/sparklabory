import { useState, useCallback, useRef } from "react";
import { DiagramNode, DiagramEdge, Position, BlockType, generateId } from "@/lib/diagramTypes";

export interface DiagramState {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  isDragging: boolean;
  isConnecting: boolean;
  connectingFrom: string | null;
  zoom: number;
  pan: Position;
}

export interface DiagramActions {
  addNode: (type: BlockType, label: string, position: Position) => DiagramNode;
  updateNode: (id: string, updates: Partial<DiagramNode>) => void;
  deleteNode: (id: string) => void;
  addEdge: (source: string, target: string, type?: DiagramEdge["type"]) => DiagramEdge | null;
  deleteEdge: (id: string) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  startConnecting: (nodeId: string) => void;
  finishConnecting: (targetNodeId: string) => void;
  cancelConnecting: () => void;
  moveNode: (id: string, position: Position) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: Position) => void;
  clearAll: () => void;
  loadDesign: (nodes: DiagramNode[], edges: DiagramEdge[]) => void;
}

export const useDiagramEditor = (
  initialNodes: DiagramNode[] = [],
  initialEdges: DiagramEdge[] = []
): [DiagramState, DiagramActions] => {
  const [nodes, setNodes] = useState<DiagramNode[]>(initialNodes);
  const [edges, setEdges] = useState<DiagramEdge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [zoom, setZoomState] = useState(1);
  const [pan, setPanState] = useState<Position>({ x: 0, y: 0 });

  const historyRef = useRef<{ nodes: DiagramNode[]; edges: DiagramEdge[] }[]>([]);

  const saveToHistory = useCallback(() => {
    historyRef.current.push({
      nodes: [...nodes],
      edges: [...edges],
    });
    // Keep only last 50 states
    if (historyRef.current.length > 50) {
      historyRef.current.shift();
    }
  }, [nodes, edges]);

  const addNode = useCallback(
    (type: BlockType, label: string, position: Position): DiagramNode => {
      saveToHistory();
      const newNode: DiagramNode = {
        id: generateId(),
        type,
        label,
        position,
        data: {
          substance: type === "chemical" ? label : undefined,
          quantity: 1,
          unit: "mol",
          temperature: 25,
        },
      };
      setNodes((prev) => [...prev, newNode]);
      return newNode;
    },
    [saveToHistory]
  );

  const updateNode = useCallback(
    (id: string, updates: Partial<DiagramNode>) => {
      saveToHistory();
      setNodes((prev) =>
        prev.map((node) => (node.id === id ? { ...node, ...updates } : node))
      );
    },
    [saveToHistory]
  );

  const deleteNode = useCallback(
    (id: string) => {
      saveToHistory();
      setNodes((prev) => prev.filter((node) => node.id !== id));
      // Also delete connected edges
      setEdges((prev) =>
        prev.filter((edge) => edge.source !== id && edge.target !== id)
      );
      if (selectedNodeId === id) {
        setSelectedNodeId(null);
      }
    },
    [saveToHistory, selectedNodeId]
  );

  const addEdge = useCallback(
    (source: string, target: string, type: DiagramEdge["type"] = "flow"): DiagramEdge | null => {
      // Prevent self-connections
      if (source === target) return null;
      
      // Prevent duplicate edges
      const exists = edges.some(
        (e) =>
          (e.source === source && e.target === target) ||
          (e.source === target && e.target === source)
      );
      if (exists) return null;

      saveToHistory();
      const newEdge: DiagramEdge = {
        id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        source,
        target,
        type,
      };
      setEdges((prev) => [...prev, newEdge]);
      return newEdge;
    },
    [edges, saveToHistory]
  );

  const deleteEdge = useCallback(
    (id: string) => {
      saveToHistory();
      setEdges((prev) => prev.filter((edge) => edge.id !== id));
      if (selectedEdgeId === id) {
        setSelectedEdgeId(null);
      }
    },
    [saveToHistory, selectedEdgeId]
  );

  const selectNode = useCallback((id: string | null) => {
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
  }, []);

  const selectEdge = useCallback((id: string | null) => {
    setSelectedEdgeId(id);
    setSelectedNodeId(null);
  }, []);

  const startConnecting = useCallback((nodeId: string) => {
    setIsConnecting(true);
    setConnectingFrom(nodeId);
  }, []);

  const finishConnecting = useCallback(
    (targetNodeId: string) => {
      if (connectingFrom && connectingFrom !== targetNodeId) {
        addEdge(connectingFrom, targetNodeId);
      }
      setIsConnecting(false);
      setConnectingFrom(null);
    },
    [connectingFrom, addEdge]
  );

  const cancelConnecting = useCallback(() => {
    setIsConnecting(false);
    setConnectingFrom(null);
  }, []);

  const moveNode = useCallback(
    (id: string, position: Position) => {
      setNodes((prev) =>
        prev.map((node) => (node.id === id ? { ...node, position } : node))
      );
    },
    []
  );

  const setZoom = useCallback((newZoom: number) => {
    setZoomState(Math.max(0.25, Math.min(2, newZoom)));
  }, []);

  const setPan = useCallback((newPan: Position) => {
    setPanState(newPan);
  }, []);

  const clearAll = useCallback(() => {
    saveToHistory();
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [saveToHistory]);

  const loadDesign = useCallback((newNodes: DiagramNode[], newEdges: DiagramEdge[]) => {
    saveToHistory();
    setNodes(newNodes);
    setEdges(newEdges);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [saveToHistory]);

  const state: DiagramState = {
    nodes,
    edges,
    selectedNodeId,
    selectedEdgeId,
    isDragging,
    isConnecting,
    connectingFrom,
    zoom,
    pan,
  };

  const actions: DiagramActions = {
    addNode,
    updateNode,
    deleteNode,
    addEdge,
    deleteEdge,
    selectNode,
    selectEdge,
    startConnecting,
    finishConnecting,
    cancelConnecting,
    moveNode,
    setZoom,
    setPan,
    clearAll,
    loadDesign,
  };

  return [state, actions];
};
