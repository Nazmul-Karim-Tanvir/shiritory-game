const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let gameState = {
    player1Score: 0,
    player2Score: 0,
    turn: 1,
    wordHistory: [],
};

const isValidWord = async (word) => {
    try {
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        return response.data.length > 0;
    } catch (error) {
        return false;
    }
};

app.get('/api/get-state', (req, res) => {
    res.send({ gameState });
});

app.post('/api/submit-word', async (req, res) => {
    const { word } = req.body;

    if (word.length < 4) {
        return res.status(400).json({ error: 'Word must be greater than 4 characters.' });
    }

    const lastWord = gameState.wordHistory[gameState.wordHistory.length - 1];

    if (lastWord && !word.startsWith(lastWord[lastWord.length - 1])) {
        return res.status(400).json({ error: 'Word must start with the last letter of the previous word.' });
    }

    if (gameState.wordHistory.includes(word.toLowerCase())) {
        return res.status(400).json({ error: 'Word has already been used.' });
    }

    const valid = await isValidWord(word.toLowerCase());
    if (!valid) {
        gameState.turn === 1 ? gameState.player2Score-- : gameState.player1Score--;
        gameState.turn = gameState.turn === 1 ? 2 : 1;
        return res.status(400).json({ error: 'Invalid word, point deducted.' });
    }

    gameState.wordHistory.push(word.toLowerCase());
    gameState.turn = gameState.turn === 1 ? 2 : 1;

    res.json({ gameState });
});

app.post('/api/reset', (req, res) => {
    gameState = {
        player1Score: 0,
        player2Score: 0,
        turn: 1,
        wordHistory: [],
    };
    res.json({ gameState });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
