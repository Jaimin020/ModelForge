import * as ejs from 'ejs';
import {
  importTemplate,
  inputTemplate,
  hyperparameterTemplate,
  modelTemplate,
  trainingLoopTemplate,
  imageInputTemplate,
  saveONNXModelAndWeightsTemplate,
} from './PyCode.js';
import { AbstractCodeGenerator } from '../AbstractCodeGenerator';
import { TEST_MODEL_WEIGHT } from '../../../../envPath';

export class PyTorchCodeGenerator extends AbstractCodeGenerator {
  getImports(): string {
    return importTemplate;
  }

  getInput(): string {
    if (this.inputData.type === 'image') {
      return ejs.render(imageInputTemplate, this.inputData.data);
    }
    return ejs.render(inputTemplate, this.inputData.data);
  }

  getModel(): string {
    return ejs.render(modelTemplate, this.modelData);
  }

  getHyperparameters(): string {
    const params = {
      learning_rate: this.hyperparameters.learning_rate,
      epochs: this.hyperparameters.epochs,
    };
    return ejs.render(hyperparameterTemplate, params);
  }

  getTrainingLoop(): string {
    const lossFunc = this.lossFunction.codeId;
    const params = {
      optimizer: this.hyperparameters.optimizer,
      loss_function: lossFunc,
    };
    return ejs.render(trainingLoopTemplate, params);
  }

  getSaveModel(): string {
    return ejs.render(saveONNXModelAndWeightsTemplate,{ weights_path: TEST_MODEL_WEIGHT });
  }
}
