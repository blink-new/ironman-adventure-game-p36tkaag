
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Trophy, Star, Frown, PartyPopper } from 'lucide-react'
import './GameOverModal.css'

interface GameOverModalProps {
  score: number
  level: number
  onRestart: () => void
  victory: boolean
}

const GameOverModal = ({ score, level, onRestart, victory }: GameOverModalProps) => {
  // Get high score from local storage
  const highScore = localStorage.getItem('candy-crush-high-score')
  const highScoreValue = highScore ? parseInt(highScore) : 0
  
  // Update high score if current score is higher
  if (score > highScoreValue) {
    localStorage.setItem('candy-crush-high-score', score.toString())
  }
  
  return (
    <motion.div 
      className="game-over-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="game-over-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="modal-header">
          {victory ? (
            <>
              <PartyPopper className="victory-icon" />
              <h2 className="modal-title victory">Level Complete!</h2>
            </>
          ) : (
            <>
              <Frown className="game-over-icon" />
              <h2 className="modal-title">Game Over</h2>
            </>
          )}
        </div>
        
        <div className="modal-content">
          <div className="stats-row">
            <div className="modal-stat">
              <Trophy className="modal-stat-icon" />
              <div className="modal-stat-value">{score}</div>
              <div className="modal-stat-label">Score</div>
            </div>
            
            <div className="modal-stat">
              <Star className="modal-stat-icon" />
              <div className="modal-stat-value">{level}</div>
              <div className="modal-stat-label">Level</div>
            </div>
          </div>
          
          <div className="high-score">
            <div className="high-score-label">High Score</div>
            <div className="high-score-value">
              {Math.max(score, highScoreValue)}
              {score > highScoreValue && <span className="new-record">New Record!</span>}
            </div>
          </div>
          
          {victory ? (
            <p className="victory-message">Great job! Ready for the next level?</p>
          ) : (
            <p className="game-over-message">Better luck next time!</p>
          )}
        </div>
        
        <div className="modal-actions">
          <Button 
            onClick={onRestart} 
            className="restart-button"
          >
            {victory ? 'Continue' : 'Play Again'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default GameOverModal