// Chemical database for simulation engine

export interface ChemicalProperties {
  name: string;
  formula: string;
  molarMass: number;
  state: "solid" | "liquid" | "gas";
  color: string;
  hazardous: boolean;
  flammable: boolean;
  boilingPoint?: number;
  meltingPoint?: number;
  density?: number;
}

export interface ReactionResult {
  products: string[];
  equation?: string;
  deltaT?: number;
  ph?: number | null;
  source?: "local" | "ai";
  type: "safe" | "exothermic" | "endothermic" | "explosive" | "toxic";
  description: string;
  effect?: "explosion" | "fire" | "smoke" | "bubbles" | "color_change" | "leak" | "precipitate" | null;
}

// Common chemicals database
export const CHEMICALS: Record<string, ChemicalProperties> = {
  H2O: {
    name: "Water",
    formula: "H2O",
    molarMass: 18.015,
    state: "liquid",
    color: "#a8d8ff",
    hazardous: false,
    flammable: false,
    boilingPoint: 100,
    meltingPoint: 0,
    density: 1.0,
  },
  NaCl: {
    name: "Sodium Chloride",
    formula: "NaCl",
    molarMass: 58.44,
    state: "solid",
    color: "#ffffff",
    hazardous: false,
    flammable: false,
    meltingPoint: 801,
    density: 2.16,
  },
  H2SO4: {
    name: "Sulfuric Acid",
    formula: "H2SO4",
    molarMass: 98.079,
    state: "liquid",
    color: "#ffe4b5",
    hazardous: true,
    flammable: false,
    boilingPoint: 337,
    density: 1.84,
  },
  HCl: {
    name: "Hydrochloric Acid",
    formula: "HCl",
    molarMass: 36.46,
    state: "liquid",
    color: "#e0ffff",
    hazardous: true,
    flammable: false,
    boilingPoint: -85,
    density: 1.18,
  },
  NaOH: {
    name: "Sodium Hydroxide",
    formula: "NaOH",
    molarMass: 40.0,
    state: "solid",
    color: "#fffaf0",
    hazardous: true,
    flammable: false,
    meltingPoint: 323,
    density: 2.13,
  },
  C2H5OH: {
    name: "Ethanol",
    formula: "C2H5OH",
    molarMass: 46.07,
    state: "liquid",
    color: "#ffe4c4",
    hazardous: false,
    flammable: true,
    boilingPoint: 78,
    density: 0.789,
  },
  CH4: {
    name: "Methane",
    formula: "CH4",
    molarMass: 16.04,
    state: "gas",
    color: "#e0e0e0",
    hazardous: false,
    flammable: true,
    boilingPoint: -161,
    density: 0.657,
  },
  O2: {
    name: "Oxygen",
    formula: "O2",
    molarMass: 32.0,
    state: "gas",
    color: "#87ceeb",
    hazardous: false,
    flammable: false,
    boilingPoint: -183,
    density: 1.429,
  },
  H2: {
    name: "Hydrogen",
    formula: "H2",
    molarMass: 2.016,
    state: "gas",
    color: "#f0f8ff",
    hazardous: false,
    flammable: true,
    boilingPoint: -253,
    density: 0.089,
  },
  Na: { name: "Sodium", formula: "Na", molarMass: 22.99, state: "solid", color: "#c0c0c0", hazardous: true, flammable: false, meltingPoint: 98, density: 0.97 },
  K: { name: "Potassium", formula: "K", molarMass: 39.1, state: "solid", color: "#c8c8c8", hazardous: true, flammable: false, meltingPoint: 63, density: 0.86 },
  Mg: { name: "Magnesium", formula: "Mg", molarMass: 24.31, state: "solid", color: "#d9d9d9", hazardous: false, flammable: true, meltingPoint: 650, density: 1.74 },
  Zn: { name: "Zinc", formula: "Zn", molarMass: 65.38, state: "solid", color: "#bac4c8", hazardous: false, flammable: false, meltingPoint: 420, density: 7.14 },
  Fe: { name: "Iron", formula: "Fe", molarMass: 55.85, state: "solid", color: "#8a8a8a", hazardous: false, flammable: false, meltingPoint: 1538, density: 7.87 },
  Cu: { name: "Copper", formula: "Cu", molarMass: 63.55, state: "solid", color: "#b87333", hazardous: false, flammable: false, meltingPoint: 1085, density: 8.96 },
  CO2: { name: "Carbon Dioxide", formula: "CO2", molarMass: 44.01, state: "gas", color: "#eeeeee", hazardous: false, flammable: false },
  CaCO3: { name: "Calcium Carbonate", formula: "CaCO3", molarMass: 100.09, state: "solid", color: "#ffffff", hazardous: false, flammable: false, density: 2.71 },
  NaHCO3: { name: "Sodium Bicarbonate", formula: "NaHCO3", molarMass: 84.01, state: "solid", color: "#ffffff", hazardous: false, flammable: false, density: 2.2 },
  CH3COOH: { name: "Acetic Acid", formula: "CH3COOH", molarMass: 60.05, state: "liquid", color: "#f5f5dc", hazardous: false, flammable: true, boilingPoint: 118, density: 1.05 },
  AgNO3: { name: "Silver Nitrate", formula: "AgNO3", molarMass: 169.87, state: "solid", color: "#f8f8f8", hazardous: true, flammable: false },
  CuSO4: { name: "Copper Sulfate", formula: "CuSO4", molarMass: 159.61, state: "solid", color: "#1e90ff", hazardous: true, flammable: false },
  KI: { name: "Potassium Iodide", formula: "KI", molarMass: 166.0, state: "solid", color: "#ffffff", hazardous: false, flammable: false },
  PbNO32: { name: "Lead Nitrate", formula: "PbNO32", molarMass: 331.2, state: "solid", color: "#ffffff", hazardous: true, flammable: false },
  NH3: { name: "Ammonia", formula: "NH3", molarMass: 17.03, state: "gas", color: "#f0f0ff", hazardous: true, flammable: false },
  NaOCl: { name: "Bleach", formula: "NaOCl", molarMass: 74.44, state: "liquid", color: "#f0fff0", hazardous: true, flammable: false },
};

