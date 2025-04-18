
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Candy } from 'lucide-react'
import './StartScreen.css'

interface StartScreenProps {
  onStart: () => void
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="start-screen">
      <motion.div 
        className="start-content"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="logo-container"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
        >
          <Candy className="candy-logo" size={80} />
        </motion.div>
        
        <motion.h1 
          className="game-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="title-word">Candy</span>
          <span className="title-word">Crush</span>
        </motion.h1>
        
        <motion.p 
          className="game-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Match 3 or more candies to score points!
        </motion.p>
        
        <motion.div 
          className="candy-icons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {['red', 'blue', 'green', 'yellow', 'purple', 'orange'].map((color, index) => (
            <motion.div 
              key={color}
              className={`candy-icon ${color}`}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                delay: 0.8 + index * 0.1,
                type: 'spring',
                stiffness: 300,
                damping: 15
              }}
            />
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={onStart}
            className="start-button"
          >
            Play Now
          </Button>
        </motion.div>
        
        <motion.div 
          className="instructions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <h3>How to Play:</h3>
          <ul>
            <li>Swap adjacent candies to match 3 or more</li>
            <li>Match 4 candies to create special candies</li>
            <li>Reach the target score to advance to the next level</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default StartScreen