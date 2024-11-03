import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WordHistory from './Wordhistory.js';

function Game() {
    const [word, setWord] = useState('');
    const [gameState, setGameState] = useState(null);
    const [error, setError] = useState('');


    const fetchGameState = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/get-state');
            setGameState(response.data.gameState);
        } catch (error) {
            console.error('Error fetching game state:', error);
        }
    };

    useEffect(() => {
        fetchGameState();
    }, []);

    // Handle word submission
    const handleWordSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/submit-word', { word });
            setGameState(response.data.gameState);
            setWord('');
            setError('');
        } catch (error) {
            setError(error.response?.data?.error || 'Error submitting word');
        }
    };

    // Reset the game
    const handleReset = async () => {
        await axios.post('http://localhost:5000/api/reset');
        fetchGameState();
    };

    return (
        <div>
            <h1>Shiritori Game</h1>
            {gameState && (
                <>
                    <p>Player 1 Score: {gameState.player1Score}</p>
                    <p>Player 2 Score: {gameState.player2Score}</p>
                    <p>Current Turn: Player {gameState.turn}</p>
                </>
            )}
            <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="Enter a word"
            />
            <button onClick={handleWordSubmit}>Submit</button>
            <button onClick={handleReset}>Reset Game</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <WordHistory wordHistory={gameState?.wordHistory} />
        </div>
    );
}

export default Game;
