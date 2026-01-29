
# Virtual Laboratory Redesign: 2D Designer + 3D Simulation Preview

## Overview

Transform the Virtual Laboratory into a professional two-stage scientific simulation environment:

1. **Stage 1 - 2D Designer**: A draw.io-style canvas where users create project diagrams using draggable automation blocks representing substances, molecules, equipment, and processes
2. **Stage 2 - 3D Preview**: A real-time 3D renderer that simulates the designed project with realistic effects (explosions, leaks, reactions, temperature changes)

---

## Architecture

```text
+--------------------------------------------------+
|              VIRTUAL LABORATORY                   |
+--------------------------------------------------+
|  [2D Designer]  |  [3D Preview]  |  [Settings]   |
+--------------------------------------------------+
|                                                   |
|  +-------------------------------------------+   |
|  |         CANVAS / 3D VIEWPORT              |   |
|  |                                           |   |
|  |   (Stage 1: Drag-drop diagram editor)     |   |
|  |   (Stage 2: Real-time 3D simulation)      |   |
|  |                                           |   |
|  +-------------------------------------------+   |
|                                                   |
|  +----------------+  +------------------------+   |
|  | BLOCK PALETTE  |  | PROPERTIES PANEL       |   |
|  | - Chemicals    |  | - Block settings       |   |
|  | - Equipment    |  | - Connections          |   |
|  | - Molecules    |  | - Simulation params    |   |
|  +----------------+  +------------------------+   |
+--------------------------------------------------+
```

---

## Implementation Details

### Phase 1: Database Schema Updates

Create a new table to store diagram designs:

**Table: `lab_designs`**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| project_id | uuid | FK to projects |
| user_id | uuid | Owner |
| name | text | Design name |
| nodes | jsonb | Array of blocks/nodes |
| edges | jsonb | Array of connections |
| simulation_config | jsonb | 3D simulation settings |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update |

**Node Structure (JSONB)**:
```text
{
  id: string,
  type: "chemical" | "equipment" | "molecule" | "process" | "output",
  label: string,
  position: { x: number, y: number },
  data: {
    substance?: string,
    quantity?: number,
    unit?: string,
    temperature?: number,
    properties?: object
  }
}
```

**Edge Structure (JSONB)**:
```text
{
  id: string,
  source: string,
  target: string,
  label?: string,
  type: "flow" | "reaction" | "heat" | "connection"
}
```

---

### Phase 2: 2D Designer Component

**New Components:**

1. **`DiagramCanvas.tsx`** - Main canvas container using HTML5 Canvas
   - Grid background with snap-to-grid
   - Pan and zoom controls
   - Selection and multi-select support

2. **`BlockPalette.tsx`** - Sidebar with draggable blocks
   - Categories: Chemicals, Equipment, Molecules, Processes, Outputs
   - Search/filter functionality
   - Custom block creation (user types name, system recognizes)

3. **`DiagramBlock.tsx`** - Individual block component
   - Draggable positioning
   - Connection ports (input/output)
   - Label editing
   - Color-coded by type

4. **`ConnectionLine.tsx`** - Visual connections between blocks
   - Bezier curves for smooth lines
   - Arrow indicators for flow direction
   - Click to select/delete

5. **`BlockPropertiesPanel.tsx`** - Edit block properties
   - Name/label editing
   - Quantity and units
   - Temperature settings
   - Custom properties

**Block Categories:**
| Category | Examples | Icon |
|----------|----------|------|
| Chemicals | H2O, NaCl, H2SO4, Custom | Beaker |
| Equipment | Bunsen Burner, Flask, Condenser | FlaskConical |
| Molecules | DNA, Proteins, Enzymes | Atom |
| Processes | Heating, Mixing, Filtering | Cog |
| Outputs | Result, Measurement, Report | FileOutput |

---

### Phase 3: 3D Simulation Preview

**Enhanced `Simulation3D.tsx`:**

1. **Scene Generation from Diagram**
   - Parse nodes and edges from diagram
   - Create 3D meshes for each block type
   - Position based on diagram layout
   - Animate connections as particle flows

