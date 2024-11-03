import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WordHistory from './Wordhistory.js';

function Game() {
    const [word, setWord] = useState('');
    const [gameState, setGameState] = useState(null);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(30); // Countdown timer

    const fetchGameState = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/get-state');
            setGameState(response.data.gameState);
            setTimer(30); // Reset timer on fetch
        } catch (error) {
            console.error('Error fetching game state:', error);
        }
    };

    useEffect(() => {
        fetchGameState();
    }, []);

    useEffect(() => {
        if (timer > 0 && gameState) {
            const countdown = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(countdown);
        } else if (timer === 0) {
            handleWordSubmit(); // Auto-submit when timer runs out
        }
    }, [timer, gameState]);

    // Handle word submission
    const handleWordSubmit = async () => {
        setError(''); // Clear error on new submission
        if (!word) return; // Prevent submission of empty word

        try {
            const response = await axios.post('http://localhost:5000/api/submit-word', { word });
            setGameState(response.data.gameState);
            setWord('');
            setTimer(30); // Reset timer after submission
        } catch (error) {
            setError(error.response?.data?.error || 'Error submitting word');
            setWord('');
            setTimer(30); // Reset timer even on error
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
                    <p>Time Remaining: {timer} seconds</p>
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
