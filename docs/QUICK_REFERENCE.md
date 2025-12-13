# ModelForge Architecture - Quick Reference Card

## 📊 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODELFORGE SYSTEM                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  PRESENTATION LAYER (React + Electron Renderer)                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Editor | Dashboard | Training View | Input Modal         │  │
│  │ Toolbar | Parameter Viewer | Diagnostic Viewer           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                            ↓ IPC                                 │
│  SERVICE LAYER (State Management & APIs)                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ModelNodeManager | GraphDataManager | BackendService     │  │
│  │ HyperparametersMngr | File Operations                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                            ↓                                     │
│  BUSINESS LOGIC LAYER (Electron Main)                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ModelController | GraphController | Engine               │  │
│  │ FileManager | InputDataHandlers                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                            ↓                                     │
│  TRANSFORMATION LAYER (Data Processing)                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ModelData | CodeGenerators | InputDataHandlers           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  PYTHON EXECUTION LAYER                                          │
│  ├─ PyTorch/TensorFlow: Model Training                          │
│  ├─ NumPy/Pandas: Data Processing                              │
│  ├─ Scikit-learn: Preprocessing                                │
│  └─ Output: Weights + Logs                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Component Relationships

```
USER INTERFACE
    ├── Editor (Main Canvas)
    │   ├─→ ModelNodeManager (Node Management)
    │   ├─→ GraphDataManager (Graph State)
    │   └─→ HyperparametersMngr (Training Config)
    │
    ├── InputModal
    │   └─→ InputDataHandlerFactory
    │       ├─→ TabularInputDataHandler
    │       └─→ ImageInputDataHandler
    │
    ├── Toolbar
    │   ├─→ ModelController (Train/Save/Load)
    │   ├─→ FileManager (File Operations)
    │   └─→ Python Process (Execution)
    │
    └── Diagnostic Viewer
        └─→ Training Output Parser

BACKEND SERVICES
    ├── ModelController
    │   ├─→ GraphController
    │   ├─→ Engine
    │   └─→ FileManager
    │
    ├── Engine
    │   ├─→ ModelData
    │   └─→ CodeGenerators
    │       ├─→ PyTorchCodeGenerator
    │       └─→ TensorFlowCodeGenerator
    │
    └── GraphController
        ├─→ CycleDetector
        └─→ ValidationEngine
```

---

## 🔄 Key Data Flows

### Training Flow
```
Click Train
    ↓
Gather Model Data (nodes + edges + hyperparams)
    ↓
Validate Graph (cycles, connectivity)
    ↓
Generate Python Code (Engine)
    ↓
Save Generated Script (FileManager)
    ↓
Spawn Python Process
    ↓
Load Data (InputDataHandler)
    ↓
Build & Train Model (PyTorch/TensorFlow)
    ↓
Parse Output (Logs + Metrics)
    ↓
Update UI (Charts + Diagnostics)
```

### Save/Load Flow
```
Save Model
    ↓
Serialize Graph (nodes + edges + hyperparams)
    ↓
Choose File Path (FileDialog)
    ↓
Write to Disk (FileManager)
    ↓
Notify User (Success)

Load Model
    ↓
Choose File Path (FileDialog)
    ↓
Read from Disk (FileManager)
    ↓
Parse JSON (Graph Reconstruction)
    ↓
Restore UI State (Redraw Network)
```

---

## 📚 Key Classes & Interfaces

### Core Managers
```
ModelNodeManager (Singleton)
├─ Create/Update/Delete Nodes
├─ Manage Parameters
└─ Store in Map<id, ModelNode>

GraphDataManager (Singleton)
├─ Store Nodes & Edges
├─ Manage Hyperparameters
└─ Export Graph as JSON

HyperparametersMngr (Singleton)
├─ Store Training Parameters
└─ Manage Optimization Config

FileManager (Singleton)
├─ Read/Write Files
├─ Directory Operations
└─ Dataset Analysis
```

### Core Services
```
ModelController
├─ trainModel(graph)
├─ saveModel(graph, path)
├─ loadModel(path)
└─ setupModelForInference(path)

GraphController
├─ setGraphData(graph)
├─ validateGraph()
├─ detectCycles()
└─ getLayerSequence()

Engine
├─ getPyCode()
├─ getLayerData()
└─ getInputData()
```