// Reaction compatibility matrix
const R = (products: string[], equation: string, type: ReactionResult["type"], effect: ReactionResult["effect"], deltaT: number, description: string, ph: number | null = null): ReactionResult =>
  ({ products, equation, type, effect, deltaT, description, ph, source: "local" });

const REACTIONS: Record<string, ReactionResult> = {
  "Na+H2O": R(["NaOH", "H2"], "2Na(s) + 2H2O(l) → 2NaOH(aq) + H2(g)", "explosive", "explosion", 60, "O sódio reage violentamente com a água, liberando hidrogênio e calor.", 13),
  "K+H2O": R(["KOH", "H2"], "2K(s) + 2H2O(l) → 2KOH(aq) + H2(g)", "explosive", "explosion", 80, "O potássio reage ainda mais violentamente que o sódio; o hidrogênio inflama com chama lilás.", 13),
  "HCl+NaOH": R(["NaCl", "H2O"], "HCl(aq) + NaOH(aq) → NaCl(aq) + H2O(l)", "exothermic", "bubbles", 6, "Neutralização ácido-base: forma sal e água.", 7),
  "H2SO4+NaOH": R(["Na2SO4", "H2O"], "H2SO4(aq) + 2NaOH(aq) → Na2SO4(aq) + 2H2O(l)", "exothermic", "bubbles", 10, "Neutralização de ácido forte diprótico.", 7),
  "H2SO4+H2O": R(["H3O+", "HSO4-"], "H2SO4(l) + H2O(l) → H3O+(aq) + HSO4-(aq)", "exothermic", "smoke", 40, "Diluição muito exotérmica. Sempre adicione o ácido à água, nunca o contrário.", 1),
  "H2+O2": R(["H2O"], "2H2(g) + O2(g) → 2H2O(g)", "explosive", "explosion", 200, "Hidrogênio e oxigênio combinam-se explosivamente quando há ignição."),
  "CH4+O2": R(["CO2", "H2O"], "CH4(g) + 2O2(g) → CO2(g) + 2H2O(g)", "exothermic", "fire", 150, "Combustão do metano: libera calor e luz."),
  "C2H5OH+O2": R(["CO2", "H2O"], "C2H5OH(l) + 3O2(g) → 2CO2(g) + 3H2O(g)", "exothermic", "fire", 120, "Combustão do etanol com chama azulada."),
  "Mg+O2": R(["MgO"], "2Mg(s) + O2(g) → 2MgO(s)", "exothermic", "fire", 300, "O magnésio queima com luz branca intensa formando óxido de magnésio."),
  "Mg+HCl": R(["MgCl2", "H2"], "Mg(s) + 2HCl(aq) → MgCl2(aq) + H2(g)", "exothermic", "bubbles", 15, "Metal reativo desloca o hidrogênio do ácido, gerando efervescência."),
  "Zn+HCl": R(["ZnCl2", "H2"], "Zn(s) + 2HCl(aq) → ZnCl2(aq) + H2(g)", "exothermic", "bubbles", 8, "O zinco reage com o ácido liberando gás hidrogênio."),
  "Fe+HCl": R(["FeCl2", "H2"], "Fe(s) + 2HCl(aq) → FeCl2(aq) + H2(g)", "exothermic", "bubbles", 4, "Reação lenta do ferro com ácido; solução fica verde-clara."),
  "Fe+CuSO4": R(["FeSO4", "Cu"], "Fe(s) + CuSO4(aq) → FeSO4(aq) + Cu(s)", "safe", "color_change", 3, "Deslocamento simples: cobre metálico deposita-se e a solução azul clareia."),
  "Zn+CuSO4": R(["ZnSO4", "Cu"], "Zn(s) + CuSO4(aq) → ZnSO4(aq) + Cu(s)", "exothermic", "color_change", 5, "O zinco desloca o cobre; a cor azul desaparece."),
  "CaCO3+HCl": R(["CaCl2", "H2O", "CO2"], "CaCO3(s) + 2HCl(aq) → CaCl2(aq) + H2O(l) + CO2(g)", "safe", "bubbles", 1, "Carbonato reage com ácido produzindo CO2 (efervescência)."),
  "NaHCO3+CH3COOH": R(["CH3COONa", "H2O", "CO2"], "NaHCO3(s) + CH3COOH(aq) → CH3COONa(aq) + H2O(l) + CO2(g)", "endothermic", "bubbles", -3, "Bicarbonato + vinagre: espuma de CO2, temperatura cai levemente.", 6),
  "NaHCO3+HCl": R(["NaCl", "H2O", "CO2"], "NaHCO3(s) + HCl(aq) → NaCl(aq) + H2O(l) + CO2(g)", "safe", "bubbles", -1, "Neutralização com liberação de CO2."),
  "AgNO3+NaCl": R(["AgCl", "NaNO3"], "AgNO3(aq) + NaCl(aq) → AgCl(s)↓ + NaNO3(aq)", "safe", "precipitate", 0, "Forma-se precipitado branco de cloreto de prata."),
  "AgNO3+HCl": R(["AgCl", "HNO3"], "AgNO3(aq) + HCl(aq) → AgCl(s)↓ + HNO3(aq)", "safe", "precipitate", 0, "Precipitado branco de AgCl."),
  "KI+PbNO32": R(["PbI2", "KNO3"], "Pb(NO3)2(aq) + 2KI(aq) → PbI2(s)↓ + 2KNO3(aq)", "toxic", "precipitate", 0, "Chuva de ouro: precipitado amarelo de iodeto de chumbo (tóxico)."),
  "CuSO4+NaOH": R(["Cu(OH)2", "Na2SO4"], "CuSO4(aq) + 2NaOH(aq) → Cu(OH)2(s)↓ + Na2SO4(aq)", "safe", "precipitate", 1, "Forma-se precipitado azul de hidróxido de cobre."),
  "CO2+H2O": R(["H2CO3"], "CO2(g) + H2O(l) ⇌ H2CO3(aq)", "safe", "bubbles", 0, "Forma ácido carbônico fraco (água com gás).", 5),
  "NH3+HCl": R(["NH4Cl"], "NH3(g) + HCl(g) → NH4Cl(s)", "exothermic", "smoke", 5, "Fumaça branca de cloreto de amônio."),
  "NaOCl+NH3": R(["NH2Cl", "NaOH"], "NaOCl(aq) + NH3(aq) → NH2Cl(g) + NaOH(aq)", "toxic", "smoke", 2, "Libera cloraminas tóxicas — nunca misture lixívia com amônia."),
  "HCl+NaOCl": R(["Cl2", "NaCl", "H2O"], "NaOCl(aq) + 2HCl(aq) → Cl2(g) + NaCl(aq) + H2O(l)", "toxic", "smoke", 3, "Libera gás cloro tóxico — nunca misture lixívia com ácido."),
};

