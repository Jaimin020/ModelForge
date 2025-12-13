# ModelForge Architecture Documentation

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Class Diagrams](#class-diagrams)
3. [Sequence Diagrams](#sequence-diagrams)
4. [Component Diagrams](#component-diagrams)
5. [Data Flow Diagrams](#data-flow-diagrams)
6. [Deployment Architecture](#deployment-architecture)

---

## System Architecture

### High-Level System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODELFORGE APPLICATION                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              ELECTRON MAIN PROCESS                       │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │   Window Manager & IPC Handler                    │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                          ↓                               │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │   Backend Controllers & Services                  │  │   │
│  │  │   - ModelController                              │  │   │
│  │  │   - GraphController                              │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              RENDERER PROCESS (React)                    │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  UI Modules:                                       │  │   │
│  │  │  - Editor (Network Canvas, Nodes, Edges)          │  │   │
│  │  │  - InputModal (Data Configuration)                │  │   │
│  │  │  - HyperparameterModal                            │  │   │
│  │  │  - TrainingGraphs (Live Metrics)                  │  │   │
│  │  │  - DiagnosticViewer (Training Logs)               │  │   │
│  │  │  - Dashboard                                      │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                          ↓
        ┌──────────────────────────────────────────┐
        │   Python Runtime (PyTorch/TensorFlow)    │
        │   - Model Execution                      │
        │   - Training Loop                        │
        │   - Code Generation & Execution          │
        └──────────────────────────────────────────┘
                          ↓
        ┌──────────────────────────────────────────┐
        │   File System & Data Storage             │
        │   - Model Files (.mff)                   │
        │   - Generated Python Code                │
        │   - Trained Weights (.pt, .h5)           │
        │   - Datasets (CSV, Images)               │
        └──────────────────────────────────────────┘
```

---

## Class Diagrams

### 1. Core Architecture Classes

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       CORE ENGINE ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐
│      Engine                  │
├──────────────────────────────┤
│ - modelDataObj               │
│ - codeGenerator              │
├──────────────────────────────┤
│ + constructor()              │
│ + getPyCode(): string        │
│ + getLayerData()             │
│ + getInputData()             │
│ - createCodeGenerator()      │
└──────────────────────────────┘
         │
         │ uses
         ↓
┌──────────────────────────────┐         ┌─────────────────────────────────┐
│   ModelData                  │ ─────→  │   AbstractCodeGenerator         │
├──────────────────────────────┤         ├─────────────────────────────────┤
│ - layers                     │         │ # modelData                     │
│ - hyperparameters            │         │ # hyperparameters              │
│ - inputData                  │         │ # inputData                    │
│ - lossFunction               │         │ # lossFunction                 │
├──────────────────────────────┤         ├─────────────────────────────────┤
│ + generateModelData()        │         │ + getImports(): string          │
│ + getLayersData()            │         │ + getInput(): string            │
│ + getHyperparameters()       │         │ + getModel(): string            │
│ + getInputData()             │         │ + getHyperparameters(): string  │
│ + getLossFunction()          │         │ + getTrainingLoop(): string     │
└──────────────────────────────┘         │ + getSaveModel(): string        │
                                         │ + generateCode(): string        │
                                         └─────────────────────────────────┘
                                                    ▲
                                                    │ implements
                                                    │
                                    ┌───────────────┴───────────────┐
                                    │                               │
                    ┌───────────────────────────┐   ┌──────────────────────────┐
                    │ PyTorchCodeGenerator      │   │ TensorFlowCodeGenerator  │
                    ├───────────────────────────┤   ├──────────────────────────┤
                    │ + getImports()            │   │ + getImports()           │
                    │ + getInput()              │   │ + getInput()             │
                    │ + getModel()              │   │ + getModel()             │
                    │ + getHyperparameters()    │   │ + getHyperparameters()   │
                    │ + getTrainingLoop()       │   │ + getTrainingLoop()      │
                    │ + getSaveModel()          │   │ + getSaveModel()         │
                    └───────────────────────────┘   └──────────────────────────┘
```

### 2. Model Management Classes

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MODEL NODE MANAGEMENT ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┐
│   ModelNodeManager               │
│   (Singleton)                    │
├──────────────────────────────────┤
│ - nodes: Map<int, ModelNode>     │
│ - instance: ModelNodeManager     │
├──────────────────────────────────┤
│ + getInstance()                  │
│ + createNode()                   │
│ + updateNode()                   │
│ + getNode()                      │
│ + deleteNode()                   │
│ + getAllNodes()                  │
│ + updateNodeParameter()          │
│ + updateMultipleNodeParameters() │
│ + getNodesByFramework()          │
│ + clearAllNodes()                │
└──────────────────────────────────┘
         │
         │ manages
         ↓
┌──────────────────────────────────┐
│   ModelNode                      │
│   (Interface)                    │
├──────────────────────────────────┤
│ + id: number                     │
│ + feature: string                │
│ + label: string                  │
│ + framework: 'PyTorch'|'TF'      │
│ + nodeType: string               │
│ + parameters: Parameter[]        │
│ + position: {x, y}               │
│ + isConfigured: boolean          │
│ + metadata: object               │
└──────────────────────────────────┘
         │
         │ contains
         ↓
┌──────────────────────────────────┐
│   Parameter                      │
│   (Interface)                    │
├──────────────────────────────────┤
│ + name: string                   │
│ + value: any                     │
│ + type: string                   │
│ + description: string            │
│ + isRequired: boolean            │
│ + constraints: object            │
└──────────────────────────────────┘


┌──────────────────────────────────┐
│   GraphDataManager               │
│   (Singleton)                    │
├──────────────────────────────────┤
│ - nodes: ModelNode[]             │
│ - edges: Edge[]                  │
│ - hyperparameters: object        │
│ - instance: GraphDataManager     │
├──────────────────────────────────┤
│ + getInstance()                  │
│ + setNodes()                     │
│ + setEdges()                     │
│ + setHyperparameters()           │
│ + getGraphDataAsJson()           │
│ + clearAllNodesAndEdges()        │
│ + getLayerSequence()             │
│ + validateGraph()                │
└──────────────────────────────────┘
```

### 3. File Management & Controllers

```
┌─────────────────────────────────────────────────────────────────────────┐
│                  FILE MANAGEMENT & CONTROLLER ARCHITECTURE               │
└─────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────┐
│   FileManager                 │
│   (Singleton)                 │
├───────────────────────────────┤
│ - instance: FileManager       │
├───────────────────────────────┤
│ + getInstance()               │
│ + saveFile()                  │
│ + readFile()                  │
│ + deleteFile()                │
│ + renameFile()                │
│ + fileExists()                │
│ + createDirectory()            │
│ + getFileExtension()          │
│ + getFileName()               │
│ + analyzeImageDatasetFolder() │
└───────────────────────────────┘


┌───────────────────────────────┐         ┌──────────────────────────────┐
│   ModelController             │────────→│   GraphController            │
├───────────────────────────────┤         ├──────────────────────────────┤
│ - graphController             │         │ - nodes                      │
│ - fileMngr                    │         │ - edges                      │
├───────────────────────────────┤         │ - hyperparameters            │
│ + trainModel()                │         ├──────────────────────────────┤
│ + saveModel()                 │         │ + setGraphData()             │
│ + loadModel()                 │         │ + getLayerSequence()         │
│ + setupModelForInference()    │         │ + getHyperparameters()       │
│                               │         │ + validateGraph()            │
│                               │         │ + detectCycles()             │
│                               │         │ + analyzeDependencies()      │
└───────────────────────────────┘         └──────────────────────────────┘
         │                                          │
         │ uses Engine                             │ creates
         ↓                                          ↓
┌───────────────────────────────┐         ┌──────────────────────────────┐
│   Engine                      │         │   LayerSequence              │
└───────────────────────────────┘         │   (Class/Interface)          │
                                          └──────────────────────────────┘
```

### 4. Input Data Processing

```
┌─────────────────────────────────────────────────────────────────────────┐
│              INPUT DATA PROCESSING ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────┐
│   InputDataHandlerFactory          │
├────────────────────────────────────┤
│ + createHandler()                  │
│ + supportedTypes: string[]         │
└────────────────────────────────────┘
         │
         │ creates
         ↓
┌──────────────────────────────────┐          ┌────────────────────────────────┐
│ AbstractInputDataHandler         │ ────────→│ InputDataResult / ValidationResult
├──────────────────────────────────┤          │ (Interfaces)
│ # inputData                      │          └────────────────────────────────┘
├──────────────────────────────────┤
│ + extractInputData()             │
│ + validateInputData()            │
│ # findParameter()                │
└──────────────────────────────────┘
         ▲
         │ implements
         │
    ┌────┴──────────────────────────────┐
    │                                    │
┌────────────────────────────────┐   ┌─────────────────────────────┐
│ TabularInputDataHandler        │   │ ImageInputDataHandler       │
├────────────────────────────────┤   ├─────────────────────────────┤
│ + extractInputData()           │   │ + extractInputData()        │
│ + validateInputData()          │   │ + validateInputData()       │
│ - parseCSV()                   │   │ - analyzeImageFolder()      │
│ - parseExcel()                 │   │ - validateImageFormats()    │
│ - handleMissingValues()        │   │ - extractImageMetadata()    │
│ - normalizeFeatures()          │   └─────────────────────────────┘
└────────────────────────────────┘
```

---

## Sequence Diagrams

### 1. Model Creation & Training Workflow

```
User                Editor UI          Backend          Python Runtime
│                     │                  │                    │
│── Drag Nodes ──────→│                  │                    │
│                     │                  │                    │
│                     │────→ Create Node────→ ModelNodeMgr   │
│                     │                  │     Updates Graph  │
│                     │←─────────────────│                    │
│                     │                  │                    │
│── Connect Edges ───→│                  │                    │
│                     │────→ Add Edge────→ GraphDataMgr     │
│                     │                  │     Stores Edge   │
│                     │←─────────────────│                    │
│                     │                  │                    │
│── Configure Input ──→│ Show Input Modal │                   │
│                     │                  │                    │
│── Select Data ──────→│────────────────→ Process Input      │
│                     │   Save Config   │                    │
│                     │                  │                    │
│── Set Hyperparams ──→│ Show Hyperparams Modal              │
│                     │                  │                    │
│── Click Train ──────→│ Save Model State│                    │
│                     │                  │                    │
│                     │────────────────→ ModelController     │
│                     │                  │                    │
│                     │                  │─→ Engine          │
│                     │                  │    Generate Code  │
│                     │                  │←──              │
│                     │                  │                    │
│                     │                  │───→ FileManager  │
│                     │                  │     Save .py      │
│                     │                  │←──                │
│                     │                  │                    │
│                     │                  │──────────────────→ Execute Python
│                     │                  │                    │ Train Model
│                     │                  │←─── Output ──────│
│                     │←─────────────────│                    │
│                     │ Append Log       │                    │
│                     │ Update Graphs    │                    │
│                     │                  │                    │
```

### 2. Model Save & Load Workflow

```
User                Editor UI        Backend          FileManager
│                     │                │                  │
│── Click Save ──────→│ Gather Graph  │                  │
│                     │ & Node Data    │                  │
│                     │                │                  │
│── Select Path ──────→ FileDialog     │                  │
│                     │ Returns Path   │                  │
│                     │                │                  │
│                     │──────→ ModelController           │
│                     │        saveModel()               │
│                     │                │                  │
│                     │                │──────────────→ saveFile()
│                     │                │  Serialize JSON │
│                     │                │←────────────────│
│                     │←────────────────│ Success         │
│                     │ Show Message   │                  │
│                     │                │                  │
│                     │                │                  │
│── Click Load ──────→│ FileDialog     │                  │
│                     │ Returns Path   │                  │
│                     │                │                  │
│                     │──────→ ModelController           │
│                     │        loadModel()               │
│                     │                │                  │
│                     │                │──────────────→ readFile()
│                     │                │  Returns JSON    │
│                     │                │←────────────────│
│                     │←────────────────│ Parse & Return │
│                     │ Restore Graph  │                  │
│                     │ & Nodes        │                  │
│                     │ Redraw Network │                  │
│                     │                │                  │
```

### 3. Data Input Configuration Workflow

```
User            InputModal          InputDataHandlerFactory    Handler        Backend
│                 │                          │                   │             │
│─ Select Data ──→│                          │                   │             │
│  Type          │                          │                   │             │
│                 │                          │                   │             │
│─ Choose File ──→│                          │                   │             │
│ or Folder      │──────────────────────→ createHandler()      │             │
│                 │                          │ Analyze Data     │             │
│                 │                          │─────────────────→│             │
│                 │                          │←─────────────────│             │
│                 │                          │ Return Metadata  │             │
│                 │←──────────────────────────────────────────────│             │
│                 │ Display Options           │                   │             │
│  (Features,     │                          │                   │             │
│   Classes,      │                          │                   │             │
│   Splits)       │                          │                   │             │
│                 │                          │                   │             │
│─ Configure ────→│                          │                   │             │
│ Settings       │                          │                   │             │
│                 │                          │                   │             │
│─ Click Submit ──→│────────────────────────────────────────────────→ Save Config
│                 │                          │                   │             │
│                 │←───────────────────────── All Set ──────────────────────│
│                 │                          │                   │             │
```

### 4. Code Generation Workflow

```
Backend          Engine            ModelData        CodeGenerator       FileManager
│                 │                 │                 │                   │
│ trainModel() ───→│                 │                 │                   │
│                 │                 │                 │                   │
│ setGraphData() ────→ generateModelData()            │                   │
│                 │    - layers     │                 │                   │
│                 │    - hyperparams│                 │                   │
│                 │    - input      │                 │                   │
│                 │    - loss func  │                 │                   │
│                 │                 │                 │                   │
│                 │ getPyCode() ──────────────→ generateCode()           │
│                 │                 │           │ getImports()           │
│                 │                 │           │ getInput()             │
│                 │                 │           │ getHyperparameters()   │
│                 │                 │           │ getModel()             │
│                 │                 │           │ getTrainingLoop()      │
│                 │                 │           │ getSaveModel()         │
│                 │                 │           │ Combine All            │
│                 │                 │←──────────│ Return Python Code     │
│                 │←────────────────│                 │                   │
│ Code Ready      │                 │                 │                   │
│                 │                 │                 │                   │
│────────────────────────────────────────────────────────→ saveFile()    │
│                 │                 │                 │    Save to Disk  │
│                 │                 │                 │←───────────────│
│ File Saved      │                 │                 │                   │
```

---

## Component Diagrams

### 1. Frontend Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          RENDERER PROCESS                                │
│                           React App                                      │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                        App (Main Router)                                  │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
        ┌───────────▼──────────┐  │  ┌──────────▼─────────┐
        │   Dashboard Module   │  │  │  Workspace Module   │
        ├─────────────────────┤  │  ├─────────────────────┤
        │ - Homepage          │  │  │ - Editor (Main)     │
        │ - Statistics        │  │  │ - LeftPanel         │
        │ - Model Gallery     │  │  │ - RightPanel        │
        └─────────────────────┘  │  │ - NetworkCanvas     │
                                 │  │ - Divider           │
                    ┌────────────▼──▼──────────────┐
                    │    TranningGraph Module       │
                    ├──────────────────────────────┤
                    │ - TrainingPage               │
                    │ - TrainingGraphs             │
                    │ - Real-time Metrics          │
                    └──────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                        Shared Components Layer                             │
├──────────────────────────────────────────────────────────────────────────┤
│  - Header          - Toolbar         - ParameterViewer                   │
│  - Menubar         - RightStripe      - DiagnosticViewer                 │
│  - ModalTemplate   - LoadingModal     - CopilotPanel                     │
│  - Footer          - InferencePanel   - HyperparameterModal              │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                        Modal/Overlay Components                            │
├──────────────────────────────────────────────────────────────────────────┤
│  - ModelInputModal      - HyperparameterModal      - LoadingOverlay      │
│  - InputConfigFactory   - ImageInputConfig         - CommonFooter        │
│  - TabularInputConfig   - CommonConfig             - AbstractInputConfig │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                        Utilities & Services Layer                          │
├──────────────────────────────────────────────────────────────────────────┤
│  Backend Service    │ Graph Managers    │ Node Operations  │ File Utils   │
│  - API calls        │ - ModelNodeMgr    │ - getNodeByName  │ - FileOps    │
│  - IPC              │ - GraphDataMgr    │ - nodeOps        │ - pathOps    │
│                     │ - HyperparamsMgr  │                  │              │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2. Backend Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          MAIN PROCESS                                    │
│                      Backend Services                                    │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                        IPC Layer (ipcHandler)                             │
│  Handles all Electron IPC communication between Main & Renderer           │
└──────────────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                        Controllers Layer                                  │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────┐    ┌────────────────────────────┐       │
│  │   ModelController          │    │   GraphController          │       │
│  │                            │    │                            │       │
│  │ - trainModel()             │    │ - setGraphData()           │       │
│  │ - saveModel()              │    │ - getLayerSequence()       │       │
│  │ - loadModel()              │    │ - validateGraph()          │       │
│  │ - setupForInference()      │    │ - detectCycles()           │       │
│  └────────────────────────────┘    └────────────────────────────┘       │
│         │                                    │                           │
│         └────────────────┬───────────────────┘                           │
│                          ↓                                               │
└──────────────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                        Core Services Layer                                │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                     Engine (Code Generation)                       │ │
│  │  ┌─────────────────────────────────────────────────────────────┐ │ │
│  │  │ - ModelData                                                 │ │ │
│  │  │ - AbstractCodeGenerator (Factory)                           │ │ │
│  │  │ - PyTorchCodeGenerator / TensorFlowCodeGenerator            │ │ │
│  │  └─────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                 Input Data Processing                              │ │
│  │  ┌──────────────────────────────────────────────────────────────┐ │ │
│  │  │ - InputDataHandlerFactory                                    │ │ │
│  │  │ - AbstractInputDataHandler (Base)                            │ │ │
│  │  │ - TabularInputDataHandler                                    │ │ │
│  │  │ - ImageInputDataHandler                                      │ │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                 File Management                                    │ │
│  │  - FileManager (Singleton)                                        │ │
│  │  - Read/Write/Delete/Rename operations                            │ │
│  │  - Dataset Analysis                                               │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                        Data Management Layer                              │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────┐    ┌────────────────────────────┐       │
│  │   ModelNodeManager         │    │   GraphDataManager         │       │
│  │   (Singleton)              │    │   (Singleton)              │       │
│  │                            │    │                            │       │
│  │ - Manage ModelNodes        │    │ - Manage Graph Structure   │       │
│  │ - Store Node Parameters    │    │ - Store Nodes & Edges      │       │
│  │ - Update Node Values       │    │ - Store Hyperparameters    │       │
│  └────────────────────────────┘    └────────────────────────────┘       │
│         │                                    │                           │
│         └────────────────┬───────────────────┘                           │
│                          ↓                                               │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │        HyperparametersMngr (Singleton)                            │ │
│  │  - Store training hyperparameters                                 │ │
│  │  - Manage optimization configs                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

### 3. Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW LAYER                                 │
└──────────────────────────────────────────────────────────────────────────┘

User Input                      Processing                    Output
    │                               │                           │
    ├─ Drag Nodes ──────────────→ GraphDataMgr ──────────────→ Network Render
    │                               │                           │
    ├─ Select Node ─────────────→ ModelNodeMgr ───────────────→ Show Properties
    │                               │                           │
    ├─ Configure Input ─────────→ InputDataHandler ──────────→ Store Config
    │                               │                           │
    ├─ Set Hyperparameters ────→ HyperparametersMgr ────────→ Store Values
    │                               │                           │
    ├─ Click Train ──────────────→ ModelController ──────────→ Execute Python
    │                               │                           │
    │                           Engine ────────→ FileManager → Save .py File
    │                               │                           │
    │                           CodeGenerator ──────────────→ Python Execution
    │                               │                           │
    └─ Stop Training ───────────→ StopSignal ────────────────→ Terminate Process
```

---

## Data Flow Diagrams

### 1. Model Training Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODEL TRAINING FLOW                          │
└─────────────────────────────────────────────────────────────────┘

INPUT:
    User's Graph (Nodes + Edges)
    │
    ├─ Node Data: {id, feature, parameters}
    ├─ Edge Data: {from, to, connection}
    └─ Hyperparameters: {epochs, lr, batch_size}
    │
    ↓
PROCESSING:
    ┌─────────────────────────────┐
    │  GraphController            │
    │  - Validate Graph           │
    │  - Extract Layer Sequence   │
    │  - Get Hyperparameters      │
    └─────────────────────────────┘
    │
    ↓
    ┌─────────────────────────────┐
    │  Engine                     │
    │  - Create ModelData         │
    │  - Select CodeGenerator     │
    └─────────────────────────────┘
    │
    ↓
    ┌─────────────────────────────┐
    │  PyTorchCodeGenerator       │
    │  - Generate Imports         │
    │  - Generate Input Loading   │
    │  - Generate Model Class     │
    │  - Generate Training Loop   │
    │  - Generate Save Logic      │
    └─────────────────────────────┘
    │
    ↓
    ┌─────────────────────────────┐
    │  FileManager                │
    │  - Save Generated Code      │
    └─────────────────────────────┘
    │
    ↓
OUTPUT:
    - Python Script (.py)
    - Ready for execution
    - Can be customized
```

### 2. Input Data Processing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              INPUT DATA PROCESSING FLOW                         │
└─────────────────────────────────────────────────────────────────┘

INPUT:
    Raw Data File (CSV, Excel, Images)
    │
    ↓
DETECTION:
    InputDataHandlerFactory
    │
    ├─ Detect File Type
    ├─ Determine Handler Type
    └─ Create Appropriate Handler
    │
    ↓
ANALYSIS:
    InputDataHandler (Tabular/Image)
    │
    ├─ Validate File Format
    ├─ Extract Metadata
    ├─ Count Features/Classes
    └─ Generate Statistics
    │
    ↓
OUTPUT:
    ProcessedInputData
    │
    ├─ Metadata: {shape, dtypes, stats}
    ├─ Features: Feature List
    ├─ Target: Target Column
    ├─ Classes: Class List (for images)
    └─ Split Info: Train/Test Ratios
    │
    ↓
INTEGRATION:
    Stored in ModelData
    │
    ↓
GENERATION:
    Used in Code Generation
    │
    ├─ Data Loading Code
    ├─ Preprocessing Code
    ├─ DataLoader Creation
    └─ Training Dataset Prep
```

---

## Deployment Architecture

### 1. Application Deployment

```
┌─────────────────────────────────────────────────────────────────┐
│                DEPLOYMENT ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────┘

DEVELOPMENT:
    ┌─────────────────┐
    │  Source Code    │
    │  (Repository)   │
    └────────┬────────┘
             │
             ↓
BUILD PROCESS (Webpack):
    ┌──────────────────────────────┐
    │ - Compile TypeScript/JSX     │
    │ - Bundle React Code          │
    │ - Generate electron bundles  │
    │ - Create preload scripts     │
    └──────────────┬───────────────┘
                   │
                   ↓
PACKAGING (Electron Builder):
    ┌──────────────────────────────┐
    │ - Create OS-specific builds  │
    │ - Sign Code (optional)       │
    │ - Generate Installers        │
    │ - macOS: .dmg / .app         │
    │ - Windows: .exe / .msi       │
    │ - Linux: AppImage / .deb     │
    └──────────────┬───────────────┘
                   │
                   ↓
DISTRIBUTION:
    ┌──────────────────────────────┐
    │ - GitHub Releases            │
    │ - App Stores (optional)      │
    │ - Direct Download            │
    └──────────────┬───────────────┘
                   │
                   ↓
END USER:
    ┌──────────────────────────────┐
    │ - Install Application        │
    │ - Configure Python           │
    │ - Run ModelForge             │
    └──────────────────────────────┘
```

### 2. Runtime Environment

```
┌──────────────────────────────────────────────────────────────┐
│              RUNTIME EXECUTION ENVIRONMENT                   │
└──────────────────────────────────────────────────────────────┘

ELECTRON MAIN PROCESS (Node.js):
    ├─ Window Management
    ├─ File System Access
    ├─ Native Module Integration
    ├─ IPC Communication
    └─ Python Process Spawning
             │
             ↓
    ┌─────────────────────────────┐
    │  Child Process (Python)     │
    │  /usr/bin/python3 OR        │
    │  Embedded Python            │
    └──────────┬──────────────────┘
               │
               ├─ Virtual Environment (__PYTORCH__)
               │  ├─ Python 3.13
               │  ├─ PyTorch
               │  ├─ TensorFlow
               │  ├─ NumPy
               │  ├─ Pandas
               │  └─ Scikit-learn
               │
               ↓
    ┌─────────────────────────────┐
    │  Generated Python Script    │
    │  - Load Data                │
    │  - Build Model              │
    │  - Train Model              │
    │  - Save Weights             │
    └─────────────────────────────┘

RENDERER PROCESS (React):
    ├─ UI Rendering
    ├─ User Interactions
    ├─ Network Visualization
    ├─ Real-time Graph Updates
    └─ IPC Communication with Main
```

---

## Interaction Patterns

### 1. Singleton Pattern (Data Managers)

```
┌─────────────────────────────────────────────────────────────┐
│              SINGLETON PATTERN USAGE                         │
└─────────────────────────────────────────────────────────────┘

Used For:
  ✓ ModelNodeManager - Manages all model nodes throughout app
  ✓ GraphDataManager - Centralized graph state
  ✓ HyperparametersMngr - Global hyperparameter store
  ✓ FileManager - File I/O operations

Benefits:
  ✓ Single source of truth
  ✓ Thread-safe access (across components)
  ✓ Prevents duplicate instances
  ✓ Centralized state management

Usage Pattern:
    const manager = SomeManager.getInstance();
    manager.operation();
```

### 2. Factory Pattern (Code Generation)

```
┌─────────────────────────────────────────────────────────────┐
│              FACTORY PATTERN USAGE                           │
└─────────────────────────────────────────────────────────────┘

Used For:
  ✓ CodeGenerator Factory - Creates appropriate code generators
  ✓ InputDataHandlerFactory - Creates appropriate data handlers

Benefits:
  ✓ Encapsulates object creation logic
  ✓ Easy to extend with new types
  ✓ Decouples client from concrete classes
  ✓ Supports multiple frameworks/input types

Usage Pattern:
    const engine = new Engine(layers, hyperparams);
    // Internally uses factory to create:
    // - PyTorchCodeGenerator
    // - TensorFlowCodeGenerator (future)
```

### 3. Strategy Pattern (Input Handling)

```
┌─────────────────────────────────────────────────────────────┐
│              STRATEGY PATTERN USAGE                          │
└─────────────────────────────────────────────────────────────┘

Used For:
  ✓ Different input data handling strategies
  ✓ Tabular (CSV, Excel) vs Image data

Benefits:
  ✓ Encapsulates different algorithms
  ✓ Runtime strategy selection
  ✓ Easy to add new input types

Strategies:
  - TabularInputDataHandler: CSV/Excel processing
  - ImageInputDataHandler: Image folder processing
```

---

## Key Interfaces

### 1. ModelNode Interface

```typescript
interface ModelNode {
  id: number;                          // Unique identifier
  feature: string;                     // Node type (e.g., 'Conv2D')
  label: string;                       // Display label
  framework: 'PyTorch' | 'TensorFlow'; // Target framework
  nodeType: string;                    // Category (e.g., 'Layer')
  parameters: Parameter[];             // Node parameters
  position?: { x: number; y: number }; // Visual position
  isConfigured?: boolean;              // Configuration status
  metadata?: Record<string, any>;      // Additional data
}
```

### 2. Parameter Interface

```typescript
interface Parameter {
  name: string;                    // Parameter name
  value: any;                      // Current value
  type: string;                    // Data type
  description: string;             // Help text
  isRequired: boolean;             // Required flag
  constraints?: {                  // Validation rules
    min?: number;
    max?: number;
    values?: any[];
    pattern?: string;
  };
}
```

### 3. InputDataResult Interface

```typescript
interface InputDataResult {
  type: 'tabular' | 'image' | 'text'; // Data type
  data: {
    features?: string[];               // Feature names
    target?: string;                   // Target column
    classes?: string[];                // For classification
    shape?: tuple;                     // Data shape
    metadata?: any;                    // Additional metadata
  };
}
```

---

## Dependencies & Versions

### Core Dependencies

```
Frontend:
  - react: ^18.x.x
  - react-dom: ^18.x.x
  - vis-network: ^9.x.x (Graph visualization)
  - electron: ^latest
  - ansi-to-html: ^0.x.x (Log formatting)

Backend:
  - typescript: ^4.x.x
  - node.js: ^16.x.x+
  
ML Stack:
  - PyTorch: 2.0+
  - TensorFlow: 2.10+
  - NumPy: 1.20+
  - Pandas: 1.3+
  - Scikit-learn: 1.0+
```

---

## Summary

This documentation provides a comprehensive overview of ModelForge's architecture including:

1. **System Architecture**: High-level overview of all components
2. **Class Diagrams**: Detailed structure of core classes and relationships
3. **Sequence Diagrams**: Step-by-step workflows for main processes
4. **Component Diagrams**: Frontend and backend component organization
5. **Data Flow Diagrams**: How data flows through the system
6. **Deployment Architecture**: Build and runtime environments
7. **Design Patterns**: Singleton, Factory, and Strategy patterns used
8. **Key Interfaces**: TypeScript interface definitions
9. **Dependencies**: Technology stack and versions

Use this documentation for:
- Onboarding new developers
- Understanding system design
- Planning new features
- Debugging complex issues
- Architecture reviews
- Technical discussions
