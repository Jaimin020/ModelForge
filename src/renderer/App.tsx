import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
import Homepage from '../frontend/modules/Dashboard/Homepage';
import { customDarkTheme } from '../frontend/components/theme';
import DesignApp from '../frontend/modules/Workspace/Editor';
import TrainingPage from '../frontend/modules/TranningGraph/TrainingPage';

function Editor() {
  return <DesignApp />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Editor />} />
      </Routes>
    </Router>
  );
}
