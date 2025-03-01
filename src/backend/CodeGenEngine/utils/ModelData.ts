export class ModelData {
    private data: any;
    private formatLayerData(layers: any[]) {
        return layers.map(layer => {
            const formattedLayer: any = {
                type: layer.name
            };

            if (Object.keys(layer.parameters || {}).length > 0) {
                formattedLayer.params = layer.parameters;
            }

            return formattedLayer;
        });
    }

    generateModelData(modelName: string, layers: any[]) {
        const modelData = {
            model_name: modelName,
            layers: this.formatLayerData(layers)
        };

        this.data = modelData;
    }

    getModelData() {
        return this.data;
    }
}
