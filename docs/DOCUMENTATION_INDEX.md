# ModelForge Documentation Index

## 📚 Complete Documentation Suite

This repository contains comprehensive documentation of the ModelForge architecture. Here's your guide to all available documentation:

---

## 📄 Documentation Files

### 1. **ARCHITECTURE_DIAGRAMS.md**
**Visual architecture documentation with ASCII art diagrams**

Contains:
- System Architecture Overview
- Class Diagrams for:
  - Core Engine Architecture
  - Model Node Management
  - Graph Management
  - File Management
  - Input Data Processing
  - Model Controllers
- Sequence Diagrams for:
  - Model Creation & Training Workflow
  - Model Save & Load Workflow
  - Data Input Configuration Workflow
  - Code Generation Workflow
- Component Diagrams
- Data Flow Diagrams
- Deployment Architecture
- Design Patterns Overview
- Key Interfaces
- Dependencies

**Best For**: Understanding the overall structure and component relationships

---

### 2. **ARCHITECTURE_UML_MERMAID.md**
**Interactive UML diagrams using Mermaid syntax (auto-rendering on GitHub)**

Contains:
- Class Diagrams (Mermaid format):
  - Core Engine Architecture
  - Model Node Management
  - Graph Management
  - File Management
  - Input Data Processing
  - Model Controllers
- Sequence Diagrams
- State Diagrams
- Component Diagrams
- Use Case Diagram
- Entity Relationship Diagram
- Information Architecture

**Best For**: Visual learners, creating presentations, auto-rendering on GitHub/GitLab

---

### 3. **API_DOCUMENTATION.md**
**Complete API reference for developers**

Contains:
- IPC API Reference (all Electron IPC channels)
- Backend Service APIs (Controllers, Managers, Handlers)
- Frontend Component APIs (React components)
- Data Models (TypeScript interfaces)
- Integration Examples
- Error Handling Guide
- Best Practices

**Best For**: Integration, API usage, implementing new features

---

### 4. **DEVELOPMENT_GUIDE.md**
**Developer guide and architecture overview** (This file also serves as the main guide)

Contains:
- Directory Structure Overview
- Architecture Layers (7 layers)
- Key Design Patterns
- Data Flow Walkthrough
- Workflow Examples
- Error Handling Strategy
- Performance Considerations
- Testing Strategy
- Deployment Guide
- Troubleshooting
- Contributing Guidelines

**Best For**: Getting started, understanding architecture, implementation guidance

---

### 5. **README.md**
**Project overview and quick start guide**

Contains:
- Project description
- Key features
- Technology stack
- Installation instructions
- Running the application
- Project status

**Best For**: Quick overview, getting started

---

## 🎯 Quick Navigation

### For Different Use Cases:

#### 👨‍💻 **I want to understand the codebase**
1. Start: `README.md` (5 min read)
2. Then: `DEVELOPMENT_GUIDE.md` - Architecture Layers section (10 min)
3. Then: `ARCHITECTURE_DIAGRAMS.md` - System Overview section (15 min)

#### 🏗️ **I want to understand the architecture**
1. Start: `ARCHITECTURE_DIAGRAMS.md` (20 min)
2. Then: `ARCHITECTURE_UML_MERMAID.md` (15 min)
3. Then: `DEVELOPMENT_GUIDE.md` - Key Design Patterns section (10 min)

#### 💻 **I want to add a new feature**
1. Start: `DEVELOPMENT_GUIDE.md` - Architecture Layers section
2. Then: `API_DOCUMENTATION.md` - Available APIs section
3. Then: `DEVELOPMENT_GUIDE.md` - Workflow Examples section

#### 🔌 **I want to integrate with ModelForge**
1. Start: `API_DOCUMENTATION.md` - IPC API Reference (15 min)
2. Then: `API_DOCUMENTATION.md` - Data Models (10 min)
3. Then: `API_DOCUMENTATION.md` - Integration Examples (15 min)

#### 🐛 **I want to fix a bug**
1. Start: `DEVELOPMENT_GUIDE.md` - Troubleshooting section (5 min)
2. Then: `DEVELOPMENT_GUIDE.md` - Data Flow Walkthrough section (10 min)
3. Refer: `ARCHITECTURE_DIAGRAMS.md` for the specific component

#### 📦 **I want to deploy the application**
1. Start: `README.md` - Installation section
2. Then: `DEVELOPMENT_GUIDE.md` - Deployment section (10 min)

#### 📚 **I want to extend the codebase**
1. Start: `DEVELOPMENT_GUIDE.md` - Key Design Patterns section
2. Then: `DEVELOPMENT_GUIDE.md` - Workflow Examples section
3. Then: `API_DOCUMENTATION.md` for the relevant APIs

---

## 🏗️ Architecture at a Glance

