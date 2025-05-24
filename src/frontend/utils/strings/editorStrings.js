export const editorMessages = {
  NEW_WINDOW_OPENED: (id) => `New window opened with ID: ${windowId}`,
  MODEL_EXECUTION_INITIATED: 'Model Execution initiated',
  MODEL_COMPILATION_INITIATED: 'Model Compilation initiated',
  ALL_CHECKS_PASSED: 'All Checks PASSED',
  MODEL_SAVED_SUCCESS: (path) => `Model saved successfully at: ${path}`,
  MODEL_LOADED_SUCCESS: 'Model loaded successfully',
};

export const editorErrors = {
  PROCESS_ALREADY_RUNNING: 'Process already running. Please wait.',
  SET_HYPERPARAMETERS: 'Please set hyperparameters.',
  USER_STOPPED: 'Process stopped by user.',
  SAVE_CANCELLED: 'Save cancelled!',
  ERROR_SAVING_MODEL: (err) => `Error saving model: ${err}`,
  STOP_TRAINING_BEFORE_SAVE: 'Please stop the training process before saving.',
  LOAD_FAILED_INVALID_MODEL: 'Failed to load model: Invalid model data.',
  ERROR_LOADING_MODEL: (err) => `Error loading model: ${err}`,
};
