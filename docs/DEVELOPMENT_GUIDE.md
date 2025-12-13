# ModelForge Development & Architecture Guide

## Quick Reference

### Documentation Files
1. **ARCHITECTURE_DIAGRAMS.md** - ASCII diagrams and visual representations
2. **ARCHITECTURE_UML_MERMAID.md** - UML diagrams in Mermaid syntax (auto-rendering)
3. **API_DOCUMENTATION.md** - Complete API reference and integration guide
4. **This File** - Developer guide and architecture overview

---

## Directory Structure Overview

```
ModelForge/
├── src/
│   ├── backend/
│   │   ├── controllers/
│   │   │   ├── ModelController.ts      # Model lifecycle management
│   │   │   └── GraphController.ts      # Graph structure management
│   │   ├── Core/
│   │   │   ├── Engine.ts               # Code generation engine
│   │   │   ├── FileManager.ts          # File I/O operations
│   │   │   ├── CodeGen/                # Code generation templates
│   │   │   │   ├── AbstractCodeGenerator.ts
│   │   │   │   └── pyTrochCodeGen/
│   │   │   │       ├── PytorchCodeGenerator.ts
│   │   │   │       ├── PyCode.js       # PyTorch code templates
│   │   │   │       └── ...
│   │   │   ├── InputDataProcessing/   # Data handling
│   │   │   │   ├── AbstractInputDataHandler.ts
│   │   │   │   ├── TabularInputDataHandler.ts
│   │   │   │   ├── ImageInputDataHandler.ts
│   │   │   │   └── InputDataHandlerFactory.ts
│   │   │   └── utils/
│   │   │       └── ModelData.ts        # Data transformation
│   │   ├── services/
│   │   │   ├── GraphService.ts
│   │   │   └── InputDataService.ts
│   │   └── ipc/
│   │       └── ipcHandler.js           # IPC communication bridge
│   │
│   ├── frontend/
│   │   ├── components/                 # React components
│   │   │   ├── Editor.jsx
│   │   │   ├── Toolbar.jsx
│   │   │   ├── ParameterViewer.jsx
│   │   │   ├── DiagnosticViewer.jsx
│   │   │   ├── HyperparameterModal.jsx
│   │   │   ├── InferencePanel.jsx
│   │   │   ├── CopilotPanel.jsx
│   │   │   └── ...
│   │   ├── modules/
│   │   │   ├── Workspace/              # Main workspace module
│   │   │   │   ├── Editor.jsx
│   │   │   │   └── style.css
│   │   │   ├── EditorPanels/           # Editor sub-components
│   │   │   │   ├── LeftPanel.jsx
│   │   │   │   ├── RightPanel.jsx
│   │   │   │   ├── NetworkCanvas.jsx
│   │   │   │   └── ...
│   │   │   ├── InputModal/             # Data configuration
│   │   │   ├── TranningGraph/          # Training visualization
│   │   │   ├── Dashboard/              # Homepage
│   │   │   └── Loading/
│   │   ├── utils/
│   │   │   ├── graphMngr/              # Graph management
│   │   │   │   ├── ModelNodeManager.ts
│   │   │   │   └── ...
│   │   │   ├── graphUtils/
│   │   │   │   └── GraphDataManager.ts
│   │   │   ├── Editor/                 # Editor utilities
│   │   │   ├── fileOpsUtils/
│   │   │   ├── nodeOps/
│   │   │   ├── DiagnosticViewer/
│   │   │   └── ...
│   │   └── api/
│   │       └── BackendService.ts       # Backend API wrapper
│   │
│   ├── interface/                      # Shared TypeScript interfaces
│   │   ├── NodeInterface.ts
│   │   ├── HyperparameterInterface.ts
│   │   └── SpreadsheetInterface.ts
│   │
│   ├── main/                           # Electron main process
│   │   ├── main.ts                     # Entry point
│   │   ├── preload.ts                  # Preload script
│   │   ├── menu.ts                     # Application menu
│   │   ├── config.ts                   # Configuration
│   │   ├── util.ts                     # Utilities
│   │   ├── windowManager.ts            # Window management
│   │   └── python_setup.js             # Python environment setup
│   │
│   └── renderer/                       # React entry point
│       ├── App.tsx                     # Main App component
│       └── index.tsx                   # React DOM render
│
├── __PYTORCH__/                        # Embedded Python environment
│   ├── bin/
│   │   ├── python
│   │   └── activate
│   ├── lib/
│   │   └── python3.13/
│   │       └── site-packages/          # PyTorch, NumPy, Pandas, etc.
│   └── ...
│
├── ARCHITECTURE_DIAGRAMS.md            # Architecture documentation
├── ARCHITECTURE_UML_MERMAID.md         # UML diagrams
├── API_DOCUMENTATION.md                # API reference
├── package.json                        # Node.js dependencies
├── tsconfig.json                       # TypeScript configuration
└── README.md                           # Project overview
```

