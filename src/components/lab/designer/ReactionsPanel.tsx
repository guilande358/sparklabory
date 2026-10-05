import { useEffect, useState } from "react";
import { DiagramNode } from "@/lib/diagramTypes";
import { resolveLocal, getCachedAI, resolveReaction, ResolvedReaction } from "@/lib/reactionResolver";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlaskConical, Bot, Loader2 } from "lucide-react";

interface Props {
  nodes: DiagramNode[];
  edges: { id: string; source: string; target: string }[];
}

type Row = { edgeId: string; a: string; b: string; result: ResolvedReaction | null; loading: boolean; error?: string };

const typeLabel: Record<string, string> = {
  safe: "Segura", exothermic: "Exotérmica", endothermic: "Endotérmica", explosive: "Explosiva", toxic: "Tóxica",
};

const ReactionsPanel = ({ nodes, edges }: Props) => {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const next: Row[] = edges.flatMap((e) => {
      const s = nodes.find((n) => n.id === e.source);
      const t = nodes.find((n) => n.id === e.target);
      if (!s || !t) return [];
      const a = (s.data as any)?.substance || s.label;
      const b = (t.data as any)?.substance || t.label;
      return [{ edgeId: e.id, a, b, result: resolveLocal(a, b) ?? getCachedAI(a, b), loading: false }];
    });
    setRows(next);
  }, [nodes, edges]);

  const askAI = async (row: Row) => {
    setRows((r) => r.map((x) => (x.edgeId === row.edgeId ? { ...x, loading: true, error: undefined } : x)));
    try {
      const res = await resolveReaction(row.a, row.b);
      setRows((r) => r.map((x) => (x.edgeId === row.edgeId ? { ...x, result: res, loading: false } : x)));
    } catch (e: any) {
      setRows((r) => r.map((x) => (x.edgeId === row.edgeId ? { ...x, loading: false, error: e.message } : x)));
    }
  };

  if (rows.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-3 space-y-2 max-h-64 overflow-auto">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <FlaskConical className="h-4 w-4 text-primary" /> Reações detectadas
      </div>
      {rows.map((row) => (
        <div key={row.edgeId} className="rounded-lg border border-border p-2 text-sm space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{row.a} + {row.b}</span>
            {row.result && (
              <>
                <Badge variant={row.result.type === "explosive" || row.result.type === "toxic" ? "destructive" : "secondary"}>
                  {row.result.reacts === false ? "Sem reação" : typeLabel[row.result.type] ?? row.result.type}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  {row.result.source === "ai" ? <><Bot className="h-3 w-3" /> IA</> : "Base local"}
                </Badge>
              </>
            )}
          </div>
          {row.result ? (
            <>
              {row.result.equation && <p className="font-mono text-xs text-primary">{row.result.equation}</p>}
              <p className="text-muted-foreground">{row.result.description}</p>
              <p className="text-xs text-muted-foreground">
                ΔT ≈ {row.result.deltaT ?? 0} °C{row.result.ph != null ? ` · pH ≈ ${row.result.ph}` : ""}
                {row.result.effect ? ` · efeito: ${row.result.effect}` : ""}
              </p>
              {row.result.safety && <p className="text-xs text-destructive">{row.result.safety}</p>}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">Reação não está na base local.</span>
              <Button size="sm" variant="outline" onClick={() => askAI(row)} disabled={row.loading}>
                {row.loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Bot className="h-3 w-3" />}
                Analisar com IA
              </Button>
            </div>
          )}
          {row.error && <p className="text-xs text-destructive">{row.error}</p>}
        </div>
      ))}
    </div>
  );
};

export default ReactionsPanel;
