import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Ranking from './components/Ranking';
import MatchTracker from './components/MatchTracker';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* <Route path="/table-tennis-tracker/" element={<Ranking />} />{' '}
        <Route path="/table-tennis-tracker/match/" element={<MatchTracker />} />{' '} */}
        <Route path="/table-tennis-tracker/" element={<MatchTracker />} />{' '}
      </Routes>
    </div>
  );
}

export default App;
