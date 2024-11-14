import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MatchTracker from './components/MatchTracker';
import Ranking from './components/Ranking';
import PlayersRank from './components/Rank/PlayersRank';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/table-tennis-tracker/" element={<MatchTracker />} />
        <Route path="/table-tennis-tracker/rank" element={<PlayersRank />} />
      </Routes>
    </div>
  );
}

export default App;