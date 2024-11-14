import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTableTennis,
  faMinusSquare,
} from '@fortawesome/free-solid-svg-icons';
import './MatchTracker.css';
import axios from 'axios';
import Loading from './Loading';
import CountdownTimer from './CountdownTimer';

const MatchTracker = () => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [player1Stats, setPlayer1Stats] = useState([]);
  const [player2Stats, setPlayer2Stats] = useState([]);
  const [isMatchActive, setIsMatchActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showServeIconForPlayer1, setShowServeIconForPlayer1] = useState();
  const [winnerMessage, setWinnerMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [resetCountdown, setResetCountdown] = useState(0);
  const [serve, setServe] = useState([1]);

  const playerColors = {
    player1: '#3B82F6',
    player2: '#7AB2D3',
  };

  const handleMatchSelection = (value) => {
    setSelectedMatch(value);
    const players = value.split('vs');
    setPlayer1(players[0].trim());
    setPlayer2(players[1].trim());
  };

  useEffect(() => {
    const getRemainingMatches = async () => {
      try {
        const resp = await axios.get(
          'https://fnaauecyoji2erada62q6fwqvi0tbqat.lambda-url.ap-southeast-1.on.aws/match'
        );
        setMatches(resp.data.data);
        setIsLoading(false);
      } catch (error) {
        setErrorMessage('Error fetching matches!');
      }
    };
    getRemainingMatches();
  }, []);

  const startMatch = () => {
    if (!player1 && !player1) {
      setErrorMessage('Players names required!');
      return;
    }

    setScore1(0);
    setScore2(0);
    setPlayer1Stats([player1]);
    setPlayer2Stats([player2]);
    setIsMatchActive(true);
    setWinnerMessage('');
    setErrorMessage('');
    setClickCount(0);
    setResetCountdown(0);
  };

  const resetMatch = () => {
    setPlayer1('');
    setPlayer2('');
    setScore1(0);
    setScore2(0);
    setPlayer1Stats([]);
    setPlayer2Stats([]);
    setIsMatchActive(false);
    setWinnerMessage('');
    setErrorMessage('');
    setClickCount(0);
    setSelectedMatch('');
    setResetCountdown(0);
  };

  useEffect(() => {
    const checkForWinner = () => {
      if (score1 > 10 && score1 - score2 > 1) {
        formatScore();
        setWinnerMessage(`${player1} won!`);
        setIsMatchActive(false);
      } else if (score2 > 10 && score2 - score1 > 1) {
        formatScore();
        setWinnerMessage(`${player2} won!`);
        setIsMatchActive(false);
      }
    };

    checkForWinner();
  }, [score1, score2, player1, player2]);

  useEffect(() => {
    if (clickCount < 21 && clickCount % 2 === 0)
      setShowServeIconForPlayer1(!showServeIconForPlayer1);
    else if (clickCount >= 21)
      setShowServeIconForPlayer1(!showServeIconForPlayer1);
  }, [clickCount]);

  const handleScore1 = () => {
    if (!isMatchActive && !winnerMessage) {
      setServe([1]);
      return;
    } else if (winnerMessage) return;

    setScore1(score1 + 1);
    setPlayer1Stats((prev) => [...prev, 1]);
    setPlayer2Stats((prev) => [...prev, 0]);
    setClickCount(clickCount + 1);
    setServe((prev) => {
      if (prev.length < 21) {
        if (prev.length % 2 === 0) {
          return [...prev, prev[prev.length - 1] === 1 ? 2 : 1];
        }
        return [...prev, prev[prev.length - 1]];
      } else {
        return [...prev, prev[prev.length - 1] === 1 ? 2 : 1];
      }
    });
  };

  const handleScore2 = () => {
    if (!isMatchActive && !winnerMessage) {
      setServe([2]);
      return;
    } else if (winnerMessage) return;

    setScore2(score2 + 1);
    setPlayer1Stats((prev) => [...prev, 0]);
    setPlayer2Stats((prev) => [...prev, 1]);
    setClickCount(clickCount + 1);
    setServe((prev) => {
      if (prev.length < 21) {
        if (prev.length % 2 === 0) {
          return [...prev, prev[prev.length - 1] === 1 ? 2 : 1];
        }
        return [...prev, prev[prev.length - 1]];
      } else {
        return [...prev, prev[prev.length - 1] === 1 ? 2 : 1];
      }
    });
  };

  const handleDecreaseScore1 = () => {
    const score = score1 - 1;
    if (score < 0) return;
    setScore1(score);
    setPlayer1Stats((prev) => prev.slice(0, -1));
    setPlayer2Stats((prev) => prev.slice(0, -1));
    setClickCount(clickCount - 1);
    setServe((prev) => prev.slice(0, -1));
  };

  const handleDecreaseScore2 = () => {
    const score = score2 - 1;
    if (score < 0) return;
    setScore2(score);
    setPlayer1Stats((prev) => prev.slice(0, -1));
    setPlayer2Stats((prev) => prev.slice(0, -1));
    setClickCount(clickCount - 1);
    setServe((prev) => prev.slice(0, -1));
  };

  const formatScore = () => {
    const player1Sum = player1Stats
      .slice(1)
      .reduce((acc, value) => acc + value, 0);
    const player2Sum = player2Stats
      .slice(1)
      .reduce((acc, value) => acc + value, 0);

    setPlayer1Stats((prev) => [prev[0], player1Sum, '-', ...prev.slice(1)]);
    setPlayer2Stats((prev) => [prev[0], player2Sum, '-', ...prev.slice(1)]);
  };

  const uploadScore = () => {
    const body = [player1Stats, player2Stats];
    const uploadScore = async () => {
      try {
        setIsUploading(true);
        await axios.post(
          'https://fnaauecyoji2erada62q6fwqvi0tbqat.lambda-url.ap-southeast-1.on.aws/match',
          body
        );
        setResetCountdown(5);
      } catch (error) {
        setErrorMessage('Upload failed! Try again!');
      } finally {
        setIsUploading(false);
      }
    };
    uploadScore();
  };

  if (isLoading) return <Loading />;

  return (
    <div className="match-tracker-container">
      <div className="match-tracker">
        <h1>Table Tennis Match Tracker</h1>

        {!isMatchActive && !winnerMessage && (
          <div className="match-selection">
            <select
              onChange={(e) => handleMatchSelection(e.target.value)}
              value={selectedMatch}
            >
              <option key="match-dropdown" value="">
                Select Match
              </option>
              {matches.map((name) => (
                <option key={name} value={name}>
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
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <table style={{ width: '100%', paddingBottom: '8px' }}>
                  <thead>
                    <tr style={{ color: playerColors.player1 }}>
                      {player1Stats.map((item, index) => (
                        <td key={`${index}-${item}`}>{item}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ color: playerColors.player2 }}>
                      {player2Stats.map((item, index) => (
                        <td key={`${index}-${item}`}>{item}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {!resetCountdown && (
                <div className="controls">
                  <button
                    onClick={uploadScore}
                    className="control-button start"
                  >
                    {!isUploading && <>Upload Score</>}
                    {isUploading && (
                      <span>
                        Uploading Score ... <Loading />
                      </span>
                    )}
                  </button>
                </div>
              )}

              {resetCountdown && (
                <div className="controls">
                  <button
                    onClick={uploadScore}
                    className="control-button start"
                  >
                    <p>
                      Uploaded successfully! <br />
                      Resetting in{' '}
                      <CountdownTimer
                        countdown={resetCountdown}
                        onFinish={resetMatch}
                      />{' '}
                      seconds ...
                    </p>
                  </button>
                </div>
              )}
            </>
          )}

          <div
            className="score-display"
            style={{
              opacity: isMatchActive ? 1 : 0.7,
            }}
          >
            <div
              className="score-box"
              style={{ backgroundColor: playerColors.player1 }}
              onClick={handleScore1}
            >
              {serve[serve.length - 1] === 1 && (
                <FontAwesomeIcon
                  icon={faTableTennis}
                  size="xl"
                  style={{
                    position: 'absolute',
                    color: 'red',
                    margin: '8px 0 0 -8px',
                  }}
                />
              )}
              <div className="player-name">{player1}</div>
              <div className="score">{score1}</div>
            </div>
            <div
              className="score-box"
              style={{ backgroundColor: playerColors.player2 }}
              onClick={handleScore2}
            >
              {serve[serve.length - 1] === 2 && (
                <FontAwesomeIcon
                  icon={faTableTennis}
                  size="xl"
                  style={{
                    position: 'absolute',
                    color: 'red',
                    margin: '8px 0 0 -8px',
                  }}
                />
              )}
              <div className="player-name">{player2}</div>
              <div className="score">{score2}</div>
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
            onClick={resetMatch}
            disabled={!isMatchActive && !winnerMessage}
            className="control-button end"
          >
            Reset Match
          </button>
          <button
            onClick={startMatch}
            disabled={isMatchActive || winnerMessage}
            className="control-button start"
          >
            Start Match
          </button>
        </div>

        <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage ?? ''}</p>
      </div>
    </div>
  );
};

export default MatchTracker;
