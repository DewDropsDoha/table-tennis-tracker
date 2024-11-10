import React from 'react';
import { Link } from 'react-router-dom';

const Ranking = () => {
  return (
    <div>
      <h1>Table Tennis Rankings</h1>
      <p>Here are the current rankings...</p>
      <ul>
        <li>Player 1 - 1st</li>
        <li>Player 2 - 2nd</li>
        <li>Player 3 - 3rd</li>
      </ul>
      <Link to="/table-tennis-tracker/match">Start Match</Link>
    </div>
  );
};

export default Ranking;
