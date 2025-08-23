import {
  AbstractInputDataHandler,
  InputType,
} from './AbstractInputDataHandler';
import { TabularInputDataHandler } from './TabularInputDataHandler';
import { ImageInputDataHandler } from './ImageInputDataHandler';

export class InputDataHandlerFactory {
  static createHandler(inputData: any): AbstractInputDataHandler {
    const inputType = this.detectInputType(inputData);

    switch (inputType) {
      case InputType.TABULAR:
        return new TabularInputDataHandler(inputData);
      case InputType.IMAGE:
        return new ImageInputDataHandler(inputData);
      default:
        throw new Error(`Unsupported input type: ${inputType}`);
    }
  }

  // TODO: Implement a more robust input type detection mechanism
  // Currently, it checks for specific parameters to determine the type
  // This is a basic implementation and may need to be extended for more complex scenarios
  private static detectInputType(inputData: any): string {
    const parameters = inputData.parameters || [];

    // Check for tabular-specific parameters
    if (parameters.some((p: any) => p.name === 'Selected Feature')) {
      return 'tabular';
    }

    // Check for image-specific parameters
    if (parameters.some((p: any) => p.name === 'Selected Classes')) {
      return 'image';
    }

    throw new Error('Unable to detect input type from parameters');
  }
}
