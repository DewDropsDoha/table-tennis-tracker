import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import './MatchTracker.css';

const MatchTracker = () => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [isMatchActive, setIsMatchActive] = useState(false);
  const [winnerMessage, setWinnerMessage] = useState('');

  const startMatch = () => {
    setScore1(0);
    setScore2(0);
    setIsMatchActive(true);
    setWinnerMessage('');
  };

  const resetMatch = () => {
    setPlayer1('');
    setPlayer2('');
    setScore1(0);
    setScore2(0);
    setIsMatchActive(false);
    setWinnerMessage('');
  };

  const endMatch = async () => {
    console.log('End Match');
    resetMatch();
  };

  useEffect(() => {
    const checkForWinner = () => {
      if (score1 > 10 && score1 - score2 > 1) {
        setWinnerMessage(`${player1} wins!`);
        setIsMatchActive(false);
      } else if (score2 > 10 && score2 - score1 > 1) {
        setWinnerMessage(`${player2} wins!`);
        setIsMatchActive(false);
      }
    };

    checkForWinner();
  }, [score1, score2, player1, player2]);

  const handleScore1 = () => {
    setScore1(score1 + 1);
  };

  const handleScore2 = () => {
    setScore2(score2 + 1);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Player 1 Name"
        value={player1}
        onChange={(e) => setPlayer1(e.target.value)}
        disabled={isMatchActive}
      />
      <input
        type="text"
        placeholder="Player 2 Name"
        value={player2}
        onChange={(e) => setPlayer2(e.target.value)}
        disabled={isMatchActive}
      />
      <div>
        <h2>Score</h2>
        <p>
          {player1 || 'Player 1'}: {score1}
        </p>
        <p>
          {player2 || 'Player 2'}: {score2}
        </p>
        <button onClick={handleScore1} disabled={!isMatchActive}>
          Player 1 Scores
        </button>
        <button onClick={handleScore2} disabled={!isMatchActive}>
          Player 2 Scores
        </button>
      </div>
      <button onClick={startMatch} disabled={isMatchActive}>
        Start Match
      </button>
      <button onClick={endMatch} disabled={!isMatchActive}>
        End Match
      </button>
      <button onClick={resetMatch}>Reset Match</button>
      {winnerMessage && <h2>{winnerMessage}</h2>}
    </div>
  );
};

export default MatchTracker;
