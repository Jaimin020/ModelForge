export abstract class AbstractCodeGenerator {
    protected inputData: any;
    protected modelData: any;
    protected hyperparameters: any;
  
    constructor(modelData: any, hyperparameters: any, inputData: any) {
      this.inputData = inputData;
      this.modelData = modelData;
      this.hyperparameters = hyperparameters;
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
        this.getInput()
        // this.getModel(),
        // this.getHyperparameters(),
        // this.getTrainingLoop(),
        // this.getSaveModel()
      ].join('\n\n');
    }
  }
  