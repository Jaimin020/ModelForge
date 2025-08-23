import { GraphAnalyzer } from '../graphMngr/GraphAnalyzer.ts';
import * as editorStrings from '../strings/editorStrings.js';

export const handleRun = (params) => {
  //check for graph.
  const currentEdges = params.edges.current.get();
  const graphAnalyzer = new GraphAnalyzer();
  const result = graphAnalyzer.validateGraph(currentEdges);
  const hyperParam = params.graphManager.getHyperparameters();
  if (!hyperParam) {
    params.appendToOutput(editorStrings.errors.SET_HYPERPARAMETERS, 'error');
    return;
  }
  params.appendToOutput(
    editorStrings.messages.MODEL_COMPILATION_INITIATED,
    'info',
  );
  if (result.isValid) {
    params.appendToOutput(editorStrings.success.ALL_CHECKS_PASSED, 'success');
    params.executePythonScript();
  } else {
    params.appendToOutput(result.errors.join('\n--> '), 'error');
  }
};

export const handleStop = async (params) => {
  if (params.isRunning) {
    await window.api.stopPython();
    params.setIsRunning(false);
    params.appendToOutput(editorStrings.errors.USER_STOPPED, 'error');
  }
};
