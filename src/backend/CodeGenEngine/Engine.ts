import { ModelData } from './utils/ModelData';
import { getModelPyCode } from './CodeGen/getModelPyCode';

export class Engine {
  modelDataObj = new ModelData();
  constructor(rawData: any) {
    this.modelDataObj.generateModelData('MyModel', rawData);
  }

  getInputData() {}

  getLossFunctionData() {}

  getOptimizerData() {}

  getLayerData() {
    return this.modelDataObj.getModelData();
  }

  getPyCode() {
    var code = '';
    code += getModelPyCode(this.getLayerData());
    return code;
  }
}
