export abstract class AbstractCodeGenerator {
  protected inputData: any;

  protected modelData: any;

  protected hyperparameters: any;

  protected lossFunction: any;

  constructor(
    modelData: any,
    hyperparameters: any,
    inputData: any,
    lossFunction: any,
  ) {
    this.inputData = inputData;
    this.modelData = modelData;
    this.hyperparameters = hyperparameters;
    this.lossFunction = lossFunction;
  }

  abstract getImports(): string;

  abstract getInput(): string;

  abstract getModel(): string;

  abstract getHyperparameters(): string;

  abstract getTrainingLoop(): string;

  abstract getSaveModel(): string;

  generateCode(): string {
    return [
      this.getImports(),
      this.getInput(),
      this.getHyperparameters(),
      this.getModel(),
      this.getTrainingLoop(),
      this.getSaveModel(),
    ].join('\n\n');
  }
}
