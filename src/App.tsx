
import { useState, useEffect } from 'react'
import GameBoard from './components/GameBoard'
import ScorePanel from './components/ScorePanel'
import GameOverModal from './components/GameOverModal'
import StartScreen from './components/StartScreen'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(20)
  const [gameOver, setGameOver] = useState(false)
  const [level, setLevel] = useState(1)
  const [targetScore, setTargetScore] = useState(1000)

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setMoves(20)
    setGameOver(false)
    setLevel(1)
    setTargetScore(1000)
  }

  const handleScoreUpdate = (points: number) => {
    setScore(prev => prev + points)
  }

  const handleMoveUsed = () => {
    setMoves(prev => prev - 1)
  }

  useEffect(() => {
    if (moves <= 0) {
      setGameOver(true)
    }
  }, [moves])

  useEffect(() => {
    if (score >= targetScore && !gameOver) {
      // Level completed
      setLevel(prev => prev + 1)
      setTargetScore(prev => Math.floor(prev * 1.5))
      setMoves(prev => prev + 10)
    }
  }, [score, targetScore, gameOver])

  return (
    <div className="candy-app">
      {!gameStarted ? (
        <StartScreen onStart={startGame} />
      ) : (
        <div className="game-container">
          <ScorePanel 
            score={score} 
            moves={moves} 
            level={level} 
            targetScore={targetScore} 
          />
          <GameBoard 
            onScoreUpdate={handleScoreUpdate} 
            onMoveUsed={handleMoveUsed}
            gameOver={gameOver}
            level={level}
          />
          {gameOver && (
            <GameOverModal 
              score={score} 
              onRestart={startGame} 
              level={level}
              victory={score >= targetScore}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default App