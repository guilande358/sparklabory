import { supabase } from "@/integrations/supabase/client";
import { checkCompatibility, ReactionResult } from "./chemicalDatabase";

export interface ResolvedReaction extends ReactionResult {
  reactants: string[];
  reacts: boolean;
  safety?: string;
}

const CACHE_KEY = "ai_reaction_cache_v1";
const pending = new Map<string, Promise<ResolvedReaction | null>>();

const loadCache = (): Record<string, ResolvedReaction> => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { return {}; }
};
const keyOf = (a: string, b: string) => [a.trim().toLowerCase(), b.trim().toLowerCase()].sort().join("+");

export const resolveLocal = (a: string, b: string): ResolvedReaction | null => {
  const r = checkCompatibility(a, b);
  return r ? { ...r, reactants: [a, b], reacts: true, source: "local" } : null;
};

export const getCachedAI = (a: string, b: string): ResolvedReaction | null => loadCache()[keyOf(a, b)] ?? null;

/** Local rules first; falls back to AI for unknown combinations (cached). */
export const resolveReaction = async (a: string, b: string, temperature?: number): Promise<ResolvedReaction | null> => {
  const local = resolveLocal(a, b);
  if (local) return local;
  const k = keyOf(a, b);
  const cached = loadCache()[k];
  if (cached) return cached;
  if (pending.has(k)) return pending.get(k)!;

  const p = (async () => {
    const { data, error } = await supabase.functions.invoke("simulate-reaction", {
      body: { reactants: [a, b], temperature },
    });
    if (error || !data?.reaction) throw new Error(data?.error || error?.message || "Falha na IA");
    const r = data.reaction;
    const resolved: ResolvedReaction = {
      reactants: [a, b],
      reacts: r.reacts,
      products: r.products,
      equation: r.equation,
      type: r.type === "none" ? "safe" : r.type,
      effect: r.effect,
      deltaT: r.deltaT,
      ph: r.ph,
      description: r.description,
      safety: r.safety,
      source: "ai",
    };
    const c = loadCache(); c[k] = resolved;
    localStorage.setItem(CACHE_KEY, JSON.stringify(c));
    return resolved;
  })().finally(() => pending.delete(k));
  pending.set(k, p);
  return p;
};