// Fuzzy matching for chemical names
const CHEMICAL_ALIASES: Record<string, string> = {
  water: "H2O",
  agua: "H2O",
  salt: "NaCl",
  "table salt": "NaCl",
  "sulfuric acid": "H2SO4",
  "battery acid": "H2SO4",
  "hydrochloric acid": "HCl",
  "muriatic acid": "HCl",
  "caustic soda": "NaOH",
  lye: "NaOH",
  alcohol: "C2H5OH",
  ethanol: "C2H5OH",
  methane: "CH4",
  "natural gas": "CH4",
  oxygen: "O2",
  hydrogen: "H2",
  sodium: "Na",
  sodio: "Na",
  potassium: "K", potassio: "K", magnesium: "Mg", magnesio: "Mg", zinc: "Zn", zinco: "Zn",
  iron: "Fe", ferro: "Fe", copper: "Cu", cobre: "Cu", "carbon dioxide": "CO2", "dioxido de carbono": "CO2",
  "calcium carbonate": "CaCO3", calcario: "CaCO3", "carbonato de calcio": "CaCO3",
  "baking soda": "NaHCO3", bicarbonato: "NaHCO3", "bicarbonato de sodio": "NaHCO3",
  vinegar: "CH3COOH", vinagre: "CH3COOH", "acido acetico": "CH3COOH", "acetic acid": "CH3COOH",
  "silver nitrate": "AgNO3", "nitrato de prata": "AgNO3", "copper sulfate": "CuSO4", "sulfato de cobre": "CuSO4",
  "potassium iodide": "KI", "iodeto de potassio": "KI", "lead nitrate": "PbNO32", "nitrato de chumbo": "PbNO32", "pb(no3)2": "PbNO32",
  ammonia: "NH3", amonia: "NH3", bleach: "NaOCl", lixivia: "NaOCl", "hipoclorito de sodio": "NaOCl",
  "acido cloridrico": "HCl", "acido sulfurico": "H2SO4", "hidroxido de sodio": "NaOH", "soda caustica": "NaOH",
  oxigenio: "O2", hidrogenio: "H2", metano: "CH4", etanol: "C2H5OH", sal: "NaCl", "cloreto de sodio": "NaCl",
};

