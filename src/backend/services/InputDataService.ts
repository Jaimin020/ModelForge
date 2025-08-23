import { InputDataHandlerFactory } from '../Core/InputDataProcessing/InputDataHandlerFactory';
import {
  InputDataResult,
  ValidationResult,
} from '../Core/InputDataProcessing/AbstractInputDataHandler';

export class InputDataService {
  private static instance: InputDataService;

  private constructor() {}

  static getInstance(): InputDataService {
    if (!InputDataService.instance) {
      InputDataService.instance = new InputDataService();
    }
    return InputDataService.instance;
  }

  processInputData(inputData: any, hyperparameters?: any): InputDataResult {
    const handler = InputDataHandlerFactory.createHandler(inputData);

    // Validate input data first
    // const validation = handler.validateInputData();
    // if (!validation.isValid) {
    //   throw new Error(`Input validation failed: ${validation.errors.join(', ')}`);
    // }

    // Extract and return processed data
    const result = handler.extractInputData();
    // Merge hyperparameters if provided
    if (hyperparameters?.batch_size) {
      result.data.batch_size = Number(hyperparameters.batch_size);
    }
    return result;
  }

  validateInputData(inputData: any): ValidationResult {
    const handler = InputDataHandlerFactory.createHandler(inputData);
    return handler.validateInputData();
  }
}
