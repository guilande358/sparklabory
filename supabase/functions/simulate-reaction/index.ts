import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const Body = z.object({
  reactants: z.array(z.string().trim().min(1).max(80)).min(2).max(4),
  temperature: z.number().min(-273).max(5000).optional(),
});

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["reacts", "equation", "products", "type", "effect", "deltaT", "ph", "description", "safety"],
  properties: {
    reacts: { type: "boolean" },
    equation: { type: "string" },
    products: { type: "array", items: { type: "string" } },
    type: { type: "string", enum: ["none", "safe", "exothermic", "endothermic", "explosive", "toxic"] },
    effect: { type: ["string", "null"], enum: ["explosion", "fire", "smoke", "bubbles", "color_change", "leak", "precipitate", null] },
    deltaT: { type: "number" },
    ph: { type: ["number", "null"] },
    description: { type: "string" },
    safety: { type: "string" },
  },
};

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const { reactants, temperature } = parsed.data;
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) return json({ error: "LOVABLE_API_KEY not configured" }, 500);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Lovable-API-Key": key,
        "Content-Type": "application/json",
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        store: false,
        reasoning: { effort: "low" },
        instructions:
          "You are a chemistry engine for an educational lab simulator. Given reactants, predict the real chemical outcome under standard lab conditions (or the given temperature). Return a balanced equation with state symbols, real products, reaction type, the main visible effect, approximate temperature change in °C, resulting pH if aqueous (else null), a short didactic explanation in Portuguese, and a short safety note in Portuguese. If no meaningful reaction occurs, set reacts=false, type='none', effect=null. Never give step-by-step instructions for making weapons or explosives; keep explanations conceptual.",
        input: `Reactants: ${reactants.join(" + ")}${temperature !== undefined ? `\nTemperature: ${temperature} °C` : ""}`,
        text: { format: { type: "json_schema", name: "reaction", strict: true, schema } },
      }),
    });

    if (!res.ok || !res.body) {
      const t = await res.text();
      console.error("gateway error", res.status, t);
      const msg = res.status === 429 ? "Muitas requisições, tente novamente em instantes."
        : res.status === 402 ? "Créditos de IA esgotados."
        : "Falha ao consultar a IA.";
      return json({ error: msg }, res.status);
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "", out = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const d = line.slice(5).trim();
        if (!d || d === "[DONE]") continue;
        try {
          const ev = JSON.parse(d);
          if (ev.type === "response.output_text.delta") out += ev.delta;
        } catch { /* partial */ }
      }
    }
    if (!out) return json({ error: "A IA não retornou resultado." }, 502);
    return json({ reaction: JSON.parse(out) });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Erro" }, 500);
  }
});
