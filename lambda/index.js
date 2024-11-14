import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import serverless from 'serverless-http';
import { auth } from 'express-oauth2-jwt-bearer';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      'https://dewdropsdoha.github.io',
      // 'http://localhost:3000'
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Origin', 'Content-Type', 'Authorization'],
  })
);

// const jwtCheck = auth({
//   audience: process.env.AUTH0_AUDIENCE,
//   issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
//   tokenSigningAlg: 'RS256',
// });
// app.use(jwtCheck);

const gcpAuth = new GoogleAuth({
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key:
      `-----BEGIN PRIVATE KEY-----\\n${process.env.PRIVATE_KEY_1}/Y\\n${process.env.PRIVATE_KEY_2}+NzIWHHqlmPLnBbddy7P5nhBKTJuHfYWNq2\\nt6QbW+ENCXpMS40zEKs3eUCJa9DH9WteccDyaPmIPZu5YMtQOG2MIjRnuu6s6CUc\\n${process.env.PRIVATE_KEY_MIDDLE}\\nC/J8tod5UoLJoGdUNjcJ+i5TVz/daRmM2VeEDEGwTPjT3+fqbwNoYPYQ9wCdcgQN\\nhAel/H2o3FUuthrM9B0POlvboURh0L+HHMf3U/5s2IzgpPZbcb/SCAuQUsPVu5fl\\nG79TEs5nAgMBAAECggEACff3uy7xr3r7deewNaril2snym/I0wd/z1fY8Go5ewdK\\nVD9KM+netdbmK6nMT70PfhLIuXY4u2ZoWOQjRIz6hdqy+IupeFEKiErJNFKpLBfg\\nXgo8N9UtdRJgWBFKaK7U1A0QXC/P0jYw/4yYOakx3v205Rcj3IFdGwrN5rHI43FQ\\nqYqjQHKFmHsIQQtNuZkLltneP1BvQ1Temz3MG6R4lZ6Fk13kkOKoFsQBpMqg2die\\nrc4rY5szAd4U8zKdhAd5qf170UQJ067Tez0wcZGMQ8uxTdIXBM0mqBHNsBSd1qpP\\nswgDJLveJ4wON9HS+gMVYQ4RX3HPzqKZ2jJICJV2wQKBgQDOrd/suEbjtKzLyZnW\\nb3Jm1wJJC6W6ijBrRyoRaPtD4FNwzrUDrHK0tj87VzAk12uDHQA+4rJoBBmknDKF\\nJlmxGkjstFPiPqFORPZNZlkNH5G7clqqLYGUKvKs7dU7MmE6nb+48CPionwlKYtv\\nlLpVDlRea9ahF5Fie1uPnpRAWwKBgQC6SKi9gxYiLhZorbruz+UslUE54yLN2p5P\\nikfAdjtALJ1KcYWPGebPj9XMR1Vyc0gL7AbBxyaLHNBkpJvmYbn+xWwVsYHvPcZj\\nKDgtW1Y/qVpUV7y+8x7iKRXXXOywW75ZOQ5u7Ng/a3fhl/swRh+k+yFh2zjDAtr5\\nuiA7UpRH5QKBgQCCtvNduvqSv01eIeYa+idnpWp7mlM51HZlEwAnPLdVqYX8Xa+c\\nYC+33V/GfxEi69/Cb9Ac9bGSGa3CL0vAbI3jddVTZ4V6HNRWNUV1lFqT8zhvThbL\\ndLZ0aGlNN6pZozZdJTIBnFeF2fAcbNcUPgNPEh4IDboT7lzz5UL2ZXwr6wKBgH4W\\nRhiYDLgv570MsnWIQ/9sOwz6f4lES1ldKHnNzQb/66sCsbsNdhvRqI2vTte7ze07\\n4crxiFYqt6cXf+ptBV67tA/u6RrM/mYJSBTzOKq4b0qdZET+/E1qL71oyVAJmQp9\\nQxazux8aF7ebjkq7fBnIXW0F3CKq4Rqc78oXeAQ9AoGAAftZI/mHUSRnq2cqqwIw\\nIk4GlGjy8ErQbxUOC5xMQ+jKv7qG3e5mucM4LFMitzPxb63AUFlKv6qajIBHOXJn\\nFoZaDCCBIsLOxreGEv+fDfX37NE4IBLpjs53h5nXqzIupHnpfWoUf1bSN+fdEen8\\neRJ0NTbhNQN/M8CZTzR3DLk=\\n-----END PRIVATE KEY-----\\n`.replace(
        /\\n/g,
        '\n'
      ),
    project_id: process.env.PROJECT_ID,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to table tennis tracker!' });
});

