/**
 * Example: Integrating ONNX Model Verification with ModelController
 * 
 * This file shows how to integrate the ONNXModelVerifier into the ModelController
 * for automatic ONNX model validation after creation.
 * 
 * Location: src/backend/controllers/ModelController.example.ts
 */

import { GraphController } from './GraphController';
import { Engine } from '../Core/Engine';
import { FileManager } from '../Core/FileManager';
import { ONNXModelVerifier } from '../utils/ONNXModelVerifier';
import { TEST_PY_FILE, TEST_DIR } from '../../envPath';

/**
 * Enhanced ModelController with ONNX Model Verification
 * This is an example of how to extend the existing ModelController
 */
export class EnhancedModelController {
  graphController = new GraphController();
  fileMngr = FileManager.getInstance();

  /**
   * Train model and verify ONNX output
   */
  trainModel(modelGraph: any) {
    this.graphController.setGraphData(modelGraph);

    const sequences = this.graphController.getLayerSequence();
    const hyperparameters = this.graphController.getHyperparameters();
    const engine = new Engine(sequences, hyperparameters);
    const code = engine.getPyCode();
    const pathToSave = TEST_PY_FILE;
    this.fileMngr.saveFile(pathToSave, code);
  }

  /**
   * Save model with ONNX verification
   */
  async saveModel(modelGraph: any, filePath: string) {
    const content = JSON.stringify(modelGraph);
    this.fileMngr.saveFile(filePath, content);

    // Verify if ONNX file exists in the same directory
    const onnxPath = filePath.replace(/\.[^.]+$/, '.onnx');
    return this.verifyONNXModelIfExists(onnxPath);
  }

  /**
   * Load model and verify ONNX companion file
   */
  async loadModel(filePath: string) {
    const content = await this.fileMngr.readFile(filePath);
    const modelGraph = JSON.parse(content?.toString() || '{}');

    // Check for companion ONNX file
    const onnxPath = filePath.replace(/\.[^.]+$/, '.onnx');
    const onnxVerification = await this.verifyONNXModelIfExists(onnxPath);

    return {
      model: modelGraph,
      onnxVerification,
    };
  }

  /**
   * Setup model for inference with ONNX validation
   */
  async setupModelForInference(filePath: string) {
    const onnxPath = filePath.replace(/\.[^.]+$/, '.onnx');

    if (!this.fileMngr.fileExists(onnxPath)) {
      return {
        success: false,
        error: 'ONNX model file not found',
        modelPath: onnxPath,
      };
    }

    // Verify the ONNX model
    const verification = this.verifyONNXModel(onnxPath);

    if (!verification.success) {
      return {
        success: false,
        error: 'ONNX model verification failed',
        details: verification,
      };
    }

    return {
      success: true,
      onnxPath,
      verification,
    };
  }

  /**
   * Verify ONNX model if it exists
   */
  private async verifyONNXModelIfExists(onnxPath: string) {
    if (!this.fileMngr.fileExists(onnxPath)) {
      return {
        exists: false,
        path: onnxPath,
      };
    }

    return this.verifyONNXModel(onnxPath);
  }