```
┌─────────────────────────────────────────────────────┐
│           USER INTERFACE (React)                    │
│    Editor | Toolbar | Panels | Modals              │
└─────────────────────────────────────────────────────┘
                        ↓ IPC
┌─────────────────────────────────────────────────────┐
│     BACKEND SERVICES (Node.js)                      │
│  Controllers | Managers | Services                 │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│    CORE ENGINE (Code Generation)                    │
│  ModelData | CodeGenerators | InputHandlers         │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│   PYTHON RUNTIME (ML Execution)                     │
│  PyTorch | TensorFlow | NumPy | Pandas             │
└─────────────────────────────────────────────────────┘
```

---

## 📋 Key Components

### Frontend
- **Editor** - Main visual editor for model creation
- **Toolbar** - Training controls and actions
- **ParameterViewer** - Node property editor
- **DiagnosticViewer** - Training output logs
- **TrainingGraphs** - Live metrics visualization
- **InputModal** - Data configuration interface
- **HyperparameterModal** - Training settings

### Backend
- **ModelController** - Model lifecycle (train, save, load)
- **GraphController** - Graph structure management
- **Engine** - Code generation engine
- **FileManager** - File I/O operations
- **InputDataHandlers** - Data parsing and validation

### Data Management
- **ModelNodeManager** - Node state management (Singleton)
- **GraphDataManager** - Graph state management (Singleton)
- **HyperparametersMngr** - Training config management (Singleton)

### Code Generation
- **PyTorchCodeGenerator** - Generate PyTorch code
- **TensorFlowCodeGenerator** - Generate TensorFlow code (future)
- **AbstractCodeGenerator** - Base class for generators

---

## 🔄 Main Data Flow

```
User Input (Nodes, Connections) 
        ↓
Graph Management (ModelNodeManager)
        ↓
Model Configuration (GraphDataManager)
        ↓
Code Generation (Engine → Generators)
        ↓
File Storage (FileManager)
        ↓
Python Execution (Child Process)
        ↓
Output Processing (Log + Metrics)
        ↓
UI Updates (React Components)
```

---

## 📖 How to Read the Diagrams

### Class Diagrams
- **Boxes** represent classes
- **Arrows** show relationships
- **+** = public method/property
- **-** = private method/property
- **#** = protected method/property
- **Abstract** methods shown with italics

### Sequence Diagrams
- **Actors** on top (User, Components, Services)
- **Messages** flow downward with arrows
- **Boxes** show operations
- **Loops** show repetitive actions
- **Alt** shows conditional flows

### State Diagrams
- **States** are circles or boxes
- **Arrows** show transitions
- **Events** label the transitions
- **[*]** represents start/end states

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Electron, vis-network |
| **Backend** | Node.js, TypeScript, Electron Main |
| **ML Frameworks** | PyTorch, TensorFlow, Keras |
| **Data Processing** | NumPy, Pandas, Scikit-learn |
| **Build Tools** | Webpack, electron-builder |
| **Testing** | Jest, React Testing Library |

---

## 📚 Design Patterns Used

| Pattern | Where | Why |
|---------|-------|-----|
| **Singleton** | Data Managers | Centralized state |
| **Factory** | CodeGen, InputHandlers | Plugin architecture |
| **Strategy** | CodeGenerators, InputHandlers | Multiple implementations |
| **Observer** | IPC messages, UI updates | Event-driven architecture |
| **Builder** | Graph construction | Complex object creation |

---

## 🔍 Finding Things

### Need to find where...

**Models are trained?**
- Start: `ModelController.trainModel()` in `src/backend/controllers/ModelController.ts`
- See: DEVELOPMENT_GUIDE.md - Data Flow Walkthrough

**Nodes are managed?**
- Start: `ModelNodeManager` in `src/frontend/utils/graphMngr/ModelNodeManager.ts`
- See: ARCHITECTURE_DIAGRAMS.md - Model Node Management

**Python code is generated?**
- Start: `Engine.getPyCode()` in `src/backend/Core/Engine.ts`
- See: `PyTorchCodeGenerator` in `src/backend/Core/CodeGen/pyTrochCodeGen/`

**UI communicates with backend?**
- Start: `BackendService.ts` in `src/frontend/api/BackendService.ts`
- See: IPC handlers in `src/backend/ipc/ipcHandler.js`

**Input data is processed?**
- Start: `InputDataHandlerFactory` in `src/backend/Core/InputDataProcessing/InputDataHandlerFactory.ts`
- See: ARCHITECTURE_DIAGRAMS.md - Input Data Processing

**Models are saved/loaded?**
- Start: `FileManager` in `src/backend/Core/FileManager.ts`
- See: ARCHITECTURE_DIAGRAMS.md - File Management

---

## 📝 Documentation Maintenance

### When Adding Features
1. Update relevant architecture diagrams
2. Add new interfaces to API_DOCUMENTATION.md
3. Update DEVELOPMENT_GUIDE.md - Workflow Examples
4. Update README.md if user-facing

