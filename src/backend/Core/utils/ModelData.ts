import { InputDataService } from '../../services/InputDataService';

export class ModelData {
  private inputData: any;

  private layersData: any;

  private hyperparameters: any;

  private lossFunction: any;

  private inputDataService: InputDataService;

  constructor() {
    this.inputDataService = InputDataService.getInstance();
  }

  private formatLayerData(layers: any[]) {
    return layers.map((layer) => {
      const formattedLayer: any = {
        type: layer.name,
      };

      if (Object.keys(layer.parameters || {}).length > 0) {
        formattedLayer.params = layer.parameters;
      }

      return formattedLayer;
    });
  }

  generateModelData(
    modelName: string,
    layersData: any[],
    hyperparameters: any,
  ) {
    this.inputData = layersData[0];
    this.lossFunction = layersData[layersData.length - 1];
    this.layersData = {
      model_name: modelName,
      layers: this.formatLayerData(layersData.slice(1, -1)),
    };
    this.hyperparameters = hyperparameters;
  }

  /**
   * Processes and retrieves the input data using the InputDataService.
   *
   * @returns {any} The processed input data based on the current input and hyperparameters.
   */
  getInputData() {
    const processedData = this.inputDataService.processInputData(
      this.inputData,
      this.hyperparameters,
    );
    return processedData;
  }

  getLayersData() {
    return this.layersData;
  }

  getLossFunction() {
    return this.lossFunction;
  }

  getHyperparameters() {
    return this.hyperparameters;
  }

  setInputData(input: any) {
    this.inputData = input;
  }

  setLayersData(layers: any) {
    this.layersData = layers;
  }

  setLossFunction(loss: any) {
    this.lossFunction = loss;
  }

  setHyperparameters(params: any) {
    this.hyperparameters = params;
  }
}
