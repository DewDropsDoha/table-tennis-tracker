import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTableTennis,
  faMinusSquare,
} from '@fortawesome/free-solid-svg-icons';
import './MatchTracker.css';
import axios from 'axios';

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
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const getPlayers = async () => {
      const resp = await axios.get(
        'https://fnaauecyoji2erada62q6fwqvi0tbqat.lambda-url.ap-southeast-1.on.aws/player'
      );
      setPlayers(resp.data.data);
    };
    getPlayers();
  }, []);

  const playerColors = {
    player1: '#3B82F6',
    player2: '#7AB2D3',
  };

  const startMatch = () => {
    if (!player1 && !player1) {
      setErrorMessage('Players names required!');
      return;
    }

    setScore1(0);
    setScore2(0);
    setStats(() => [[player1, player2]]);
    setIsMatchActive(true);
    setWinnerMessage('');
    setErrorMessage('');
    setClickCount(0);
  };

  const resetMatch = () => {
    setPlayer1('');
    setPlayer2('');
    setScore1(0);
    setScore2(0);
    setIsMatchActive(false);
    setWinnerMessage('');
    setErrorMessage('');
    setClickCount(0);
    setStats([]);
  };

  useEffect(() => {
    const checkForWinner = () => {
      if (score1 > 10 && score1 - score2 > 1) {
        setWinnerMessage(`${player1} won!`);
        setIsMatchActive(false);
      } else if (score2 > 10 && score2 - score1 > 1) {
        setWinnerMessage(`${player2} won!`);
        setIsMatchActive(false);
      }
    };

    checkForWinner();
  }, [score1, score2, player1, player2]);

  const handleScore1 = () => {
    setScore1(score1 + 1);
    setStats((prev) => [...prev, [1, 0]]);
    setClickCount(clickCount + 1);
  };

  const handleScore2 = () => {
    setScore2(score2 + 1);
    setStats((prev) => [...prev, [0, 1]]);
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

  const uploadScore = () => {
    const data = JSON.parse(JSON.stringify(stats));
    let sum1 = 0;
    let sum2 = 0;

    for (let i = 1; i < data.length; i++) {
      sum1 += data[i][0];
      sum2 += data[i][1];
    }

    data.splice(1, 0, [sum1, sum2]);
    console.log('Upload', data);
  };

  const showIconForPlayer1 =
    clickCount < 21 ? clickCount % 4 < 2 : clickCount % 2 === 0;

  return (
    <div className="match-tracker-container">
      <div className="match-tracker">
        <h1>Table Tennis Match Tracker</h1>

        {!isMatchActive && !winnerMessage && (
          <div className="player-selection">
            <select
              onChange={(e) => setPlayer1(e.target.value)}
              value={player1}
            >
              <option key="player1-dropdown" value="">
                Select Player 1
              </option>
              {players.map((name, index) => (
                <option
                  key={`player1-${index}`}
                  value={name}
                  disabled={name == player2}
                >
                  {name}
                </option>
              ))}
            </select>

            <select
              onChange={(e) => setPlayer2(e.target.value)}
              value={player2}
            >
              <option key="player2-dropdown" value="">
                Select Player 2
              </option>
              {players.map((name, index) => (
                <option
                  key={`player1-${index}`}
                  value={name}
                  disabled={name == player1}
                >
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="score-board">
          <h2>Score</h2>

          {winnerMessage && (
            <>
              <h2 className="winner-message">{winnerMessage}</h2>
              <table style={{ width: '100%', paddingBottom: '8px' }}>
                <thead>
                  <tr style={{ color: playerColors.player1 }}>
                    {stats.map((item, index) => (
                      <td key={`${index}-${item[0]}`}>{item[0]}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ color: playerColors.player2 }}>
                    {stats.map((item, index) => (
                      <td key={`${index}-${item[0]}`}>{item[1]}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
              {winnerMessage && (
                <div className="controls">
                  <button
                    onClick={uploadScore}
                    className="control-button start"
                  >
                    Upload Score
                  </button>
                </div>
              )}
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

          <div hidden={!isMatchActive}>
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
            disabled={isMatchActive || winnerMessage}
            className="control-button start"
          >
            Start Match
          </button>
          <button
            onClick={resetMatch}
            disabled={!isMatchActive && !winnerMessage}
            className="control-button end"
          >
            Reset Match
          </button>
        </div>
        <p style={{ color: 'red' }}>{errorMessage ?? ''}</p>
      </div>
    </div>
  );
};

export default MatchTracker;
