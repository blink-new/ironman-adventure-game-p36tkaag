
import { motion } from 'framer-motion'
import { Trophy, Clock, Star, Target } from 'lucide-react'
import './ScorePanel.css'

interface ScorePanelProps {
  score: number
  moves: number
  level: number
  targetScore: number
}

const ScorePanel = ({ score, moves, level, targetScore }: ScorePanelProps) => {
  // Calculate progress percentage
  const progressPercentage = Math.min(100, (score / targetScore) * 100)
  
  return (
    <div className="score-panel">
      <div className="level-info">
        <motion.div 
          className="level-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Star className="level-icon" />
          <span>Level {level}</span>
        </motion.div>
      </div>
      
      <div className="stats-container">
        <motion.div 
          className="stat-item"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Trophy className="stat-icon score-icon" />
          <div className="stat-value">{score}</div>
          <div className="stat-label">Score</div>
        </motion.div>
        
        <motion.div 
          className="stat-item"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Target className="stat-icon target-icon" />
          <div className="stat-value">{targetScore}</div>
          <div className="stat-label">Target</div>
        </motion.div>
        
        <motion.div 
          className="stat-item"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Clock className="stat-icon moves-icon" />
          <div className="stat-value">{moves}</div>
          <div className="stat-label">Moves</div>
        </motion.div>
      </div>
      
      <div className="progress-container">
        <div className="progress-label">Progress</div>
        <div className="progress-bar">
          <motion.div 
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>
        <div className="progress-percentage">{Math.floor(progressPercentage)}%</div>
      </div>
    </div>
  )
}

export default ScorePanel