### When Changing Architecture
1. Update ARCHITECTURE_DIAGRAMS.md first
2. Update ARCHITECTURE_UML_MERMAID.md
3. Update DEVELOPMENT_GUIDE.md layers if changed
4. Verify all diagrams match actual code

### When Adding New APIs
1. Add to API_DOCUMENTATION.md - IPC API Reference or Backend Service APIs
2. Add data models to API_DOCUMENTATION.md - Data Models
3. Add example to API_DOCUMENTATION.md - Integration Examples
4. Update README.md if needed

---

## ❓ Common Questions

### Q: Where do I start to understand the project?
**A:** Start with README.md for overview, then DEVELOPMENT_GUIDE.md for architecture layers.

### Q: How does training work?
**A:** Read DEVELOPMENT_GUIDE.md - Data Flow Walkthrough, then see the training sequence diagram in ARCHITECTURE_DIAGRAMS.md.

### Q: Can I add a new layer type?
**A:** Yes! See DEVELOPMENT_GUIDE.md - Workflow Examples - Adding a New Layer Type.

### Q: How do I integrate with ModelForge?
**A:** Read API_DOCUMENTATION.md - IPC API Reference and Integration Examples.

### Q: Where are the tests?
**A:** See DEVELOPMENT_GUIDE.md - Testing Strategy and look for `__tests__` folders in `src/`.

### Q: How do I deploy?
**A:** See DEVELOPMENT_GUIDE.md - Deployment or README.md - Installation.

---

## 🚀 Quick Links

- [GitHub Repository](https://github.com/Jaimin020/ModelForge)
- [Main README](./README.md)
- [Development Guide](./DEVELOPMENT_GUIDE.md)
- [Architecture Diagrams](./ARCHITECTURE_DIAGRAMS.md)
- [UML Diagrams (Mermaid)](./ARCHITECTURE_UML_MERMAID.md)
- [API Documentation](./API_DOCUMENTATION.md)

---

## 📞 Support

### For Architecture Questions
- See DEVELOPMENT_GUIDE.md
- See ARCHITECTURE_DIAGRAMS.md
- See ARCHITECTURE_UML_MERMAID.md

### For API Questions
- See API_DOCUMENTATION.md
- See code examples in integration examples section

### For Implementation Questions
- See DEVELOPMENT_GUIDE.md - Workflow Examples
- See relevant component code in `src/`

### For Troubleshooting
- See DEVELOPMENT_GUIDE.md - Troubleshooting
- Check error handling section in API_DOCUMENTATION.md

---

## 📊 Documentation Statistics

| Document | Lines | Sections | Diagrams |
|----------|-------|----------|----------|
| ARCHITECTURE_DIAGRAMS.md | ~900 | 15 | 25+ |
| ARCHITECTURE_UML_MERMAID.md | ~800 | 12 | 20+ |
| API_DOCUMENTATION.md | ~1000 | 20 | 10+ |
| DEVELOPMENT_GUIDE.md | ~700 | 18 | 5+ |
| This Index | ~400 | 15 | - |
| **TOTAL** | **~3700** | **~80** | **60+** |

---

## 🎓 Learning Path

### Beginner Path (1-2 hours)
1. README.md (5 min)
2. ARCHITECTURE_DIAGRAMS.md - System Architecture Overview (15 min)
3. DEVELOPMENT_GUIDE.md - Architecture Layers (15 min)
4. Explore codebase with understanding (30 min)

### Intermediate Path (2-4 hours)
1. DEVELOPMENT_GUIDE.md (30 min)
2. ARCHITECTURE_UML_MERMAID.md (20 min)
3. API_DOCUMENTATION.md - IPC API Reference (20 min)
4. Implement a small feature (60 min)

### Advanced Path (4+ hours)
1. All documentation thoroughly (60 min)
2. API_DOCUMENTATION.md - All sections (30 min)
3. DEVELOPMENT_GUIDE.md - Workflow Examples (20 min)
4. Implement an advanced feature (60+ min)

---

## ✅ Checklist for New Developers

- [ ] Read README.md
- [ ] Read DEVELOPMENT_GUIDE.md
- [ ] Review ARCHITECTURE_DIAGRAMS.md
- [ ] Check ARCHITECTURE_UML_MERMAID.md
- [ ] Browse API_DOCUMENTATION.md
- [ ] Run `npm install`
- [ ] Run `npm start`
- [ ] Create a simple model in UI
- [ ] Read one key file (ModelController.ts recommended)
- [ ] Run unit tests
- [ ] Ask questions!

---

## 📞 Still Have Questions?

Refer to the specific documentation file:
- **Architecture Questions?** → ARCHITECTURE_DIAGRAMS.md
- **Implementation Questions?** → DEVELOPMENT_GUIDE.md
- **API Questions?** → API_DOCUMENTATION.md
- **Diagram Questions?** → ARCHITECTURE_UML_MERMAID.md

---

**Last Updated**: November 22, 2025
**Version**: 1.0.0
**Status**: Complete and Maintained
