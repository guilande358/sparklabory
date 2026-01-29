import { useRef, useState, useEffect, useCallback } from "react";
import { DiagramNode, DiagramEdge, Position, BlockType, getBlockColor } from "@/lib/diagramTypes";
import { cn } from "@/lib/utils";

interface DiagramCanvasProps {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  isConnecting: boolean;
  connectingFrom: string | null;
  zoom: number;
  pan: Position;
  onNodeSelect: (id: string | null) => void;
  onEdgeSelect: (id: string | null) => void;
  onNodeMove: (id: string, position: Position) => void;
  onNodeDelete: (id: string) => void;
  onEdgeDelete: (id: string) => void;
  onStartConnecting: (nodeId: string) => void;
  onFinishConnecting: (nodeId: string) => void;
  onCancelConnecting: () => void;
  onAddNode: (type: BlockType, label: string, position: Position) => void;
  onZoomChange: (zoom: number) => void;
  onPanChange: (pan: Position) => void;
}

const GRID_SIZE = 20;
const NODE_WIDTH = 140;
const NODE_HEIGHT = 60;

const DiagramCanvas = ({
  nodes,
  edges,
  selectedNodeId,
  selectedEdgeId,
  isConnecting,
  connectingFrom,
  zoom,
  pan,
  onNodeSelect,
  onEdgeSelect,
  onNodeMove,
  onNodeDelete,
  onEdgeDelete,
  onStartConnecting,
  onFinishConnecting,
  onCancelConnecting,
  onAddNode,
  onZoomChange,
  onPanChange,
}: DiagramCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Position>({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });

  const getCanvasPosition = useCallback(
    (clientX: number, clientY: number): Position => {
      if (!containerRef.current) return { x: 0, y: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      return {
        x: (clientX - rect.left - pan.x) / zoom,
        y: (clientY - rect.top - pan.y) / zoom,
      };
    },
    [pan, zoom]
  );

  const snapToGrid = (value: number): number => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Middle mouse or Alt+click for panning
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    } else if (e.button === 0 && e.target === containerRef.current) {
      // Left click on canvas background
      onNodeSelect(null);
      onEdgeSelect(null);
      if (isConnecting) {
        onCancelConnecting();
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getCanvasPosition(e.clientX, e.clientY);
    setMousePos(pos);

    if (isPanning) {
      onPanChange({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    } else if (isDragging && draggedNodeId) {
      const newPos = {
        x: snapToGrid(pos.x - dragOffset.x),
        y: snapToGrid(pos.y - dragOffset.y),
      };
      onNodeMove(draggedNodeId, newPos);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setIsDragging(false);
    setDraggedNodeId(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.25, Math.min(2, zoom * delta));
    onZoomChange(newZoom);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, node: DiagramNode) => {
    e.stopPropagation();
    
    if (isConnecting) {
      onFinishConnecting(node.id);
      return;
    }

    const pos = getCanvasPosition(e.clientX, e.clientY);
    setDragOffset({
      x: pos.x - node.position.x,
      y: pos.y - node.position.y,
    });
    setDraggedNodeId(node.id);
    setIsDragging(true);
    onNodeSelect(node.id);
  };

  const handleNodeDoubleClick = (e: React.MouseEvent, node: DiagramNode) => {
    e.stopPropagation();
    onStartConnecting(node.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      const pos = getCanvasPosition(e.clientX, e.clientY);
      onAddNode(data.type, data.label, {
        x: snapToGrid(pos.x - NODE_WIDTH / 2),
        y: snapToGrid(pos.y - NODE_HEIGHT / 2),
      });
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedNodeId) {
          onNodeDelete(selectedNodeId);
        } else if (selectedEdgeId) {
          onEdgeDelete(selectedEdgeId);
        }
      } else if (e.key === "Escape") {
        if (isConnecting) {
          onCancelConnecting();
        } else {
          onNodeSelect(null);
          onEdgeSelect(null);
        }
      }
    },
    [selectedNodeId, selectedEdgeId, isConnecting, onNodeDelete, onEdgeDelete, onNodeSelect, onEdgeSelect, onCancelConnecting]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const renderGrid = () => {
    const gridSize = GRID_SIZE * zoom;
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <pattern
            id="grid"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${pan.x % gridSize} ${pan.y % gridSize})`}
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    );
  };

  const renderEdge = (edge: DiagramEdge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    if (!sourceNode || !targetNode) return null;

    const startX = (sourceNode.position.x + NODE_WIDTH / 2) * zoom + pan.x;
    const startY = (sourceNode.position.y + NODE_HEIGHT / 2) * zoom + pan.y;
    const endX = (targetNode.position.x + NODE_WIDTH / 2) * zoom + pan.x;
    const endY = (targetNode.position.y + NODE_HEIGHT / 2) * zoom + pan.y;

    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;

    // Bezier control points for smooth curve
    const controlX1 = startX + (endX - startX) * 0.3;
    const controlY1 = startY;
    const controlX2 = startX + (endX - startX) * 0.7;
    const controlY2 = endY;

    const isSelected = edge.id === selectedEdgeId;

    return (
      <g key={edge.id} onClick={() => onEdgeSelect(edge.id)} className="cursor-pointer">
        <path
          d={`M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`}
          fill="none"
          stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
          strokeWidth={isSelected ? 3 : 2}
          className="transition-colors"
        />
        {/* Arrow head */}
        <circle
          cx={endX}
          cy={endY}
          r={6 * zoom}
          fill={isSelected ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
        />
        {edge.label && (
          <text
            x={midX}
            y={midY - 10}
            textAnchor="middle"
            className="text-xs fill-muted-foreground"
          >
            {edge.label}
          </text>
        )}
      </g>
    );
  };

  const renderConnectingLine = () => {
    if (!isConnecting || !connectingFrom) return null;

    const sourceNode = nodes.find((n) => n.id === connectingFrom);
    if (!sourceNode) return null;

    const startX = (sourceNode.position.x + NODE_WIDTH / 2) * zoom + pan.x;
    const startY = (sourceNode.position.y + NODE_HEIGHT / 2) * zoom + pan.y;
    const endX = mousePos.x * zoom + pan.x;
    const endY = mousePos.y * zoom + pan.y;

    return (
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="hsl(var(--primary))"
        strokeWidth={2}
        strokeDasharray="5,5"
        className="pointer-events-none"
      />
    );
  };

  const renderNode = (node: DiagramNode) => {
    const isSelected = node.id === selectedNodeId;
    const isConnectingSource = node.id === connectingFrom;
    const color = getBlockColor(node.type);

    return (
      <div
        key={node.id}
        className={cn(
          "absolute rounded-xl border-2 bg-card shadow-md cursor-grab active:cursor-grabbing transition-all",
          isSelected && "ring-2 ring-primary ring-offset-2",
          isConnectingSource && "ring-2 ring-accent animate-pulse"
        )}
        style={{
          left: node.position.x * zoom + pan.x,
          top: node.position.y * zoom + pan.y,
          width: NODE_WIDTH * zoom,
          height: NODE_HEIGHT * zoom,
          borderColor: color,
          transform: `scale(${isSelected ? 1.02 : 1})`,
        }}
        onMouseDown={(e) => handleNodeMouseDown(e, node)}
        onDoubleClick={(e) => handleNodeDoubleClick(e, node)}
      >
        <div
          className="h-full flex flex-col items-center justify-center p-2"
          style={{ fontSize: `${12 * zoom}px` }}
        >
          <div
            className="w-2 h-2 rounded-full mb-1"
            style={{ backgroundColor: color }}
          />
          <span className="font-medium text-center truncate w-full">
            {node.label}
          </span>
          <span className="text-muted-foreground text-center capitalize" style={{ fontSize: `${10 * zoom}px` }}>
            {node.type}
          </span>
        </div>

        {/* Connection ports */}
        <div
          className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-background hover:bg-primary hover:border-primary transition-colors"
          style={{ borderColor: color }}
        />
        <div
          className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-background hover:bg-primary hover:border-primary transition-colors"
          style={{ borderColor: color }}
        />
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-background overflow-hidden rounded-xl"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {renderGrid()}

      {/* Edges SVG layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <g className="pointer-events-auto">
          {edges.map(renderEdge)}
          {renderConnectingLine()}
        </g>
      </svg>

      {/* Nodes layer */}
      {nodes.map(renderNode)}

      {/* Instructions overlay */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium mb-2">Arraste blocos aqui</p>
            <p className="text-sm">Clique duplo em um bloco para criar conexões</p>
          </div>
        </div>
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border text-sm">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
};

export default DiagramCanvas;
