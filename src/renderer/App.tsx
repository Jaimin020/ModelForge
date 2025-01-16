import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import Homepage from '../frontend/modules/Dashboard/Homepage';
import { customDarkTheme } from '../frontend/components/theme';
import DesignApp from '../frontend/modules/Workspace/Editor';

function Hello() {
  return (
    <FluentProvider>
      <DesignApp />
    </FluentProvider>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
