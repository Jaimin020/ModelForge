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

  getInputData() {
    const selectedFeatures =
      this.inputData.parameters.find((p: any) => p.name === 'Selected Feature')
        ?.value || [];
    return {
      file_name:
        this.inputData.parameters.find((p: any) => p.name === 'File')?.value ||
        'dataset.csv',
      train_split:
        this.inputData.parameters.find((p: any) => p.name === 'Train Split')
          ?.value || 0.8,
      test_split:
        this.inputData.parameters.find((p: any) => p.name === 'Train Split')
          ?.value || 0.2,
      features: Array.isArray(selectedFeatures)
        ? selectedFeatures.map((f) =>
            decodeURIComponent(f).replace(/&#34;/g, '"').replace(/['"]/g, ''),
          )
        : [
            decodeURIComponent(selectedFeatures)
              .replace(/&#34;/g, '"')
              .replace(/['"]/g, ''),
          ],
      predictor:
        this.inputData.parameters.find(
          (p: any) => p.name === 'Selected Predictor',
        )?.value || [],
      batch_size: Number(this.hyperparameters.batch_size || 32),
    };
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