### Code Generation
```
AbstractCodeGenerator (Abstract)
├─ getImports()
├─ getInput()
├─ getModel()
├─ getHyperparameters()
├─ getTrainingLoop()
└─ getSaveModel()

PyTorchCodeGenerator : AbstractCodeGenerator
└─ Implements all methods for PyTorch

TensorFlowCodeGenerator : AbstractCodeGenerator
└─ Implements all methods for TensorFlow
```

### Input Processing
```
InputDataHandlerFactory
└─ createHandler(inputData)

AbstractInputDataHandler (Abstract)
├─ extractInputData()
└─ validateInputData()

TabularInputDataHandler : AbstractInputDataHandler
├─ parseCSV()
├─ parseExcel()
└─ normalizeFeatures()

ImageInputDataHandler : AbstractInputDataHandler
├─ analyzeImageFolder()
└─ validateImageFormats()
```

---

## 🏛️ Design Patterns

| Pattern | Used For | Example |
|---------|----------|---------|
| **Singleton** | Single instance needed | ModelNodeManager, FileManager |
| **Factory** | Multiple implementations | InputDataHandlerFactory |
| **Strategy** | Runtime selection | CodeGenerators, InputHandlers |
| **Observer** | Event-driven updates | IPC message handlers |
| **Builder** | Complex construction | GraphBuilder, ModelBuilder |

---

## 📁 Directory Quick Map

```
src/
├── backend/                    # Backend logic
│   ├── controllers/           # Model & Graph controllers
│   ├── Core/                  # Core services
│   │   ├── Engine.ts
│   │   ├── FileManager.ts
│   │   ├── CodeGen/          # Code generators
│   │   └── InputDataProcessing/  # Data handlers
│   ├── services/              # Business services
│   └── ipc/                   # IPC communication
│
├── frontend/                  # Frontend (React)
│   ├── components/           # UI components
│   ├── modules/              # Feature modules
│   │   ├── Workspace/        # Editor module
│   │   ├── Dashboard/        # Home module
│   │   ├── InputModal/       # Data config
│   │   └── TranningGraph/    # Training view
│   └── utils/                # Frontend utilities
│       ├── graphMngr/        # Node management
│       ├── graphUtils/       # Graph utilities
│       └── Editor/           # Editor utilities
│
├── interface/                # Shared TypeScript interfaces
└── main/                     # Electron main process
```

---

## 🔌 IPC Channels (Communication)

```
Training
├── trainModel(graph) → { success, metrics }
├── stopPython() → { success }
└── onDialogUpdate(message) ← Training output

Model Management
├── saveModel(graph, path) → { success }
├── loadModel(path) → { success, modelGraph }
└── exportCode() → { success, code }

File Operations
├── openFile() → { filePaths }
├── saveFileAs() → { filePath }
├── readFile(path) → { content }
└── writeFile(path, content) → { success }

Data Processing
├── analyzeDataset(path) → { metadata }
├── validateData(data) → { isValid, errors }
└── preprocessData(data) → { processed }
```

---

## 🧪 Testing Areas

```
Unit Tests
├── Components (Editor, Toolbar, Modals)
├── Services (Controllers, Managers)
├── Utilities (CodeGen, DataHandlers)
└── Interfaces (Type validation)

Integration Tests
├── IPC Communication
├── Backend Services
├── UI State Management
└── File Operations

E2E Tests
├── Full Training Workflow
├── Model Save/Load
├── Data Configuration
└── Error Scenarios
```

---

## 🚀 Development Workflow

### Adding a New Feature

```
1. Plan
   └─ Understand architecture layer
   
2. Design
   ├─ Identify components affected
   ├─ Define interfaces
   └─ Update diagrams

3. Implement
   ├─ Backend logic
   ├─ Frontend UI
   ├─ IPC communication
   └─ Error handling

4. Test
   ├─ Unit tests
   ├─ Integration tests
   └─ Manual testing

5. Document
   ├─ Update diagrams
   ├─ Update API docs
   └─ Add examples

6. Review & Deploy
   ├─ Code review
   ├─ Build & test
   └─ Release
```