---

## Architecture Layers

### Layer 1: UI Layer (React)
- **Purpose**: User interface and interactions
- **Technologies**: React, Electron Renderer Process
- **Key Components**: Editor, Toolbar, Modals, Panels
- **Responsibilities**:
  - Handle user input and events
  - Render visual feedback
  - Maintain UI state
  - Communicate with backend via IPC

### Layer 2: Service Layer (React Utils)
- **Purpose**: Frontend business logic and state management
- **Key Components**:
  - `BackendService.ts` - IPC communication wrapper
  - `ModelNodeManager` - Node data management
  - `GraphDataManager` - Graph data management
  - File operation utilities

### Layer 3: IPC Bridge Layer
- **Purpose**: Secure communication between processes
- **Location**: `src/backend/ipc/ipcHandler.js`
- **Responsibilities**:
  - Route IPC messages
  - Handle async operations
  - Error propagation
  - Process lifecycle management

### Layer 4: Business Logic Layer (Backend)
- **Purpose**: Core application logic
- **Key Components**:
  - `ModelController` - Model operations
  - `GraphController` - Graph management
  - `Engine` - Code generation
  - `FileManager` - File operations
  - `InputDataHandlers` - Data processing

### Layer 5: Data Transformation Layer
- **Purpose**: Convert between formats
- **Key Components**:
  - `ModelData` - Data transformation and validation
  - `CodeGenerators` - Convert model to code
  - `InputDataHandlers` - Parse various input formats

### Layer 6: Python Execution Layer
- **Purpose**: ML model training and inference
- **Technologies**: PyTorch, TensorFlow, NumPy, Pandas
- **Responsibilities**:
  - Execute generated Python scripts
  - Handle GPU/CPU computation
  - Manage training lifecycle
  - Save/load model weights

### Layer 7: Persistence Layer
- **Purpose**: File storage and retrieval
- **Handles**: Models (.mff), Code (.py), Weights (.pt, .h5), Data

---

## Key Design Patterns

### 1. Singleton Pattern
**Used For**: Global state managers
- `ModelNodeManager` - Single source of node truth
- `GraphDataManager` - Centralized graph state
- `HyperparametersMngr` - Global hyperparameter store
- `FileManager` - Centralized file operations

**Benefits**:
- Prevents duplicate instances
- Ensures consistent state
- Thread-safe access

```typescript
// Usage
const nodeManager = ModelNodeManager.getInstance();
nodeManager.createNode(id, nodeData);
```

---

### 2. Factory Pattern
**Used For**: Creating objects without specifying exact classes
- `InputDataHandlerFactory` - Creates appropriate data handlers
- `CodeGeneratorFactory` (in Engine) - Creates language-specific generators

**Benefits**:
- Encapsulates object creation
- Easy to extend with new types
- Decouples client from implementation

```typescript
// Usage
const handler = InputDataHandlerFactory.createHandler(inputData);
```

---

### 3. Strategy Pattern
**Used For**: Different algorithms for same operation
- `AbstractCodeGenerator` with implementations:
  - `PyTorchCodeGenerator`
  - `TensorFlowCodeGenerator` (future)
- `AbstractInputDataHandler` with implementations:
  - `TabularInputDataHandler`
  - `ImageInputDataHandler`

**Benefits**:
- Runtime strategy selection
- Easy to add new strategies
- Loose coupling

---

### 4. Observer Pattern
**Used For**: Event-driven architecture
- IPC message handlers
- Dialog updates during training
- UI state updates