app.get('/match',  async (req, res) => {
  try {
    const service = google.sheets({ version: 'v4', auth: gcpAuth });
    const response = await service.spreadsheets.values.batchGet({
      spreadsheetId: process.env.SPREADSHEET_ID,
      ranges: ['player!A2:A1000', 'single!A2:Z1000'],
    });

    const players = response.data.valueRanges[0].values ?? []
    const playedMatches = response.data.valueRanges[1].values ?? []
   
    const matchSet = new Set();
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        const match = [players[i][0], players[j][0]].sort().join(" vs ");
        matchSet.add(match);
      }
    }

    const playedMatchSet = new Set();
    for (let i = 0; i < playedMatches.length - 1; i++) {
      if (playedMatches[i].length && playedMatches[i + 1].length) {
        const player1 = playedMatches[i][0];
        const player2 = playedMatches[i + 1][0];
        const playedMatch = [player1, player2].sort().join(" vs ");
        playedMatchSet.add(playedMatch);
      }
    }

    playedMatchSet.forEach(match => {
      matchSet.delete(match);
    });

    const remainingMatches = Array.from(matchSet).sort()

    res.json({
      message: 'Fetched data successfully',
      data: remainingMatches
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

const getCurrentScores = async() => {
   const sheetName = 'single';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SPREADSHEET_ID}/values/${sheetName}?key=${process.env.SPREADSHEET_API_KEY}`;

    const service = google.sheets({ version: 'v4', auth: gcpAuth });
    const response = await service.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${sheetName}!A2:Z1000`
    });
  return response.data.values;
}