const strip = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export const getChemicalByName = (name: string): ChemicalProperties | null => {
  if (!name) return null;
  const normalized = strip(name);
  const trimmed = name.trim();
  if (CHEMICALS[trimmed]) return CHEMICALS[trimmed];
  for (const [key, chem] of Object.entries(CHEMICALS)) {
    if (key.toLowerCase() === normalized) return chem;
  }
  
  // Alias match
  const formula = CHEMICAL_ALIASES[normalized];
  if (formula && CHEMICALS[formula]) {
    return CHEMICALS[formula];
  }
  
  // Fuzzy search in names
  for (const [key, chem] of Object.entries(CHEMICALS)) {
    if (normalized.length >= 3 && strip(chem.name).includes(normalized)) {
      return chem;
    }
  }
  
  return null;
};

export const checkCompatibility = (a: string, b: string): ReactionResult | null => {
  const chemA = getChemicalByName(a)?.formula ?? a;
  const chemB = getChemicalByName(b)?.formula ?? b;
  const key1 = `${chemA}+${chemB}`;
  const key2 = `${chemB}+${chemA}`;
  
  return REACTIONS[key1] || REACTIONS[key2] || null;
};

export const isHazardous = (name: string): boolean => {
  const chem = getChemicalByName(name);
  return chem?.hazardous || false;
};

export const isFlammable = (name: string): boolean => {
  const chem = getChemicalByName(name);
  return chem?.flammable || false;
};

export const getReactionEffects = (nodeA: string, nodeB: string): ReactionResult | null => {
  const chemA = getChemicalByName(nodeA);
  const chemB = getChemicalByName(nodeB);
  
  if (!chemA || !chemB) return null;
  
  return checkCompatibility(chemA.formula, chemB.formula);
};
