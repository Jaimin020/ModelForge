export const openNewWindow = async (options = {}) => {
  try {
    const windowId = await (window as any).windowMngr.openNewWindow(options);
    return windowId;
  } catch (error) {
    console.error('Failed to open new window:', error);
    return null;
  }
};
