import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTableTennis,
  faMinusSquare,
} from '@fortawesome/free-solid-svg-icons';
import './MatchTracker.css';

const MatchTracker = () => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [isMatchActive, setIsMatchActive] = useState(false);
  const [winnerMessage, setWinnerMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [stats, setStats] = useState([]);

  const playerColors = {
    player1: '#3B82F6',
    player2: '#7AB2D3',
  };

  const startMatch = () => {
    if (!player1 && !player1) {
      setErrorMessage('Players names required!');
      return;
    }

    setErrorMessage('');
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
    setStats((prev) => [...prev, [score1 + 1, 0]]);
    setClickCount(clickCount + 1);
  };

  const handleScore2 = () => {
    setScore2(score2 + 1);
    setStats((prev) => [...prev, [0, score2 + 1]]);
    setClickCount(clickCount + 1);
  };

  const handleDecreaseScore1 = () => {
    setScore1(score1 - 1);
    setStats((prev) => prev.slice(0, -1));
  };

  const handleDecreaseScore2 = () => {
    setScore2(score2 - 1);
    setStats((prev) => prev.slice(0, -1));
  };

  const showIconForPlayer1 =
    clickCount < 21 ? clickCount % 4 < 2 : clickCount % 2 === 0;

  return (
    <div className="match-tracker-container">
      <div className="match-tracker">
        <h1>Table Tennis Match Tracker</h1>
        <div className="player-inputs">
          <input
            type="text"
            placeholder="Player 1 Name"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            disabled={isMatchActive}
            className="player-input"
            style={{ borderColor: playerColors.player1 }}
          />
          <input
            type="text"
            placeholder="Player 2 Name"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            disabled={isMatchActive}
            className="player-input"
            style={{ borderColor: playerColors.player2 }}
          />
        </div>

        <div className="score-board">
          <h2>Score</h2>

          {winnerMessage && (
            <>
              <h2 className="winner-message">{winnerMessage}</h2>
              <table style={{ width: '100%', paddingBottom: '8px' }}>
                <thead>
                  <tr style={{ color: playerColors.player1 }}>
                    <td>{player1}</td>
                    {stats.map((item, index) => (
                      <td key={`${index}-${item[0]}`}>{item[0]}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ color: playerColors.player2 }}>
                    <td>{player2}</td>
                    {stats.map((item, index) => (
                      <td key={`${index}-${item[0]}`}>{item[1]}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </>
          )}

          <div
            className="score-display"
            style={{
              pointerEvents: isMatchActive ? 'auto' : 'none',
              opacity: isMatchActive ? 1 : 0.7,
            }}
          >
            <div
              className="score-box"
              style={{ backgroundColor: playerColors.player1 }}
              onClick={handleScore1}
            >
              <p className="player-name">{player1}</p>
              <p className="score">{score1}</p>
              {showIconForPlayer1 && (
                <FontAwesomeIcon
                  icon={faTableTennis}
                  size="xl"
                  style={{ color: 'red', paddingBottom: '4px' }}
                />
              )}
            </div>
            <div
              className="score-box"
              style={{ backgroundColor: playerColors.player2 }}
              onClick={handleScore2}
            >
              <p className="player-name">{player2}</p>
              <p className="score">{score2}</p>
              {!showIconForPlayer1 && (
                <FontAwesomeIcon
                  icon={faTableTennis}
                  size="xl"
                  style={{ color: 'red', paddingBottom: '4px' }}
                />
              )}
            </div>
          </div>

          <div hidden={winnerMessage || clickCount === 0 ? true : false}>
            <div className="icon-container">
              <FontAwesomeIcon
                icon={faMinusSquare}
                size="xl"
                style={{ color: playerColors.player1, paddingBottom: '4px' }}
                onClick={handleDecreaseScore1}
              />
              <FontAwesomeIcon
                icon={faMinusSquare}
                size="xl"
                style={{ color: playerColors.player2, paddingBottom: '4px' }}
                onClick={handleDecreaseScore2}
              />
            </div>
          </div>
        </div>

        <div className="controls">
          <button
            onClick={startMatch}
            disabled={isMatchActive}
            className="control-button start"
          >
            Start Match
          </button>
          <button
            onClick={endMatch}
            disabled={!isMatchActive}
            className="control-button end"
          >
            End Match
          </button>
          <button onClick={resetMatch} className="control-button reset">
            Reset Match
          </button>
        </div>
        <p style={{ color: 'red' }}>{errorMessage ?? ''}</p>
      </div>
    </div>
  );
};

export default MatchTracker;