```typescript
// Usage
window.dialog.onDialogUpdate((message) => {
  // React to training output
  console.log(message);
});
```

---

### 5. Builder Pattern
**Used For**: Complex object construction
- Graph building from UI nodes and edges
- Model configuration creation

---

## Data Flow Walkthrough

### Training Model Data Flow

```
User Interface
    ↓
Drag Nodes & Configure
    ↓
Editor State Management (ModelNodeManager, GraphDataManager)
    ↓
Click Train Button
    ↓
Backend Service IPC Call
    ↓
ModelController.trainModel()
    ↓
GraphController.setGraphData()
    ↓
Engine Constructor (ModelData creation)
    ↓
Create Appropriate CodeGenerator
    ↓
Generate Python Code
    ↓
FileManager.saveFile()
    ↓
Spawn Python Process
    ↓
Python Script Execution
    ├─ Load Data (InputDataHandler)
    ├─ Build Model (Layer definitions)
    ├─ Train (Loop iterations)
    ├─ Emit Output (to IPC handler)
    └─ Save Weights
    ↓
Parse Output & Update UI
    ├─ Log messages (DiagnosticViewer)
    ├─ Metrics (TrainingGraphs)
    └─ Status indicators
```

---

## Important Interfaces

### ModelNode
```typescript
interface ModelNode {
  id: number                                    // Unique ID
  feature: string                               // Layer type
  label: string                                 // Display name
  framework: 'PyTorch' | 'TensorFlow'          // Target framework
  nodeType: string                              // Category
  parameters: Parameter[]                       // Configuration
  position?: { x: number; y: number }          // Visual position
  isConfigured?: boolean                        // Validation state
  metadata?: Record<string, any>                // Additional data
}
```

### Edge
```typescript
interface Edge {
  id: number | string                          // Unique ID
  from: number                                  // Source node
  to: number                                    // Target node
  metadata?: {                                  // Optional styling
    color?: string
    label?: string
    width?: number
  }
}
```

### ModelGraph
```typescript
interface ModelGraph {
  nodes: ModelNode[]                            // All nodes
  edges: Edge[]                                 // All connections
  hyperparameters: HyperparameterConfig        // Training config
  metadata?: {                                  // Project info
    name?: string
    description?: string
    version?: string
    framework?: string
  }
}
```

---

## Workflow Examples

### Adding a New Layer Type

1. **Define Node Template** (Backend)
   - Add to node configuration
   - Define parameters for the layer

2. **Create UI Component** (Frontend)
   - Add to layer selection panel
   - Implement drag-drop handling

3. **Update Code Generators** (Backend)
   - Add case in `PyTorchCodeGenerator.generateLayerCode()`
   - Add case in other generators as needed

4. **Test Integration**
   - Create test model with new layer
   - Generate code
   - Verify training execution

---

### Adding a New Input Data Type

1. **Create Handler Class** (Backend)
   ```typescript
   class CustomInputDataHandler extends AbstractInputDataHandler {
     extractInputData(): InputDataResult { ... }
     validateInputData(): ValidationResult { ... }
   }
   ```

2. **Register in Factory** (Backend)
   ```typescript
   createHandler(inputData): AbstractInputDataHandler {
     if (isCustomFormat(inputData)) {
       return new CustomInputDataHandler(inputData);
     }
   }
   ```

3. **Create UI Component** (Frontend)
   - Add input modal configuration
   - Implement file selection

4. **Test Integration**
   - Load custom data
   - Verify parsing
   - Train model with custom data

---

### Adding a New Framework Support

1. **Create Code Generator** (Backend)
   ```typescript
   class CustomFrameworkCodeGenerator extends AbstractCodeGenerator {
     getImports(): string { ... }
     getInput(): string { ... }
     // ... implement other methods
   }
   ```

2. **Register in Engine** (Backend)
   ```typescript
   private createCodeGenerator(framework: string) {
     switch (framework.toLowerCase()) {
       case 'custom':
         return new CustomFrameworkCodeGenerator(...);
     }
   }
   ```

3. **Update UI** (Frontend)
   - Add framework option to dropdown
   - Update node templates for new framework

4. **Test End-to-End**
   - Create model
   - Generate code
   - Execute training

---

