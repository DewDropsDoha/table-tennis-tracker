import React from 'react';
import { Link } from 'react-router-dom';
import ScoreChart from './ScoreChart';

const Ranking = () => {
  const score = {
    Mumin: [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1],
    Fayaz: [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0],
  };

  return (
    <div>
      <Link to="/table-tennis-tracker/match">Start Match</Link>
      <ScoreChart score={score} />
    </div>
  );
};

export default Ranking;
