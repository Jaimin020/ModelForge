import { ModelData } from './utils/ModelData';
import { PyTorchCodeGenerator } from './CodeGen/pyTrochCodeGen/PytorchCodeGenerator';
import { AbstractCodeGenerator } from './CodeGen/AbstractCodeGenerator';

export class Engine {
  modelDataObj = new ModelData();
  private codeGenerator: AbstractCodeGenerator;

  constructor(rawLayersData: any, hyperparameters: any) {
    this.modelDataObj.generateModelData('MyModel', rawLayersData , hyperparameters);
    this.codeGenerator = this.createCodeGenerator("PyTorch");
  }

  private createCodeGenerator(framework: string): AbstractCodeGenerator {
    const layerData = this.modelDataObj.getLayersData();
    const hyperParams = this.modelDataObj.getHyperparameters();

    switch (framework.toLowerCase()) {
      case 'pytorch':
        return new PyTorchCodeGenerator(layerData, hyperParams);
      default:
        throw new Error(`Unsupported framework: ${framework}`);
    }
  }

  getInputData() {}

  getLossFunctionData() {}

  getOptimizerData() {}

  getLayerData() {
    return this.modelDataObj.getLayersData();
  }

  getPyCode() {
    return this.codeGenerator.generateCode();;
  }
}
