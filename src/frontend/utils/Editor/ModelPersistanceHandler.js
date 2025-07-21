// For error and message strings
import * as editorStrings from '../strings/editorStrings.js';
import { loaderMessages } from '../strings/loaderStrings.js';
import { ModelNodeManager } from '../graphMngr/ModelNodeManager.ts';


// TODO: Make it a class

let pathToSave = null;

const saveSetup = async (params) => {
  if (params.isRunning) {
    params.appendToOutput(
      editorStrings.errors.STOP_TRAINING_BEFORE_SAVE,
      'error',
    );
    return;
  }
  params.setLoadingMessage(loaderMessages.SAVING);
  // Update node positions before saving
  params.updateNodePositions();
  params.graphManager.setNodes(params.nodes);
  params.graphManager.setEdges(params.edges);
};

const saveModelThroughBackend = async (params) => {
  try {
    await window.backend.saveModel(
      params.graphManager.getGraphDataAsJson(),
      pathToSave,
    );
    params.setLoadingMessage(loaderMessages.EMPTY);
    params.appendToOutput(
      editorStrings.success.MODEL_SAVED_SUCCESS(pathToSave),
      'success',
    );
  } catch (error) {
    params.setLoadingMessage(loaderMessages.EMPTY);
    console.error(editorStrings.errors.ERROR_SAVING_MODEL(error));
    params.appendToOutput(
      editorStrings.errors.ERROR_SAVING_MODEL(error.message),
      'error',
    );
  }
};

export const saveModel = async (params) => {
  if (pathToSave === null) {
    await saveModelAs(params);
    return;
  }
  await saveSetup(params);
  await saveModelThroughBackend(params);
};

export const saveModelAs = async (params) => {
  await saveSetup(params);
  let prevPath = pathToSave;
  pathToSave = await window.dialog.saveFilePathPicker({
    defaultName: 'model.mff',
    extensions: ['mff'],
  });

  if (pathToSave === null) {
    pathToSave = prevPath;
    params.setLoadingMessage(loaderMessages.EMPTY);
    params.appendToOutput(editorStrings.warns.SAVE_CANCELLED, 'warn');
    return;
  }
  await saveModelThroughBackend(params);
};

export const onOpen = async (params) => {
  params.setLoadingMessage(loaderMessages.OPENING);
  const pathToload = await window.dialog.filePicker({
    name: 'Load_File',
    extensions: ['mff'],
  });
  if (!pathToload) {
    params.setLoadingMessage(loaderMessages.EMPTY);
    params.appendToOutput(editorStrings.warns.LOAD_CANCELLED, 'warn');
    return;
  }
  params.setLoadingMessage(loaderMessages.EMPTY);
  try {
    params.setLoadingMessage(loaderMessages.LOADING);
    const result = await window.backend.loadModel(pathToload);

    if (!(result && result.nodes && result.edges)) {
      params.setLoadingMessage(loaderMessages.EMPTY);
      params.appendToOutput(
        editorStrings.errors.LOAD_FAILED_INVALID_MODEL,
        'error',
      );
      return;
    }

    // Clear existing nodes and edges
    params.nodes.current.clear();
    params.edges.current.clear();
    params.graphManager.clearAllNodesAndEdges();

    // Add the loaded nodes to the network
    params.nodes.current.add(result.nodes);

    // Add the loaded edges to the network
    params.edges.current.add(result.edges);

    // Add hyperparameters if they exist
    if (result.hyperparameters) {
      params.graphManager.setHyperparameters(result.hyperparameters);
    }
    // Restore the model nodes in the ModelNodeManager
    const nodeManager = ModelNodeManager.getInstance();
    result.nodes.forEach((node) => {
      nodeManager.createNode(node.id, {
        name: node.name,
        feature: node.feature,
        library: node.library,
        framework: node.framework,
        codeId: node.codeId,
        inport: node.inport,
        outport: node.outport,
        parameters: node.parameters,
        code: node.code,
      });
    });

    // Set hyperparameters if they exist
    if (result.hyperparameters) {
      params.graphManager.setHyperparameters(result.hyperparameters);
    }

    // Fit the network to show all nodes
    if (params.networkInstance.current) {
      params.networkInstance.current.fit();
    }

    pathToSave = pathToload;
    params.appendToOutput(
      editorStrings.success.MODEL_LOADED_SUCCESS,
      'success',
    );
    params.setLoadingMessage(loaderMessages.EMPTY);
  } catch (error) {
    console.error(editorStrings.errors.ERROR_LOADING_MODEL(error));
    params.appendToOutput(
      editorStrings.errors.ERROR_LOADING_MODEL(error.message),
      'error',
    );
  }
};
