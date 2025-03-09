export class ModelData {
  private inputData: any;
  private layersData: any;
  private hyperparameters: any;
  private lossFunction: any;

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

  generateModelData(modelName: string, layersData: any[], hyperparameters: any) {
    this.inputData = layersData[0];
    this.lossFunction = layersData[layersData.length - 1]; 
    this.layersData  = {
      model_name: modelName,
      layers: this.formatLayerData(layersData.slice(1, -1)),
    };
    this.hyperparameters = hyperparameters;
  }

  getInputData() {
    return this.inputData;
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