2. **Simulation Effects:**
   | Effect | Trigger | Visual |
   |--------|---------|--------|
   | Explosion | Incompatible chemicals | Particle burst + shake + flash |
   | Leak/Spill | Container overflow | Liquid particles falling |
   | Combustion | Heat + flammable | Fire particles + smoke |
   | Reaction | Chemical combination | Color change + bubbles |
   | Temperature | Heat transfer | Glow effect (red=hot, blue=cold) |

3. **Simulation Controls:**
   - Play/Pause/Reset
   - Speed control (0.1x to 5x)
   - Step-by-step mode
   - Camera controls (orbit, zoom, pan)

4. **Real-time Feedback:**
   - Status indicators on each element
   - Warning messages for dangerous combinations
   - AI suggestions via Lovable Chat integration

---

### Phase 4: Simulation Engine

**New File: `src/lib/simulationEngine.ts`**

```text
SimulationEngine
├── parseDesign(nodes, edges)
├── validateConnections()
├── calculateReactions()
├── runSimulation(timeStep)
├── getSimulationState()
└── triggerEffect(type, position)

ChemicalDatabase
├── getProperties(name)
├── checkCompatibility(a, b)
├── getReactionResult(a, b)
└── isHazardous(name)
```

**Chemical Recognition System:**
- Built-in database of common chemicals/molecules
- Fuzzy matching for user input (e.g., "water" = "H2O")
- AI-assisted identification for unknown substances
- Warning system for dangerous combinations

---

### Phase 5: UI/UX Improvements

1. **Responsive Layout:**
   - Desktop: Side-by-side panels
   - Tablet: Collapsible panels
   - Mobile: Tab-based navigation

2. **Keyboard Shortcuts:**
   - Delete: Remove selected
   - Ctrl+Z: Undo
   - Ctrl+S: Save
   - Space: Pan mode
   - R: Run simulation

3. **Toolbar:**
   - Save/Load designs
   - Export as image/PDF
   - Share design
   - Undo/Redo
   - Zoom controls

---

### Phase 6: Integration

1. **Project Connection:**
   - Link designs to existing projects
   - Save simulation results to project
   - Generate reports from simulations

2. **AI Assistant Integration:**
   - Contextual help during design
   - Suggestions for experiment improvements
   - Explanation of simulation results
   - Safety warnings

---

## File Structure

```text
src/
├── components/
│   └── lab/
│       ├── designer/
│       │   ├── DiagramCanvas.tsx
│       │   ├── BlockPalette.tsx
│       │   ├── DiagramBlock.tsx
│       │   ├── ConnectionLine.tsx
│       │   ├── BlockPropertiesPanel.tsx
│       │   └── DesignerToolbar.tsx
│       ├── simulation/
│       │   ├── Simulation3DPreview.tsx
│       │   ├── SimulationControls.tsx
│       │   ├── EffectsRenderer.tsx
│       │   └── SimulationStatus.tsx
│       ├── Simulation2D.tsx (refactor)
│       ├── Simulation3D.tsx (refactor)
│       └── ExternalSimulatorConfig.tsx
├── lib/
│   ├── simulationEngine.ts
│   ├── chemicalDatabase.ts
│   └── diagramUtils.ts
├── hooks/
│   ├── useDiagramEditor.ts
│   └── useSimulation.ts
└── pages/
    └── VirtualLab.tsx (major update)
```

---

## Technical Considerations

1. **No External Dependencies for Diagram Editor**
   - Custom implementation using HTML5 Canvas + React
   - Avoids complex library dependencies
   - Full control over behavior and styling

2. **Three.js for 3D (Already Installed)**
   - Continue using existing Three.js setup
   - Add particle systems for effects
   - Implement post-processing for visual effects

3. **Performance Optimization**
   - Throttle simulation updates
   - Use Web Workers for heavy calculations
   - Lazy load 3D assets

4. **Data Persistence**
   - Auto-save to database
   - Local storage backup
   - Export/import JSON files

---

## Implementation Order

1. Database migration for `lab_designs` table
2. Basic diagram canvas with grid and pan/zoom
3. Block palette with draggable blocks
4. Block placement and connection system
5. Properties panel for block editing
6. Save/load functionality
7. 3D preview generation from diagram
8. Basic simulation effects
9. Advanced effects (explosions, leaks, etc.)
10. AI integration for suggestions
11. Polish and responsive design
