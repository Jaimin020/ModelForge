export const openNewWindow = async (options = {}) => {
  try {
    const windowId = await window.windowMngr.openNewWindow(options);
    return windowId;
  } catch (error) {
    console.error('Failed to open new window:', error);
    return null;
  }
};
