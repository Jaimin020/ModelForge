// For error and message strings
import {
  editorMessages,
  editorErrors,
  editorWarns,
  editorSuccessMsgs,
} from '../../../utils/strings/editorStrings.js';
import { loaderMessages } from '../../../utils/strings/loaderStrings.js';

const saveSetup = async (params) => {
  if (params.isRunning) {
    params.appendToOutput(editorErrors.STOP_TRAINING_BEFORE_SAVE, 'error');
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
      params.pathToSaveRef.current,
    );
    params.setLoadingMessage(loaderMessages.EMPTY);
    params.appendToOutput(
      editorSuccessMsgs.MODEL_SAVED_SUCCESS(params.pathToSaveRef.current),
      'success',
    );
  } catch (error) {
    params.setLoadingMessage(loaderMessages.EMPTY);
    console.error(editorErrors.ERROR_SAVING_MODEL(error));
    params.appendToOutput(
      editorErrors.ERROR_SAVING_MODEL(error.message),
      'error',
    );
  }
};

export const saveModel = async (params) => {
  if (params.pathToSaveRef.current === null) {
    await saveModelAs(params);
    return;
  }
  await saveSetup(params);
  await saveModelThroughBackend(params);
};

export const saveModelAs = async (params) => {
  await saveSetup(params);
  let prevPath = params.pathToSaveRef.current;
  params.pathToSaveRef.current = await window.dialog.saveFilePathPicker({
    defaultName: 'model.mff',
    extensions: ['mff'],
  });

  if (params.pathToSaveRef.current === null) {
    params.pathToSaveRef.current = prevPath;
    params.setLoadingMessage(loaderMessages.EMPTY);
    params.appendToOutput(editorWarns.SAVE_CANCELLED, 'warn');
    return;
  }
  await saveModelThroughBackend(params);
};
