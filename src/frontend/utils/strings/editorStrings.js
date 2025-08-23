export const editorMessages = {
  NEW_WINDOW_OPENED: (id) => `New window opened with ID: ${windowId}`,
  MODEL_EXECUTION_INITIATED: 'Model Execution Initiated',
  MODEL_COMPILATION_INITIATED: 'Model Compilation Initiated',
};

export const editorErrors = {
  SET_HYPERPARAMETERS: 'Please set hyperparameters.',
  USER_STOPPED: 'Process stopped by user.',
  ERROR_SAVING_MODEL: (err) => `Error saving model: ${err}`,
  STOP_TRAINING_BEFORE_SAVE: 'Please stop the training process before saving.',
  LOAD_FAILED_INVALID_MODEL: 'Failed to load model: Invalid model data.',
  ERROR_LOADING_MODEL: (err) => `Error loading model: ${err}`,
};

export const editorWarns = {
  PROCESS_ALREADY_RUNNING: 'Process already running. Please wait.',
  SAVE_CANCELLED: 'Save Cancelled!',
};

export const editorSuccessMsgs = {
  ALL_CHECKS_PASSED: 'All Checks Passed',
  MODEL_SAVED_SUCCESS: (path) => `Model saved successfully at: ${path}`,
  MODEL_LOADED_SUCCESS: 'Model Loaded Successfully',
};
