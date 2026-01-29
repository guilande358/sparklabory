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
  type: "safe" | "exothermic" | "endothermic" | "explosive" | "toxic";
  description: string;
  effect?: "explosion" | "fire" | "smoke" | "bubbles" | "color_change" | "leak";
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
  Na: {
    name: "Sodium",
    formula: "Na",
    molarMass: 22.99,
    state: "solid",
    color: "#c0c0c0",
    hazardous: true,
    flammable: false,
    meltingPoint: 98,
    density: 0.97,
  },
};

// Reaction compatibility matrix
const REACTIONS: Record<string, ReactionResult> = {
  "Na+H2O": {
    products: ["NaOH", "H2"],
    type: "explosive",
    description: "Sodium reacts violently with water, producing hydrogen gas and heat",
    effect: "explosion",
  },
  "HCl+NaOH": {
    products: ["NaCl", "H2O"],
    type: "exothermic",
    description: "Neutralization reaction producing salt and water",
    effect: "bubbles",
  },
  "H2+O2": {
    products: ["H2O"],
    type: "explosive",
    description: "Hydrogen and oxygen combine explosively when ignited",
    effect: "explosion",
  },
  "CH4+O2": {
    products: ["CO2", "H2O"],
    type: "exothermic",
    description: "Methane combustion, releases heat and light",
    effect: "fire",
  },
  "C2H5OH+O2": {
    products: ["CO2", "H2O"],
    type: "exothermic",
    description: "Ethanol combustion",
    effect: "fire",
  },
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
};

export const getChemicalByName = (name: string): ChemicalProperties | null => {
  const normalized = name.toLowerCase().trim();
  
  // Direct formula match
  if (CHEMICALS[name.toUpperCase()]) {
    return CHEMICALS[name.toUpperCase()];
  }
  
  // Alias match
  const formula = CHEMICAL_ALIASES[normalized];
  if (formula && CHEMICALS[formula]) {
    return CHEMICALS[formula];
  }
  
  // Fuzzy search in names
  for (const [key, chem] of Object.entries(CHEMICALS)) {
    if (chem.name.toLowerCase().includes(normalized)) {
      return chem;
    }
  }
  
  return null;
};

export const checkCompatibility = (chemA: string, chemB: string): ReactionResult | null => {
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
