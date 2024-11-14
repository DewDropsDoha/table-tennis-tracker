import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './index.css';

const RankingTable = () => {
  const [playerRank, setPlayerRank] = useState([]);

  useEffect(() => {
    const playersRank = async () => {
      try {
        const resp = await axios.get(
          'https://fnaauecyoji2erada62q6fwqvi0tbqat.lambda-url.ap-southeast-1.on.aws/rank'
          // 'http://localhost:8080/rank'
        );
        console.log(resp)
        setPlayerRank(resp.data.data);
      } catch (error) {
        
      }
    };
    void playersRank();
  },[])


  return (
    <div className="ranking-table">
      <h2>Player Rankings</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Total Played</th>
            <th>Matches Left</th>
          </tr>
        </thead>
        <tbody>
          {playerRank.map((player, index) => (
            <tr key={index}>
              <td>{player.rank}</td>
              <td>{player.name}</td>
              <td>{player.win}</td>
              <td>{player.lose}</td>
              <td>{player.totalPlayed}</td>
              <td>{player.matchLeft}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankingTable;
