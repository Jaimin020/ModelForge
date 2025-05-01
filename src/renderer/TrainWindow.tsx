import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import TrainingPage from '../frontend/modules/TranningGraph/TrainingPage';

function Training() {
  return <TrainingPage />;
}

export default function TrainingWindow() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Training />} />
      </Routes>
    </Router>
  );
}
