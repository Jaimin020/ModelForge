export abstract class AbstractInputDataHandler {
  protected inputData: any;

  constructor(inputData: any) {
    this.inputData = inputData;
  }

  abstract extractInputData(): InputDataResult;

  abstract validateInputData(): ValidationResult;

  protected findParameter(paramName: string): any {
    // TODO: Implement a more robust parameter search if needed
    return this.inputData.parameters?.find((p: any) => p.name === paramName);
  }
}

export interface InputDataResult {
  type: InputType;
  data: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export enum InputType {
  TABULAR = 'tabular',
  IMAGE = 'image',
  TEXT = 'text',
}
