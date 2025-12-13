# ModelForge UML Diagrams (Mermaid Format)

This document contains all UML diagrams in Mermaid syntax for automatic rendering on GitHub, GitLab, and documentation platforms.

## Table of Contents
1. [Class Diagrams](#class-diagrams)
2. [Sequence Diagrams](#sequence-diagrams)
3. [State Diagrams](#state-diagrams)
4. [Component Diagrams](#component-diagrams)

---

## Class Diagrams

### 1. Core Engine Architecture

```mermaid
classDiagram
    class Engine {
        -modelDataObj: ModelData
        -codeGenerator: AbstractCodeGenerator
        +constructor(rawLayersData, hyperparameters)
        +getPyCode(): string
        +getLayerData(): Layer[]
        +getInputData(): InputData
        +getLossFunctionData(): LossFunction
        +getOptimizerData(): Optimizer
        -createCodeGenerator(framework): AbstractCodeGenerator
    }

    class ModelData {
        -layers: Layer[]
        -hyperparameters: object
        -inputData: InputData
        -lossFunction: LossFunction
        +generateModelData(name, layers, hyperparameters)
        +getLayersData(): Layer[]
        +getHyperparameters(): object
        +getInputData(): InputData
        +getLossFunction(): LossFunction
    }

    class AbstractCodeGenerator {
        #inputData: object
        #modelData: Layer[]
        #hyperparameters: object
        #lossFunction: LossFunction
        +constructor(modelData, hyperparameters, inputData, lossFunction)
        +getImports()* string
        +getInput()* string
        +getModel()* string
        +getHyperparameters()* string
        +getTrainingLoop()* string
        +getSaveModel()* string
        +generateCode(): string
    }

    class PyTorchCodeGenerator {
        +getImports(): string
        +getInput(): string
        +getModel(): string
        +getHyperparameters(): string
        +getTrainingLoop(): string
        +getSaveModel(): string
        -generateLayerCode(layer): string
        -generateOptimizer(): string
        -generateLossFunction(): string
    }

    class TensorFlowCodeGenerator {
        +getImports(): string
        +getInput(): string
        +getModel(): string
        +getHyperparameters(): string
        +getTrainingLoop(): string
        +getSaveModel(): string
    }

    Engine --> ModelData: uses
    Engine --> AbstractCodeGenerator: creates
    AbstractCodeGenerator <|-- PyTorchCodeGenerator
    AbstractCodeGenerator <|-- TensorFlowCodeGenerator
```

### 2. Model Node Management

```mermaid
classDiagram
    class ModelNodeManager {
        -nodes: Map~int, ModelNode~
        -instance: ModelNodeManager
        -constructor()
        +getInstance()$ ModelNodeManager
        +createNode(visNodeId, nodeData): int
        +updateNode(visNodeId, updates): boolean
        +getNode(visNodeId): ModelNode
        +getNodesByFramework(framework): ModelNode[]
        +getAllNodes(): ModelNode[]
        +deleteNode(visNodeId): boolean
        +clearAllNodes(): void
        +updateNodeParameter(visNodeId, paramName, value): boolean
        +updateMultipleNodeParameters(visNodeId, paramUpdates): boolean
    }

    class ModelNode {
        +id: int
        +feature: string
        +label: string
        +framework: string
        +nodeType: string
        +parameters: Parameter[]
        +position: Position
        +isConfigured: boolean
        +metadata: object
    }

    class Parameter {
        +name: string
        +value: any
        +type: string
        +description: string
        +isRequired: boolean
        +constraints: Constraints
    }

    class Constraints {
        +min: number
        +max: number
        +values: any[]
        +pattern: string
    }

    class Position {
        +x: number
        +y: number
    }

    ModelNodeManager --> ModelNode: manages
    ModelNode --> Parameter: contains
    Parameter --> Constraints: has
    ModelNode --> Position: has
```

### 3. Graph Management

```mermaid
classDiagram
    class GraphDataManager {
        -nodes: ModelNode[]
        -edges: Edge[]
        -hyperparameters: object
        -instance: GraphDataManager
        -constructor()
        +getInstance()$ GraphDataManager
        +setNodes(nodes): void
        +setEdges(edges): void
        +setHyperparameters(params): void
        +getGraphDataAsJson(): object
        +clearAllNodesAndEdges(): void
        +getLayerSequence(): Layer[]
        +validateGraph(): ValidationResult
    }

    class Edge {
        +id: int
        +from: int
        +to: int
        +metadata: object
    }

    class ValidationResult {
        +isValid: boolean
        +errors: string[]
        +warnings: string[]
    }

    class GraphController {
        -nodes: ModelNode[]
        -edges: Edge[]
        -hyperparameters: object
        +setGraphData(graph): void
        +getLayerSequence(): Layer[]
        +getHyperparameters(): object
        +validateGraph(): ValidationResult
        +detectCycles(): Cycle[]
        +analyzeDependencies(): Dependency[]
    }

    class CycleDetector {
        +detectCycles(graph): Cycle[]
        -dfs(node, visited, stack): boolean
    }

    GraphDataManager --> ModelNode: stores
    GraphDataManager --> Edge: stores
    GraphController --> ValidationResult: returns
    GraphController --> CycleDetector: uses
```

### 4. File Management

```mermaid
classDiagram
    class FileManager {
        -instance: FileManager
        -constructor()
        +getInstance()$ FileManager
        +saveFile(filePath, content): Promise~boolean~
        +readFile(filePath): Promise~string~
        +deleteFile(filePath): Promise~boolean~
        +renameFile(oldPath, newPath): Promise~boolean~
        +fileExists(filePath): Promise~boolean~
        +createDirectory(dirPath): Promise~boolean~
        +getFileExtension(filePath): string
        +getFileName(filePath): string
        +analyzeImageDatasetFolder(folderPath): Promise~DatasetInfo~
    }

    class DatasetInfo {
        +folders: FolderInfo[]
        +totalImages: int
    }

    class FolderInfo {
        +folderName: string
        +imageCount: int
    }

    FileManager --> DatasetInfo: returns
    DatasetInfo --> FolderInfo: contains
```

### 5. Input Data Processing

```mermaid
classDiagram
    class InputDataHandlerFactory {
        +createHandler(inputData): AbstractInputDataHandler
        +supportedTypes: string[]
        -detectInputType(file): string
    }

    class AbstractInputDataHandler {
        #inputData: object
        +constructor(inputData)
        +extractInputData()* InputDataResult
        +validateInputData()* ValidationResult
        #findParameter(paramName): Parameter
    }

    class TabularInputDataHandler {
        +extractInputData(): InputDataResult
        +validateInputData(): ValidationResult
        -parseCSV(filePath): DataFrame
        -parseExcel(filePath): DataFrame
        -handleMissingValues(data): DataFrame
        -normalizeFeatures(data): DataFrame
    }

    class ImageInputDataHandler {
        +extractInputData(): InputDataResult
        +validateInputData(): ValidationResult
        -analyzeImageFolder(folderPath): ImageDataset
        -validateImageFormats(files): boolean
        -extractImageMetadata(file): object
    }

    class InputDataResult {
        +type: InputType
        +data: object
    }

    class ValidationResult {
        +isValid: boolean
        +errors: string[]
    }

    InputDataHandlerFactory --> AbstractInputDataHandler: creates
    AbstractInputDataHandler <|-- TabularInputDataHandler
    AbstractInputDataHandler <|-- ImageInputDataHandler
    AbstractInputDataHandler --> InputDataResult: returns
    AbstractInputDataHandler --> ValidationResult: returns
```

### 6. Model Controllers

```mermaid
classDiagram
    class ModelController {
        -graphController: GraphController
        -fileMngr: FileManager
        +trainModel(modelGraph): void
        +saveModel(modelGraph, filePath): Promise~void~
        +loadModel(filePath): Promise~object~
        +setupModelForInference(filePath): Promise~void~
    }

    class GraphController {
        -nodes: ModelNode[]
        -edges: Edge[]
        -hyperparameters: object
        +setGraphData(graph): void
        +getLayerSequence(): Layer[]
        +getHyperparameters(): object
        +validateGraph(): ValidationResult
    }

    class Engine {
        -modelDataObj: ModelData
        -codeGenerator: AbstractCodeGenerator
        +getPyCode(): string
        +getLayerData(): Layer[]
    }

    ModelController --> GraphController: uses
    ModelController --> Engine: uses
    ModelController --> FileManager: uses
```

---

## Sequence Diagrams

### 1. Model Training Workflow

```mermaid
sequenceDiagram
    participant User
    participant Editor as Editor UI
    participant Backend
    participant Engine
    participant FileManager
    participant Python as Python Runtime

    User->>Editor: Drag nodes & connect
    Editor->>Backend: Create/Update nodes
    Backend->>Editor: Update graph

    User->>Editor: Configure input data
    Editor->>Backend: Save input config

    User->>Editor: Set hyperparameters
    Editor->>Backend: Save hyperparameters

    User->>Editor: Click Train
    Editor->>Backend: trainModel(graph)
    Backend->>Engine: new Engine(layers, hyperparams)
    Engine->>Engine: Create ModelData
    Engine->>Engine: Select CodeGenerator
    Engine->>Engine: generateCode()

    Engine->>FileManager: saveFile(pyScript)
    FileManager->>Python: Create process

    Python->>Python: Execute script
    Python->>Python: Load data
    Python->>Python: Build model
    Python->>Python: Train model
    Python->>Python: Save weights

    Python->>Backend: Send output
    Backend->>Editor: Append logs
    Editor->>Editor: Update metrics graph
```

### 2. Model Save & Load Workflow

```mermaid
sequenceDiagram
    participant User
    participant Editor as Editor UI
    participant Backend
    participant FileManager

    User->>Editor: Click Save
    Editor->>Editor: Gather nodes & edges
    Editor->>Editor: Collect hyperparameters
    User->>Editor: Select file path
    Editor->>Backend: saveModel(graph, path)
    Backend->>FileManager: saveFile(path, json)
    FileManager->>FileManager: Serialize to disk
    FileManager->>Backend: success

    Backend->>Editor: Model saved
    Editor->>User: Show confirmation

    User->>Editor: Click Load
    User->>Editor: Select file path
    Editor->>Backend: loadModel(path)
    Backend->>FileManager: readFile(path)
    FileManager->>Backend: Return JSON
    Backend->>Backend: Parse graph
    Backend->>Editor: Return model data
    Editor->>Editor: Restore nodes
    Editor->>Editor: Restore edges
    Editor->>Editor: Redraw network
```

### 3. Input Data Configuration

```mermaid
sequenceDiagram
    participant User
    participant Modal as InputModal
    participant Factory as HandlerFactory
    participant Handler
    participant Backend

    User->>Modal: Select data type
    User->>Modal: Choose file/folder
    Modal->>Factory: createHandler(file)
    Factory->>Factory: Detect file type
    Factory->>Handler: Instantiate handler

    Handler->>Handler: Analyze data
    Handler->>Backend: Return metadata
    Backend->>Modal: Display options

    User->>Modal: Configure settings
    Modal->>Handler: validateInputData()
    Handler->>Modal: Return validation result
    
    alt Validation Success
        User->>Modal: Submit
        Modal->>Backend: Save configuration
        Backend->>Modal: Confirm
    else Validation Failed
        Modal->>User: Show errors
    end
```

### 4. Code Generation Workflow

```mermaid
sequenceDiagram
    participant Backend
    participant Engine
    participant ModelData
    participant CodeGen
    participant FileManager

    Backend->>Engine: new Engine(layers, hyperparams)
    Engine->>ModelData: generateModelData()
    ModelData->>ModelData: Process layers
    ModelData->>ModelData: Extract hyperparams
    ModelData->>ModelData: Load input data
    ModelData->>Engine: Data ready

    Engine->>Engine: createCodeGenerator('PyTorch')
    Engine->>CodeGen: new PyTorchCodeGenerator(data)

    Backend->>Engine: getPyCode()
    Engine->>CodeGen: generateCode()
    CodeGen->>CodeGen: getImports()
    CodeGen->>CodeGen: getInput()
    CodeGen->>CodeGen: getModel()
    CodeGen->>CodeGen: getHyperparameters()
    CodeGen->>CodeGen: getTrainingLoop()
    CodeGen->>CodeGen: getSaveModel()
    CodeGen->>CodeGen: Combine all

    CodeGen->>Engine: Return complete code
    Engine->>Backend: Return code

    Backend->>FileManager: saveFile(path, code)
    FileManager->>FileManager: Write to disk
```

---

## State Diagrams

### 1. Model Training States

```mermaid
stateDiagram-v2
    [*] --> Idle
    
    Idle --> Configuring: User starts configuration
    Configuring --> Ready: All required configs done
    Configuring --> Idle: User cancels
    
    Ready --> CodeGenerating: User clicks Train
    CodeGenerating --> Generating: Code generation starts
    Generating --> PythonExecuting: Python script ready
    Generating --> Error: Generation failed
    
    Error --> Idle: User acknowledges
    
    PythonExecuting --> Training: Python process started
    Training --> Training: Training in progress (emit logs/metrics)
    Training --> Completed: Training finished
    Training --> Stopped: User clicks Stop
    
    Completed --> Idle: Ready for next action
    Stopped --> Idle: Training interrupted
```

### 2. Graph Editor States

```mermaid
stateDiagram-v2
    [*] --> Empty
    
    Empty --> NodeAdded: Add first node
    NodeAdded --> NodeAdded: Add more nodes
    NodeAdded --> EdgeAdded: Connect nodes
    EdgeAdded --> EdgeAdded: Add more edges
    EdgeAdded --> NodeAdded: Add more nodes
    
    NodeAdded --> NodeSelected: Click on node
    EdgeAdded --> NodeSelected: Click on node
    NodeSelected --> NodeSelected: Node selected (show properties)
    NodeSelected --> Configured: Configure node
    NodeSelected --> Deleted: Delete node
    
    Configured --> NodeSelected: Keep selected
    Configured --> Ready: All nodes configured
    
    Deleted --> NodeAdded: Node deleted, others remain
    Deleted --> Empty: Last node deleted
    
    Ready --> Training: Click Train
    Training --> Ready: Training completes
```

### 3. Application Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Launching
    
    Launching --> InitializingBackend: App loading
    InitializingBackend --> InitializingFrontend: Backend ready
    InitializingFrontend --> Ready: Frontend ready
    
    Ready --> ProjectOpen: Load existing project OR Create new
    Ready --> [*]: User quits
    
    ProjectOpen --> Editing: User creating model
    Editing --> Training: Start training
    Editing --> Saving: Save model
    Editing --> Loading: Load different model
    
    Training --> Editing: Training completes
    Saving --> Editing: Model saved
    Loading --> Editing: Model loaded
    
    Editing --> ProjectOpen: Switch project
    ProjectOpen --> [*]: Close application
```

---

## Component Diagrams

### 1. Frontend Component Architecture

```mermaid
graph TB
    subgraph App["React Application"]
        Router["React Router"]
        
        subgraph Dashboard["Dashboard Module"]
            Homepage["Homepage"]
            Statistics["Statistics"]
            Gallery["Model Gallery"]
        end
        
        subgraph Workspace["Workspace Module"]
            Editor["Editor (Main)"]
            LeftPanel["LeftPanel"]
            RightPanel["RightPanel"]
            NetworkCanvas["NetworkCanvas"]
        end
        
        subgraph Training["Training Module"]
            TrainingPage["TrainingPage"]
            Graphs["TrainingGraphs"]
        end
        
        subgraph Shared["Shared Components"]
            Header["Header"]
            Toolbar["Toolbar"]
            ParameterViewer["ParameterViewer"]
            DiagnosticViewer["DiagnosticViewer"]
        end
        
        subgraph Modals["Modal Components"]
            InputModal["ModelInputModal"]
            HyperModal["HyperparameterModal"]
            Loading["LoadingModal"]
        end
    end
    
    Router --> Dashboard
    Router --> Workspace
    Router --> Training
    
    Workspace --> Shared
    Dashboard --> Shared
    Training --> Shared
    
    Workspace --> Modals
    Shared --> Modals
```

### 2. Backend Component Architecture

```mermaid
graph TB
    subgraph Main["Electron Main Process"]
        IPC["IPC Handler"]
        
        subgraph Controllers["Controllers"]
            ModelCtrl["ModelController"]
            GraphCtrl["GraphController"]
        end
        
        subgraph Core["Core Services"]
            Engine["Engine"]
            FileManager["FileManager"]
            
            subgraph CodeGen["Code Generation"]
                AbstractCodeGen["AbstractCodeGenerator"]
                PyTorchCodeGen["PyTorchCodeGenerator"]
                TFCodeGen["TensorFlowCodeGenerator"]
            end
            
            subgraph InputProcessing["Input Processing"]
                HandlerFactory["InputDataHandlerFactory"]
                TabularHandler["TabularInputDataHandler"]
                ImageHandler["ImageInputDataHandler"]
            end
        end
        
        subgraph Managers["Data Managers"]
            NodeManager["ModelNodeManager"]
            GraphManager["GraphDataManager"]
            HyperparamMgr["HyperparametersMngr"]
        end
    end
    
    IPC --> Controllers
    Controllers --> Core
    Controllers --> Managers
    
    Engine --> CodeGen
    FileManager --> CodeGen
    
    HandlerFactory --> TabularHandler
    HandlerFactory --> ImageHandler
```

---

## Use Case Diagram

```mermaid
usecase diagram
    User as U
    Admin as A
    
    usecase "Create Model" as CreateModel
    usecase "Configure Nodes" as ConfigNodes
    usecase "Connect Layers" as Connect
    usecase "Load Dataset" as LoadData
    usecase "Set Hyperparameters" as SetHyper
    usecase "Train Model" as Train
    usecase "View Metrics" as ViewMetrics
    usecase "Save Model" as Save
    usecase "Load Model" as Load
    usecase "Export Code" as Export
    usecase "Inference" as Inference
    usecase "Manage Templates" as Templates
    
    U --> CreateModel
    U --> ConfigNodes
    U --> Connect
    U --> LoadData
    U --> SetHyper
    U --> Train
    U --> ViewMetrics
    U --> Save
    U --> Load
    U --> Export
    U --> Inference
    
    A --> Templates
    A --> CreateModel
    
    CreateModel .> ConfigNodes : includes
    CreateModel .> Connect : includes
    Train .> LoadData : requires
    Train .> SetHyper : requires
    Train .> ViewMetrics : includes
```

---

## Entity Relationship Diagram

```mermaid
erDiagram
    MODEL ||--o{ NODE : contains
    MODEL ||--o{ EDGE : contains
    MODEL ||--|| HYPERPARAMETER : has
    
    NODE ||--o{ PARAMETER : has
    NODE ||--|| INPUTDATA : requires
    
    INPUTDATA ||--|| DATASET : references
    DATASET ||--o{ DATAFILE : contains
    
    TRAINING ||--|| MODEL : trains
    TRAINING ||--o{ METRIC : generates
    TRAINING ||--o{ LOG : produces
    
    WEIGHT ||--|| TRAINING : resultOf
    WEIGHT ||--|| MODEL : savedIn
    
    MODEL-NAME : string
    MODEL-FRAMEWORK : string
    MODEL-CREATED-AT : datetime
    
    NODE-ID : int
    NODE-FEATURE : string
    NODE-LABEL : string
    NODE-POSITION : point
    
    PARAMETER-NAME : string
    PARAMETER-VALUE : any
    PARAMETER-TYPE : string
    
    TRAINING-ID : int
    TRAINING-START-TIME : datetime
    TRAINING-END-TIME : datetime
    TRAINING-EPOCHS : int
```

---

## Information Architecture

```mermaid
graph TD
    A[ModelForge] --> B[Projects]
    A --> C[Settings]
    A --> D[Help]
    
    B --> B1[Recent Models]
    B --> B2[Create New]
    B --> B3[Load Model]
    B --> B4[Saved Templates]
    
    B1 --> B1a[Model A]
    B1 --> B1b[Model B]
    
    B2 --> B2a[Blank Canvas]
    B2 --> B2b[From Template]
    
    B3 --> B3a[Browse Files]
    B3 --> B3b[Recent Files]
    
    B4 --> B4a[CNN Template]
    B4 --> B4b[RNN Template]
    B4 --> B4c[Transformer]
    
    C --> C1[General Settings]
    C --> C2[Python Setup]
    C --> C3[Framework Settings]
    
    D --> D1[Documentation]
    D --> D2[Tutorial]
    D --> D3[FAQ]
    D --> D4[Report Bug]
```

---

## Summary

This document contains comprehensive UML diagrams in Mermaid syntax covering:

1. **Class Diagrams**: 
   - Core Engine Architecture
   - Model Node Management
   - Graph Management
   - File Management
   - Input Data Processing
   - Model Controllers

2. **Sequence Diagrams**:
   - Model Training Workflow
   - Model Save & Load Workflow
   - Input Data Configuration
   - Code Generation Workflow

3. **State Diagrams**:
   - Model Training States
   - Graph Editor States
   - Application Lifecycle

4. **Component Diagrams**:
   - Frontend Component Architecture
   - Backend Component Architecture
   - Use Case Diagram
   - Entity Relationship Diagram
   - Information Architecture

These diagrams can be rendered directly in:
- GitHub markdown files
- GitLab markdown files
- Notion pages
- Documentation wikis
- Any platform supporting Mermaid syntax
