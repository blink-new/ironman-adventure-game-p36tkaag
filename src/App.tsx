
import { useEffect, useState } from 'react'
import GameContainer from './components/GameContainer'
import StartScreen from './components/StartScreen'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setLives(3)
    setGameOver(false)
  }

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore)
  }

  const handleLivesUpdate = (newLives: number) => {
    setLives(newLives)
    if (newLives <= 0) {
      setGameOver(true)
    }
  }

  const handleGameOver = () => {
    setGameOver(true)
  }

  return (
    <div className="game-app">
      {!gameStarted || gameOver ? (
        <StartScreen 
          onStart={startGame} 
          score={score} 
          gameOver={gameOver} 
        />
      ) : (
        <div className="game-wrapper">
          <div className="game-ui">
            <div className="game-stats">
              <div className="score">Score: {score}</div>
              <div className="lives">Lives: {lives}</div>
            </div>
          </div>
          <GameContainer 
            onScoreUpdate={handleScoreUpdate}
            onLivesUpdate={handleLivesUpdate}
            onGameOver={handleGameOver}
          />
        </div>
      )}
    </div>
  )
}

export default App