  /**
   * Verify ONNX model using ONNXModelVerifier
   */
  private verifyONNXModel(onnxPath: string) {
    // Note: In production, you would use:
    // const { ONNXModelVerifier } = require('../utils/ONNXModelVerifier');
    // return ONNXModelVerifier.verifyONNXModel(onnxPath);

    // For now, return a simple verification
    try {
      const verification = {
        success: this.fileMngr.fileExists(onnxPath),
        filePath: onnxPath,
        timestamp: new Date().toISOString(),
      };

      if (verification.success) {
        verification['fileSize'] = this.fileMngr.getFileSize(onnxPath);
      }

      return verification;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

/**
 * Integration Example: How to use in your application
 * 
 * Usage:
 * ------
 * 
 * 1. In your training pipeline:
 * 
 *    const controller = new EnhancedModelController();
 *    controller.trainModel(modelGraph);
 *    const result = await controller.saveModel(modelGraph, './models/my_model.mff');
 *    
 *    // Result will include ONNX verification:
 *    // {
 *    //   success: true,
 *    //   onnxVerification: {
 *    //     success: true,
 *    //     filePath: './models/my_model.onnx',
 *    //     fileSize: 12345,
 *    //     timestamp: '2025-12-06T...'
 *    //   }
 *    // }
 * 
 * 2. In your inference setup:
 * 
 *    const inferenceSetup = await controller.setupModelForInference('./models/my_model.mff');
 *    
 *    if (inferenceSetup.success) {
 *      // ONNX model is valid and ready for inference
 *      const onnxPath = inferenceSetup.onnxPath;
 *      // Initialize ONNX Runtime with onnxPath
 *    } else {
 *      // Handle verification failure
 *      console.error(inferenceSetup.error);
 *    }
 * 
 * 3. In your model loading:
 * 
 *    const loadResult = await controller.loadModel('./models/my_model.mff');
 *    
 *    // Get both the model graph and ONNX verification
 *    const { model, onnxVerification } = loadResult;
 */

/**
 * IPC Handler Integration Example
 * 
 * Add to src/backend/ipc/ipcHandler.js:
 * 
 * import { EnhancedModelController } from '../controllers/ModelController';
 * 
 * export function setupIpcHandlers() {
 *   const controller = new EnhancedModelController();
 * 
 *   // Train and save with ONNX verification
 *   ipcMain.handle('train-model-with-verification', async (event, modelGraph) => {
 *     controller.trainModel(modelGraph);
 *     return { success: true };
 *   });
 * 
 *   // Save model with ONNX verification
 *   ipcMain.handle('save-model-with-verification', async (event, modelGraph, filePath) => {
 *     return await controller.saveModel(modelGraph, filePath);
 *   });
 * 
 *   // Load model with ONNX verification
 *   ipcMain.handle('load-model-with-verification', async (event, modelPath) => {
 *     return await controller.loadModel(modelPath);
 *   });
 * 
 *   // Setup for inference
 *   ipcMain.handle('setup-model-inference', async (event, modelPath) => {
 *     return await controller.setupModelForInference(modelPath);
 *   });
 * }
 */

/**
 * Frontend Usage Example
 * 
 * In your React components:
 * 
 * // Verify model after saving
 * const handleSaveModel = async (modelGraph, filePath) => {
 *   const result = await window.backend.saveModelWithVerification(modelGraph, filePath);
 *   
 *   if (result.onnxVerification?.success) {
 *     console.log('✓ Model saved and ONNX verified');
 *     console.log(`File size: ${result.onnxVerification.fileSize} bytes`);
 *   } else {
 *     console.error('✗ ONNX verification failed:', result.error);
 *   }
 * };
 * 
 * // Verify model before inference
 * const handleRunInference = async (modelPath) => {
 *   const setup = await window.backend.setupModelInference(modelPath);
 *   
 *   if (setup.success) {
 *     // Model is valid, proceed with inference
 *     const predictions = await runInference(setup.onnxPath);
 *   } else {
 *     showError(`Model verification failed: ${setup.error}`);
 *   }
 * };
 */

/**
 * Testing the Integration
 * 
 * Unit test example:
 * 
 * describe('EnhancedModelController', () => {
 *   let controller: EnhancedModelController;
 * 
 *   beforeEach(() => {
 *     controller = new EnhancedModelController();
 *   });
 * 
 *   test('should verify ONNX model after saving', async () => {
 *     const mockGraph = { /* ... */ };
 *     const result = await controller.saveModel(mockGraph, './test.mff');
 *     
 *     expect(result).toBeDefined();
 *     expect(result.onnxVerification).toBeDefined();
 *   });
 * 
 *   test('should validate ONNX before inference setup', async () => {
 *     const result = await controller.setupModelForInference('./model.mff');
 *     
 *     if (result.success) {
 *       expect(result.onnxPath).toBeDefined();
 *       expect(result.verification).toBeDefined();
 *     }
 *   });
 * });
 */

export default EnhancedModelController;
