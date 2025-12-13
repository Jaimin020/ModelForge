# ModelForge API & Integration Documentation

## Table of Contents
1. [IPC API Reference](#ipc-api-reference)
2. [Backend Service APIs](#backend-service-apis)
3. [Frontend Component APIs](#frontend-component-apis)
4. [Data Models](#data-models)
5. [Integration Examples](#integration-examples)
6. [Error Handling](#error-handling)

---

## IPC API Reference

### Overview
ModelForge uses Electron's IPC mechanism for communication between the Main Process (Backend) and Renderer Process (Frontend).

### Available IPC Channels

#### 1. Model Operations

##### `trainModel`
Train a machine learning model based on the graph configuration.

**Request (Main → Renderer)**
```javascript
window.api.trainModel({
  modelGraph: {
    nodes: ModelNode[],
    edges: Edge[],
    hyperparameters: object
  },
  dataPath: string,
  config: {
    epochs: number,
    batchSize: number,
    learningRate: number,
    testSplit: number
  }
})
```

**Response (Renderer → Main)**
```javascript
{
  success: boolean,
  message: string,
  modelPath?: string,
  weightsPath?: string,
  metrics?: {
    finalLoss: number,
    finalAccuracy: number,
    trainTime: number
  }
}
```

---

##### `saveModel`
Save the current model configuration to disk.

**Request**
```javascript
window.api.saveModel({
  modelGraph: {
    nodes: ModelNode[],
    edges: Edge[],
    hyperparameters: object
  },
  filePath: string,
  fileName: string
})
```

**Response**
```javascript
{
  success: boolean,
  message: string,
  savedPath?: string
}
```

---

##### `loadModel`
Load a previously saved model configuration.

**Request**
```javascript
window.api.loadModel({
  filePath: string
})
```

**Response**
```javascript
{
  success: boolean,
  modelGraph: {
    nodes: ModelNode[],
    edges: Edge[],
    hyperparameters: object
  },
  message?: string
}
```

---

#### 2. Python Execution

##### `runPython`
Execute a Python script with optional arguments.

**Request**
```javascript
window.api.runPython({
  scriptPath: string,
  args?: string[],
  cwd?: string,
  timeout?: number  // in milliseconds
})
```

**Response**
```javascript
{
  success: boolean,
  output: string,
  error?: string,
  exitCode: number
}
```

---

##### `stopPython`
Stop the currently running Python process.

**Request**
```javascript
window.api.stopPython({
  processId?: number  // if not provided, stops the last started process
})
```

**Response**
```javascript
{
  success: boolean,
  message: string
}
```

---

#### 3. File Operations

##### `openFile`
Open a file picker dialog.

**Request**
```javascript
window.dialog.filePicker({
  title: string,
  defaultPath?: string,
  filters?: [
    {
      name: string,
      extensions: string[]
    }
  ]
})
```

**Response**
```javascript
{
  canceled: boolean,
  filePaths: string[]
}
```

---

##### `saveFileAs`
Open a save file dialog.

**Request**
```javascript
window.dialog.saveFilePathPicker({
  title: string,
  defaultPath?: string,
  filters?: [
    {
      name: string,
      extensions: string[]
    }
  ]
})
```

**Response**
```javascript
{
  canceled: boolean,
  filePath: string
}
```

---

##### `readFile`
Read a file from disk.

**Request**
```javascript
window.api.readFile({
  filePath: string,
  encoding?: string  // default: 'utf8'
})
```

**Response**
```javascript
{
  success: boolean,
  content: string,
  error?: string
}
```

---

##### `writeFile`
Write content to a file on disk.

**Request**
```javascript
window.api.writeFile({
  filePath: string,
  content: string,
  encoding?: string  // default: 'utf8'
})
```

**Response**
```javascript
{
  success: boolean,
  message: string
}
```

---

#### 4. Dialog & Notifications

##### `onDialogUpdate`
Listen for messages from the backend during Python execution.

**Subscribe**
```javascript
window.dialog.onDialogUpdate((message: string) => {
  // Handle incoming message
  console.log(message);
});
```

---

##### `showNotification`
Show a notification to the user.

**Request**
```javascript
window.api.showNotification({
  type: 'info' | 'success' | 'warning' | 'error',
  title: string,
  message: string,
  duration?: number  // in milliseconds
})
```

---

---

## Backend Service APIs

### ModelController

```typescript
class ModelController {
  /**
   * Train a model based on the provided graph configuration
   * @param modelGraph - Complete model structure with nodes, edges, hyperparameters
   * @returns Training result with metrics and saved model paths
   */
  trainModel(modelGraph: ModelGraph): Promise<TrainingResult>

  /**
   * Save the model configuration to a file
   * @param modelGraph - Model structure to save
   * @param filePath - Destination file path
   */
  saveModel(modelGraph: ModelGraph, filePath: string): Promise<SaveResult>

  /**
   * Load a model configuration from a file
   * @param filePath - Path to the model file
   * @returns Loaded model graph
   */
  loadModel(filePath: string): Promise<ModelGraph>

  /**
   * Setup a model for inference
   * @param filePath - Path to trained model weights
   * @returns Inference engine instance
   */
  setupModelForInference(filePath: string): Promise<InferenceEngine>
}
```

---

### GraphController

```typescript
class GraphController {
  /**
   * Set the graph data from the UI
   * @param graphData - Graph structure with nodes and edges
   */
  setGraphData(graphData: GraphData): void

  /**
   * Get the sequence of layers in the model
   * @returns Ordered array of layers
   */
  getLayerSequence(): Layer[]

  /**
   * Get all hyperparameters for the model
   * @returns Object containing all hyperparameter values
   */
  getHyperparameters(): HyperparameterConfig

  /**
   * Validate the graph for common issues
   * @returns Validation result with any errors or warnings
   */
  validateGraph(): ValidationResult

  /**
   * Check if the graph contains cycles
   * @returns Array of cycles if found, empty array otherwise
   */
  detectCycles(): Cycle[]

  /**
   * Analyze layer dependencies
   * @returns Dependency map showing layer relationships
   */
  analyzeDependencies(): DependencyMap
}
```

---

### Engine (Code Generation)

```typescript
class Engine {
  /**
   * Initialize the engine with model structure
   * @param rawLayersData - Array of layer configurations
   * @param hyperparameters - Model hyperparameters
   */
  constructor(rawLayersData: LayerConfig[], hyperparameters: object)

  /**
   * Generate Python code for the model
   * @returns Complete Python script as string
   */
  getPyCode(): string

  /**
   * Get processed layer data
   * @returns Array of processed layers
   */
  getLayerData(): Layer[]

  /**
   * Get input data configuration
   * @returns Input data object
   */
  getInputData(): InputData

  /**
   * Get loss function configuration
   * @returns Loss function object
   */
  getLossFunctionData(): LossFunction

  /**
   * Get optimizer configuration
   * @returns Optimizer object
   */
  getOptimizerData(): Optimizer
}
```

---

### FileManager

```typescript
class FileManager {
  /**
   * Get singleton instance
   */
  static getInstance(): FileManager

  /**
   * Save content to a file
   * @param filePath - Destination path
   * @param content - File content
   */
  async saveFile(filePath: string, content: string): Promise<boolean>

  /**
   * Read content from a file
   * @param filePath - Source path
   * @returns File content as string
   */
  async readFile(filePath: string): Promise<string | null>

  /**
   * Delete a file
   * @param filePath - Path to file to delete
   */
  async deleteFile(filePath: string): Promise<boolean>

  /**
   * Rename a file
   * @param oldPath - Current file path
   * @param newPath - New file path
   */
  async renameFile(oldPath: string, newPath: string): Promise<boolean>

  /**
   * Check if a file exists
   * @param filePath - Path to check
   */
  async fileExists(filePath: string): Promise<boolean>

  /**
   * Create a directory
   * @param dirPath - Directory path
   */
  async createDirectory(dirPath: string): Promise<boolean>

  /**
   * Analyze an image dataset folder
   * @param folderPath - Root folder path
   * @returns Dataset information
   */
  async analyzeImageDatasetFolder(folderPath: string): Promise<DatasetInfo>

  /**
   * Get file extension
   * @param filePath - File path
   */
  getFileExtension(filePath: string): string

  /**
   * Get file name
   * @param filePath - File path
   */
  getFileName(filePath: string): string
}
```

---

### Input Data Handlers

```typescript
abstract class AbstractInputDataHandler {
  /**
   * Extract input data from the source
   * @returns Processed input data
   */
  abstract extractInputData(): InputDataResult

  /**
   * Validate the input data
   * @returns Validation result
   */
  abstract validateInputData(): ValidationResult

  /**
   * Find a parameter by name
   * @param paramName - Parameter name to find
   */
  protected findParameter(paramName: string): Parameter | undefined
}

class TabularInputDataHandler extends AbstractInputDataHandler {
  /**
   * Extract data from CSV/Excel files
   */
  extractInputData(): InputDataResult

  /**
   * Validate tabular data structure
   */
  validateInputData(): ValidationResult

  /**
   * Parse CSV file
   */
  private parseCSV(filePath: string): DataFrame

  /**
   * Parse Excel file
   */
  private parseExcel(filePath: string): DataFrame
}

class ImageInputDataHandler extends AbstractInputDataHandler {
  /**
   * Extract data from image folders
   */
  extractInputData(): InputDataResult

  /**
   * Validate image formats and structure
   */
  validateInputData(): ValidationResult

  /**
   * Analyze image folder structure
   */
  private analyzeImageFolder(folderPath: string): ImageDataset
}
```

---

## Frontend Component APIs

### Editor Component

```typescript
interface EditorProps {
  // Optional: Initial model to load
  initialModel?: ModelGraph
  // Callback when model is modified
  onModelChange?: (model: ModelGraph) => void
  // Callback when training starts
  onTrainingStart?: () => void
  // Callback when training ends
  onTrainingEnd?: (results: TrainingResult) => void
}

interface EditorRef {
  // Get current model configuration
  getModel(): ModelGraph
  // Save current model
  saveModel(): Promise<boolean>
  // Load a model
  loadModel(filePath: string): Promise<boolean>
  // Export generated Python code
  exportCode(): string
  // Reset editor
  clear(): void
}
```

---

### ParameterViewer Component

```typescript
interface ParameterViewerProps {
  node: ModelNode
  onParameterChange?: (paramName: string, value: any) => void
  onSave?: (parameters: Parameter[]) => void
  onCancel?: () => void
}
```

---

### HyperparameterModal Component

```typescript
interface HyperparameterModalProps {
  isOpen: boolean
  hyperparameters: HyperparameterConfig
  onChange?: (hyperparameters: HyperparameterConfig) => void
  onSubmit?: (hyperparameters: HyperparameterConfig) => void
  onClose?: () => void
}
```

---

### TrainingGraphs Component

```typescript
interface TrainingGraphsProps {
  // Training history data
  history?: TrainingHistory
  // Current epoch
  currentEpoch?: number
  // Total epochs
  totalEpochs?: number
  // Auto-scroll to latest
  autoScroll?: boolean
}

interface TrainingHistory {
  epochs: number[]
  loss: number[]
  accuracy?: number[]
  valLoss?: number[]
  valAccuracy?: number[]
  customMetrics?: Record<string, number[]>
}
```

---

### DiagnosticViewer Component

```typescript
interface DiagnosticViewerProps {
  // Log entries to display
  logs: LogEntry[]
  // Auto-scroll to bottom
  autoScroll?: boolean
  // Enable search/filter
  enableSearch?: boolean
  // Maximum logs to keep in memory
  maxLogs?: number
}

interface LogEntry {
  timestamp: Date
  level: 'info' | 'warning' | 'error' | 'success'
  message: string
  source?: string
  stackTrace?: string
}
```

---

## Data Models

### ModelNode

```typescript
interface ModelNode {
  // Unique identifier
  id: number

  // Node type/layer name (e.g., 'Conv2D', 'Dense')
  feature: string

  // Display label in the editor
  label: string

  // Target framework
  framework: 'PyTorch' | 'TensorFlow'

  // Node category (e.g., 'Layer', 'Activation', 'Loss')
  nodeType: string

  // Node parameters
  parameters: Parameter[]

  // Visual position in the editor
  position?: {
    x: number
    y: number
  }

  // Whether this node has been fully configured
  isConfigured?: boolean

  // Additional metadata
  metadata?: Record<string, any>
}
```

---

### Parameter

```typescript
interface Parameter {
  // Parameter name
  name: string

  // Current value
  value: any

  // Data type (e.g., 'int', 'float', 'string', 'boolean')
  type: string

  // Human-readable description
  description: string

  // Whether this parameter is required
  isRequired: boolean

  // Validation constraints
  constraints?: {
    min?: number
    max?: number
    step?: number
    values?: any[]
    pattern?: string
    customValidator?: (value: any) => boolean
  }

  // Help text or tooltip
  hint?: string

  // Default value
  default?: any
}
```

---

### Edge

```typescript
interface Edge {
  // Unique identifier
  id: number | string

  // Source node ID
  from: number

  // Target node ID
  to: number

  // Connection metadata
  metadata?: {
    color?: string
    label?: string
    width?: number
  }
}
```

---

### ModelGraph

```typescript
interface ModelGraph {
  // Array of all nodes in the model
  nodes: ModelNode[]

  // Array of all edges/connections
  edges: Edge[]

  // Model hyperparameters
  hyperparameters: HyperparameterConfig

  // Model metadata
  metadata?: {
    name?: string
    description?: string
    version?: string
    createdAt?: Date
    modifiedAt?: Date
    framework?: string
    author?: string
  }
}
```

---

### InputDataResult

```typescript
interface InputDataResult {
  // Type of input data
  type: 'tabular' | 'image' | 'text'

  // Extracted data information
  data: {
    // For tabular: list of feature column names
    features?: string[]

    // For tabular: target column name
    target?: string

    // For image classification: list of class names
    classes?: string[]

    // Data shape
    shape?: [number, ...number[]]

    // Statistical information
    stats?: {
      samples: number
      features: number
      classes?: number
      splitRatio?: { train: number; test: number }
    }

    // Additional metadata
    metadata?: Record<string, any>
  }
}
```

---

### TrainingResult

```typescript
interface TrainingResult {
  success: boolean
  message: string

  // Trained model information
  model?: {
    path: string
    framework: string
    size: number
  }

  // Training metrics
  metrics?: {
    finalLoss: number
    finalAccuracy: number
    bestAccuracy: number
    bestLoss: number
    trainTime: number  // in seconds
    epochsCompleted: number
  }

  // Training history
  history?: {
    loss: number[]
    accuracy: number[]
    valLoss?: number[]
    valAccuracy?: number[]
  }

  // Warnings or information
  warnings?: string[]
}
```

---

## Integration Examples

### Example 1: Creating and Training a Model Programmatically

```javascript
// 1. Create model structure
const modelGraph = {
  nodes: [
    {
      id: 1,
      feature: 'Input',
      label: 'Input Layer',
      framework: 'PyTorch',
      nodeType: 'Input',
      parameters: [
        {
          name: 'input_size',
          value: 784,
          type: 'int',
          description: 'Input dimension',
          isRequired: true
        }
      ]
    },
    {
      id: 2,
      feature: 'Dense',
      label: 'Dense Layer',
      framework: 'PyTorch',
      nodeType: 'Layer',
      parameters: [
        {
          name: 'units',
          value: 128,
          type: 'int',
          description: 'Number of units',
          isRequired: true
        }
      ]
    },
    {
      id: 3,
      feature: 'Output',
      label: 'Output Layer',
      framework: 'PyTorch',
      nodeType: 'Output',
      parameters: [
        {
          name: 'output_size',
          value: 10,
          type: 'int',
          description: 'Number of classes',
          isRequired: true
        }
      ]
    }
  ],
  edges: [
    { id: 1, from: 1, to: 2 },
    { id: 2, from: 2, to: 3 }
  ],
  hyperparameters: {
    epochs: 10,
    batch_size: 32,
    learning_rate: 0.001,
    optimizer: 'Adam'
  }
};

// 2. Train the model
const result = await window.backend.trainModel(modelGraph);

if (result.success) {
  console.log('Training completed!');
  console.log('Final Accuracy:', result.metrics.finalAccuracy);
} else {
  console.error('Training failed:', result.message);
}
```

---

### Example 2: Loading and Modifying a Saved Model

```javascript
// 1. Load model
const loadResult = await window.api.loadModel({
  filePath: '/path/to/model.mff'
});

if (!loadResult.success) {
  console.error('Failed to load model');
  return;
}

const model = loadResult.modelGraph;

// 2. Modify hyperparameters
model.hyperparameters.epochs = 20;
model.hyperparameters.learning_rate = 0.0001;

// 3. Modify a node parameter
const denseLayer = model.nodes.find(n => n.feature === 'Dense');
if (denseLayer) {
  const unitsParam = denseLayer.parameters.find(p => p.name === 'units');
  if (unitsParam) {
    unitsParam.value = 256;
  }
}

// 4. Save modified model
const saveResult = await window.api.saveModel({
  modelGraph: model,
  filePath: '/path/to/model_v2.mff',
  fileName: 'model_v2.mff'
});

if (saveResult.success) {
  console.log('Model saved successfully');
}
```

---

### Example 3: Configuring Input Data

```javascript
// 1. Open file picker
const fileResult = await window.dialog.filePicker({
  title: 'Select Dataset',
  filters: [
    { name: 'CSV Files', extensions: ['csv'] },
    { name: 'Excel Files', extensions: ['xlsx', 'xls'] }
  ]
});

if (fileResult.canceled) {
  return;
}

const filePath = fileResult.filePaths[0];

// 2. Process input data
const inputConfig = {
  filePath: filePath,
  fileType: filePath.endsWith('.csv') ? 'csv' : 'excel',
  testSplit: 0.2,
  normalize: true
};

// 3. Integrate with model
modelGraph.metadata = {
  ...modelGraph.metadata,
  inputConfig: inputConfig
};
```

---

### Example 4: Listening to Training Output

```javascript
// Subscribe to training messages
window.dialog.onDialogUpdate((message) => {
  // Handle different message types
  if (message.includes('Epoch')) {
    // Parse epoch information
    console.log('Epoch progress:', message);
  } else if (message.includes('Loss')) {
    // Parse loss information
    console.log('Loss:', message);
  } else if (message.includes('Error')) {
    // Handle errors
    console.error('Training error:', message);
  } else {
    // Regular log
    console.log('Training log:', message);
  }
});

// Start training
await window.backend.trainModel(modelGraph);
```

---

## Error Handling

### Common Error Codes

```javascript
const ErrorCodes = {
  // Model errors
  INVALID_GRAPH: 'ERR_001',
  CYCLE_DETECTED: 'ERR_002',
  MISSING_INPUT_NODE: 'ERR_003',
  MISSING_OUTPUT_NODE: 'ERR_004',
  INVALID_NODE_CONNECTION: 'ERR_005',

  // Input data errors
  INVALID_DATA_FORMAT: 'ERR_101',
  MISSING_REQUIRED_FIELD: 'ERR_102',
  INVALID_FILE_PATH: 'ERR_103',
  UNSUPPORTED_FILE_TYPE: 'ERR_104',

  // Training errors
  TRAINING_FAILED: 'ERR_201',
  PYTHON_EXECUTION_ERROR: 'ERR_202',
  INSUFFICIENT_MEMORY: 'ERR_203',
  TIMEOUT: 'ERR_204',

  // File operation errors
  FILE_NOT_FOUND: 'ERR_301',
  PERMISSION_DENIED: 'ERR_302',
  DISK_FULL: 'ERR_303',

  // General errors
  UNKNOWN_ERROR: 'ERR_999'
};
```

---

### Error Handling Example

```javascript
try {
  // Validate graph before training
  const graphController = new GraphController();
  graphController.setGraphData(modelGraph);
  
  const validation = graphController.validateGraph();
  if (!validation.isValid) {
    throw {
      code: 'INVALID_GRAPH',
      message: 'Graph validation failed',
      errors: validation.errors
    };
  }

  // Check for cycles
  const cycles = graphController.detectCycles();
  if (cycles.length > 0) {
    throw {
      code: 'CYCLE_DETECTED',
      message: 'Graph contains cycles',
      cycles: cycles
    };
  }

  // Train model
  const result = await window.backend.trainModel(modelGraph);
  if (!result.success) {
    throw {
      code: result.errorCode || 'TRAINING_FAILED',
      message: result.message
    };
  }

  return result;

} catch (error) {
  // Handle error
  console.error(`Error [${error.code}]: ${error.message}`);
  
  // Show user-friendly message
  window.api.showNotification({
    type: 'error',
    title: 'Training Failed',
    message: error.message,
    duration: 5000
  });
}
```

---

## Best Practices

### 1. Always Validate Before Training
```javascript
// Always validate the graph structure
const validation = graphController.validateGraph();
if (!validation.isValid) {
  // Handle validation errors
  return;
}
```

### 2. Use Async/Await for IPC Calls
```javascript
// Good
async function trainModel() {
  try {
    const result = await window.backend.trainModel(modelGraph);
  } catch (error) {
    // Handle error
  }
}

// Bad - Don't use callbacks
window.backend.trainModel(modelGraph, (result) => {
  // Callback-based approach not recommended
});
```

### 3. Monitor Training Progress
```javascript
// Subscribe to updates before starting training
window.dialog.onDialogUpdate((message) => {
  updateUI(message);
});

// Then start training
await window.backend.trainModel(modelGraph);
```

### 4. Handle Errors Gracefully
```javascript
try {
  const result = await window.api.saveModel(modelGraph, filePath);
} catch (error) {
  // Show error notification
  window.api.showNotification({
    type: 'error',
    title: 'Save Failed',
    message: error.message
  });
}
```

### 5. Validate User Input
```javascript
// Validate parameter values before updating
function updateNodeParameter(nodeId, paramName, value) {
  const node = modelNodeManager.getNode(nodeId);
  const param = node.parameters.find(p => p.name === paramName);
  
  if (param && isValidValue(value, param)) {
    modelNodeManager.updateNodeParameter(nodeId, paramName, value);
  } else {
    throw new Error('Invalid parameter value');
  }
}
```

---

## Summary

This document provides comprehensive API reference for ModelForge including:

- **IPC API Reference**: All channels for frontend-backend communication
- **Backend Service APIs**: Core services and controllers
- **Frontend Component APIs**: React component interfaces
- **Data Models**: TypeScript interfaces for all data structures
- **Integration Examples**: Practical code examples
- **Error Handling**: Common error codes and handling patterns
- **Best Practices**: Recommended patterns for using the APIs

Use this documentation for:
- Integrating ModelForge into other applications
- Extending the application with new features
- Building custom frontends or backends
- API testing and debugging
- Documentation generation
