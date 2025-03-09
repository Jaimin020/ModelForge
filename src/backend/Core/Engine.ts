import { ModelData } from './utils/ModelData';
import { getModelPyCode } from './CodeGen/getModelPyCode';

export class Engine {
  modelDataObj = new ModelData();
  constructor(rawLayersData: any, hyperparameters: any) {
    this.modelDataObj.generateModelData('MyModel', rawLayersData , hyperparameters);
  }

  getInputData() {}

  getLossFunctionData() {}

  getOptimizerData() {}

  getLayerData() {
    return this.modelDataObj.getLayersData();
  }

  getPyCode() {
    var code = '';
    code += getModelPyCode(this.getLayerData());
    return code;
  }
}