app.get('/score',  async (req, res) => {
  try {
    const currentScores = await getCurrentScores();

    res.json({
      message: 'Fetched data successfully',
      data: currentScores,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

const isWin = (score1, score2) => Number(score1) > Number(score2);
const getWinCount = (index,rank) => {
  if (index in rank)
    return rank[index]?.win ?? 0;
  else return 0;
}
const incWinCount = (index,rank) => {
    if (index in rank) {
      console.log(`incrementing for ${index}`, rank[index].win ? rank[index].win + 1 : 1)
      return rank[index].win ? rank[index].win + 1 : 1;
    }
  return getWinCount(index, rank) + 1;
}
  
const getLoseCount = (index,rank) => {
  if (index in rank)
    return rank[index]?.lose ?? 0;
  else return 0;
}
const incLoseCount = (index,rank) => {
    if (index in rank) {
      console.log(`incrementing for ${index}`, rank[index].lose ? rank[index].lose + 1 : 1)
      return rank[index].lose ? rank[index].lose + 1 : 1;
    }
  return getLoseCount(index, rank) + 1;
  }


const sortRankingV2 = (rank) =>{
  const players = Object.entries(rank).map(([name, stats]) => ({
        name,
        win: stats.win,
        lose: stats.lose || 0
    }));
    
    players.sort((a, b) => {
        if (b.win === a.win) {
            return a.lose - b.lose;
        }
        return b.win - a.win;
    });
    
  const noOfPlayers = players.length;

    players.forEach((player, index) => {
      player.rank = index + 1;
      player.totalPlayed = player.win + player.lose;
      player.matchLeft = noOfPlayers - player.totalPlayed - 1;
    });

    return players;
}

app.get('/rank',  async (req, res) => {
  try {
    let rank = {
    }
    const currentScores = await getCurrentScores();

    for (let i = 1; i <= currentScores.length-2; i=i+3){
      if (!currentScores[i].length) continue;
      const index1 = currentScores[i][0];
      const index2 = currentScores[i + 1][0];

      const sc1 = currentScores[i][1];
      const sc2 = currentScores[i + 1][1];

      
      rank[index1] = {
        win: isWin(sc1, sc2) ? incWinCount(index1, rank) : getWinCount(index1, rank),
        lose: isWin(sc1, sc2) ? getLoseCount(index1, rank) : incLoseCount(index1, rank)
      }
      rank[index2] = {
        win: isWin(sc2, sc1) ? incWinCount(index2, rank) : getWinCount(index2, rank),
        lose: isWin(sc2, sc1) ? getLoseCount(index2, rank) : incLoseCount(index2, rank)
      }
    }
    res.json({
      message: 'Fetched ranking successfully',
      data: sortRankingV2(rank)
    });
  } catch (error) {
    console.error('Failed to show ranking data:', error);
    res.status(500).json({ message: 'Failed to show ranking data' });
  }
});

app.post('/match', async (req, res) => {
  try {
    const newData = req.body;
    if (!Array.isArray(newData)) {
      return res.json({ message: 'Invalid Request Body' });
    }

    const sheetName = 'single';
    const data = addEmptyRows(newData)
    const service = google.sheets({ version: 'v4', auth: gcpAuth });
    const response = await service.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${sheetName}`,
      valueInputOption: 'RAW',
      resource: { values: data },
    });

    const spreadsheet = await service.spreadsheets.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
    });
    const sheet = spreadsheet.data.sheets.find(s => s.properties.title === sheetName);
    const sheetId = sheet.properties.sheetId;

    const updatedRange = response.data.updates.updatedRange;
    const startRow = parseInt(updatedRange.split('!')[1].split(':')[0].replace(/[A-Z]/g, ''), 10);
    const nextRow = startRow + 1
    const next2ndRow = nextRow + 1

    const requests = [
      {
        "addConditionalFormatRule": {
          "rule": {
            "ranges": [
              {
                "sheetId": sheetId,
                "startRowIndex": startRow,
                "endRowIndex": nextRow,
                "startColumnIndex": 0,
                "endColumnIndex": 2
              }
            ],
            "booleanRule": {
              "condition": {
                "type": "CUSTOM_FORMULA",
                "values": [
                  {
                    "userEnteredValue": "=B" + nextRow + ">B" + next2ndRow + ""
                  }
                ]
              },
              "format": {
                "backgroundColor": { "red": 0.686, "green": 0.882, "blue": 0.686 }
              }
            }
          }
        }
      },
      {
        "addConditionalFormatRule": {
          "rule": {
            "ranges": [
              {
                "sheetId": sheetId,
                "startRowIndex": nextRow,
                "endRowIndex": next2ndRow,
                "startColumnIndex": 0,
                "endColumnIndex": 2
              }
            ],
            "booleanRule": {
              "condition": {
                "type": "CUSTOM_FORMULA",
                "values": [
                  {
                    "userEnteredValue": "=B" + next2ndRow + ">B" + nextRow + ""
                  }
                ]
              },
              "format": {
                "backgroundColor": { "red": 0.686, "green": 0.882, "blue": 0.686 }
              }
            }
          }
        }
      }
    ];


    await service.spreadsheets.batchUpdate({
      spreadsheetId: `${process.env.SPREADSHEET_ID}`,
      resource: {
        requests: requests
      }
    });

    res.json({ message: 'Data appended successfully', data: response.data });
  } catch (error) {
    console.error('Error appending data:', error);
    res.status(500).json({ message: 'Error appending data' });
  }
});

function addEmptyRows(data) {
  return data.reduce((acc, item, index) => {
    if ((index) % 2 === 0) acc.push([]);
    acc.push(item);
    return acc;
  }, []);
}

export const handler = serverless(app);
// app.listen(8080, () => console.log("Server running on http://localhost:8080"));