## Error Handling Strategy

### Validation Layers

1. **Frontend Validation** (UI Level)
   - Type checking
   - Range validation
   - Required field checks

2. **Graph Validation** (Logic Level)
   - Cycle detection
   - Node connectivity
   - Parameter completeness

3. **Data Validation** (Processing Level)
   - File format checks
   - Data shape validation
   - Missing value handling

4. **Runtime Validation** (Execution Level)
   - Python script execution
   - Model creation
   - Training execution

---

## Performance Considerations

### Frontend Optimization
- Virtual scrolling for large node lists
- Canvas rendering optimization (vis-network)
- Debounced UI updates during training
- Efficient state management in React

### Backend Optimization
- Lazy loading of data processors
- Singleton pattern reduces memory overhead
- Efficient file I/O with streaming
- Process pooling for multiple trainings

### Python Runtime Optimization
- GPU utilization (if CUDA available)
- Batch processing
- Efficient data loading (PyTorch DataLoader)
- Model checkpointing

---

## Testing Strategy

### Unit Tests
```bash
# Test individual components
npm test -- src/frontend/modules/Workspace/__test__/Editor.test.jsx
```

### Integration Tests
```bash
# Test component interactions
npm test -- --coverage
```

### E2E Tests
```bash
# Full workflow testing
npm run test:e2e
```

### Manual Testing Checklist
- [ ] Create model with various layer types
- [ ] Test parameter validation
- [ ] Load different data types
- [ ] Train model and verify output
- [ ] Save and load model
- [ ] Export generated code
- [ ] Test error scenarios

---

## Deployment

### Build Process
```bash
# Development
npm start

# Production build
npm run build
npm run package

# Create distributable
npm run package
```

### Distribution Artifacts
- **macOS**: `.dmg` installer
- **Windows**: `.exe` installer, `.msi` package
- **Linux**: AppImage, `.deb` package

### Python Environment
- Embedded in `__PYTORCH__` directory
- Includes PyTorch, TensorFlow, and dependencies
- Platform-specific builds

---

## Troubleshooting

### Common Issues

#### Issue: Graph contains cycle
**Cause**: Circular connections between nodes
**Solution**: Use `CycleDetector` to identify and remove cycles

#### Issue: Missing input configuration
**Cause**: Input node not properly configured
**Solution**: Configure input node through InputModal before training

#### Issue: Python execution timeout
**Cause**: Long training takes too long
**Solution**: Increase timeout, optimize dataset size, or reduce epochs

#### Issue: Memory exhaustion
**Cause**: Large dataset or batch size
**Solution**: Reduce batch size, optimize data loading, use data generators

---

## Contributing Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for complex functions

### Adding Features
1. Create feature branch
2. Implement with tests
3. Update documentation
4. Submit pull request
5. Address review comments

### Documentation Updates
- Update ARCHITECTURE_DIAGRAMS.md for structural changes
- Update API_DOCUMENTATION.md for API changes
- Add code examples for new features
- Update README.md for user-facing changes

---

## Resources

### Key Files to Understand First
1. `src/backend/controllers/ModelController.ts` - Entry point for training
2. `src/frontend/modules/Workspace/Editor.jsx` - Main UI component
3. `src/backend/Core/Engine.ts` - Code generation logic
4. `src/frontend/utils/graphMngr/ModelNodeManager.ts` - Node management

### External Documentation
- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev/)
- [PyTorch Documentation](https://pytorch.org/docs/stable/index.html)
- [TensorFlow Documentation](https://www.tensorflow.org/api_docs)
- [vis-network Documentation](https://visjs.org/)

---

## Summary

ModelForge follows clean architecture principles with clear separation of concerns:

- **UI Layer** handles user interactions
- **Service Layer** manages state and business logic
- **IPC Layer** enables process communication
- **Backend Layer** implements core functionality
- **Data Layer** handles transformations and persistence
- **Python Layer** executes ML workloads

The architecture is designed to be:
- **Extensible** - Easy to add new layers, frameworks, data types
- **Maintainable** - Clear component responsibilities
- **Testable** - Well-defined interfaces and dependencies
- **Scalable** - Efficient resource usage and performance

For questions, refer to the related documentation files or explore the codebase using this guide as reference.