---

## 📊 Key Metrics

| Aspect | Value |
|--------|-------|
| **Total Lines of Code** | ~15,000+ |
| **Documentation Lines** | ~4,100 |
| **Frontend Components** | ~20+ |
| **Backend Services** | ~8+ |
| **Data Handlers** | 2+ |
| **Code Generators** | 2+ |
| **Design Patterns** | 5 |
| **Architecture Layers** | 7 |

---

## 🎓 Learning Resources

| Topic | Document | Time |
|-------|----------|------|
| Quick Overview | README.md | 5 min |
| Architecture | ARCHITECTURE_DIAGRAMS.md | 20 min |
| UML Diagrams | ARCHITECTURE_UML_MERMAID.md | 15 min |
| API Reference | API_DOCUMENTATION.md | 30 min |
| Development | DEVELOPMENT_GUIDE.md | 20 min |
| **Total** | **All Docs** | **~90 min** |

---

## ✅ Checklist for Implementation

- [ ] Understand the architecture layer
- [ ] Identify affected components
- [ ] Check existing patterns
- [ ] Review API documentation
- [ ] Plan the implementation
- [ ] Implement backend logic
- [ ] Implement frontend UI
- [ ] Add error handling
- [ ] Write tests
- [ ] Update documentation
- [ ] Code review
- [ ] Merge to main

---

## 🔍 Debugging Guide

```
Issue: Graph Not Rendering
├─ Check: GraphDataManager state
├─ Check: Network canvas initialization
├─ Check: Node positioning
└─ Log: nodes and edges in console

Issue: Model Not Training
├─ Check: Graph validation
├─ Check: Cycle detection
├─ Check: Python process spawning
└─ Check: Model code generation

Issue: Data Not Loading
├─ Check: File path
├─ Check: File format
├─ Check: InputDataHandler
└─ Check: Data validation

Issue: UI Not Updating
├─ Check: IPC message delivery
├─ Check: React state update
├─ Check: Component re-render
└─ Check: Browser console errors
```

---

## 📝 Common Commands

```bash
# Development
npm start                 # Start dev server
npm run start:main       # Start main process
npm run start:preload    # Start preload script

# Building
npm run build            # Build for production
npm run package          # Create installer

# Testing
npm test                 # Run all tests
npm test -- --coverage  # With coverage

# Linting
npm run lint            # Check code style
npm run lint:fix        # Auto-fix issues

# Cleanup
npm run clean           # Remove build files
rm -rf node_modules     # Clear dependencies
npm install             # Reinstall dependencies
```

---

## 📞 Quick Help

**How to use this card?**
1. Find your use case
2. Follow the flow
3. Check the document
4. Implement or debug

**Need more details?**
- Architecture questions → ARCHITECTURE_DIAGRAMS.md
- API questions → API_DOCUMENTATION.md  
- Implementation help → DEVELOPMENT_GUIDE.md
- UML diagrams → ARCHITECTURE_UML_MERMAID.md

**Getting stuck?**
1. Check the Debugging Guide above
2. Review the relevant documentation
3. Look at similar code in the repo
4. Ask in discussions/issues

---

## 🎯 Success Criteria

Your implementation is good if:
- ✅ Follows existing architecture patterns
- ✅ Maintains separation of concerns
- ✅ Includes error handling
- ✅ Has tests
- ✅ Updates documentation
- ✅ Passes code review
- ✅ Works as intended

---

## 📋 Resources at a Glance

```
Quick Reference
├── This file (Reference Card)
└── You are here!

Architecture
├── ARCHITECTURE_DIAGRAMS.md (ASCII + descriptions)
└── ARCHITECTURE_UML_MERMAID.md (Interactive diagrams)

Development
├── DEVELOPMENT_GUIDE.md (Main guide)
├── API_DOCUMENTATION.md (API reference)
└── README.md (Quick start)

Navigation
└── DOCUMENTATION_INDEX.md (Complete index)
```

---

**Last Updated**: November 22, 2025  
**Version**: 1.0.0  
**For**: ModelForge Development Team

Keep this card handy for quick reference! 📌
