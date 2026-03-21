import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import DesignApp from '../frontend/modules/Workspace/Editor';
import LoadingOverlay from '../frontend/modules/Loading/LoadingModal';

type StartupState = {
  isVisible: boolean;
  status: 'idle' | 'running' | 'success' | 'error';
  message: string;
  logs: string[];
  appName: string;
  version: string;
  error?: string;
};

function Editor() {
  return <DesignApp />;
}

export default function App() {
  const [isStartupDialogDismissed, setIsStartupDialogDismissed] = useState(false);
  const [startupState, setStartupState] = useState<StartupState>({
    isVisible: true,
    status: 'running',
    message: 'Preparing Python environment...',
    logs: [],
    appName: 'ModelForge',
    version: '',
  });

  useEffect(() => {
    let isMounted = true;

    window.api.onStartupUpdate((state) => {
      if (isMounted) {
        if (state.status !== 'error') {
          setIsStartupDialogDismissed(false);
        }
        setStartupState(state);
      }
    });

    window.api.getStartupState().then((state) => {
      if (isMounted) {
        if (state.status !== 'error') {
          setIsStartupDialogDismissed(false);
        }
        setStartupState(state);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStartupDialogClose = async () => {
    if (startupState.status === 'error') {
      await window.api.dismissStartupError();
    }

    setIsStartupDialogDismissed(true);
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Editor />} />
        </Routes>
      </Router>
      <LoadingOverlay
        isVisible={startupState.isVisible && !isStartupDialogDismissed}
        message={startupState.error || startupState.message}
        title={startupState.appName}
        version={startupState.version}
        logs={startupState.logs}
        status={startupState.status}
        variant="startup"
        onClose={handleStartupDialogClose}
      />
    </>
  );
}
