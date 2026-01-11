import { GraphController } from './GraphController';
import { Engine } from '../Core/Engine';
import { FileManager } from '../Core/FileManager';
import { TEST_PY_FILE, TEST_DIR } from '../../envPath';
import ONNXModelVerifier from '../utils/ONNXModelVerifier';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

const ort = require('onnxruntime-node');
const JSZip = require('jszip');
const npyz = require('npyz');
export class ModelController {
  graphController = new GraphController();

  fileMngr = FileManager.getInstance();

  trainModel(modelGraph: any) {
    this.graphController.setGraphData(modelGraph);

    const sequences = this.graphController.getLayerSequence();
    const hyperparameters = this.graphController.getHyperparameters();
    const engine = new Engine(sequences, hyperparameters);
    const code = engine.getPyCode();
    const pathToSave = TEST_PY_FILE;
    this.fileMngr.saveFile(pathToSave, code);
  }

  async saveModel(modelGraph: any, filePath: string) {
    const content = JSON.stringify(modelGraph);
    this.fileMngr.saveFile(filePath, content);
  }

  async loadModel(filePath: string) {
    const content = await this.fileMngr.readFile(filePath);
    const modelGraph = JSON.parse(content?.toString() || '{}');
    return modelGraph;
  }

  async loadNPZ(filePath: string) {
    const content = await fs.promises.readFile(
      '/Users/jaiminchauhan/Projects/Git/ModelForge/src/__tests__/test_dataset.json',
      'utf8',
    );
    return JSON.parse(content);
  }

  async setupModelForInference(filePath: string) {
    let modelPath = path.join(
      app.getAppPath(),
      'src/__tests__',
      'modelAndweights.zip',
    );
    modelPath = modelPath.replace(/\\/g, '/');

    if (!fs.existsSync(modelPath)) {
      throw new Error(`Model file not found at: ${modelPath}`);
    }

    // Load the zip file and extract to a temp directory in app path
    const zipData = fs.readFileSync(modelPath);
    const zip = await JSZip.loadAsync(zipData);

    // Create temp directory in app path
    const tempDir = path.join(app.getAppPath(), 'temp_onnx');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Extract files
    for (const [filename, file] of Object.entries(zip.files)) {
      if (!file.dir) {
        const filePath = path.join(tempDir, filename);
        const data = await file.async('nodebuffer');
        await fs.promises.writeFile(filePath, data);
      }
    }

    // Find the .onnx file
    const onnxFiles = (await fs.promises.readdir(tempDir)).filter((f) =>
      f.endsWith('.onnx'),
    );
    if (onnxFiles.length === 0) {
      throw new Error('ONNX file not found in the zip archive');
    }
    const onnxPath = path.join(tempDir, onnxFiles[0]);

    const session = await ort.InferenceSession.create(onnxPath);

    // Verify the model using the extracted ONNX file
    const result = await ONNXModelVerifier.verifyONNXModel(onnxPath);

    // Load test data
    const data = await this.loadNPZ(
      '/Users/jaiminchauhan/Projects/Git/ModelForge/src/__tests__/test_dataset.json',
    );
    const X_test = data.X_test as number[][]; // Nested array with all features
    const y_test = data.y_test as number[]; // True labels (continuous for regression)

    // Run inference on all test samples
    const predictions: number[] = [];
    for (const sample of X_test) {
      const shape = [1, sample.length];
      const inputData = new Float32Array(sample);
      const inputTensor = new ort.Tensor('float32', inputData, shape);
      const results = await session.run({
        [session.inputNames[0]]: inputTensor,
      });
      // Assume output is the predicted value
      const output = results[session.outputNames[0]].data as number[];
      predictions.push(output[0]);
    }

    // Compute regression metrics
    const n = y_test.length;
    const errors = predictions.map((pred, i) => pred - y_test[i]);
    const squaredErrors = errors.map((e) => e * e);
    const mae = errors.reduce((sum, e) => sum + Math.abs(e), 0) / n;
    const mse = squaredErrors.reduce((sum, se) => sum + se, 0) / n;
    const rmse = Math.sqrt(mse);
    const meanY = y_test.reduce((sum, y) => sum + y, 0) / n;
    const ssRes = squaredErrors.reduce((sum, se) => sum + se, 0);
    const ssTot = y_test.reduce((sum, y) => sum + (y - meanY) ** 2, 0);
    const r2 = 1 - ssRes / ssTot;

    // Create CSV with original data and predictions
    let csv = 'Index,X_test,y_test,Prediction\n';
    X_test.forEach((x, i) => {
      csv += `${i},${x.join(',')},${y_test[i]},${predictions[i]}\n`;
    });

    return {
      mae: mae.toFixed(4),
      mse: mse.toFixed(4),
      rmse: rmse.toFixed(4),
      r2: r2.toFixed(4),
      csv: csv,
    };
  }
}
