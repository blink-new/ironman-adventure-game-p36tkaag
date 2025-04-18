
import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { motion } from 'framer-motion'

interface StartScreenProps {
  onStart: () => void
  score: number
  gameOver: boolean
}

const StartScreen = ({ onStart, score, gameOver }: StartScreenProps) => {
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    const savedHighScore = localStorage.getItem('ironman-highscore')
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore))
    }

    if (gameOver && score > highScore) {
      setHighScore(score)
      localStorage.setItem('ironman-highscore', score.toString())
    }
  }, [gameOver, score, highScore])

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-b from-blue-900 to-black text-white p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.7)]">
          IRON MAN
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-yellow-400">
          ADVENTURE
        </h2>

        {gameOver && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-2xl font-bold mb-2">GAME OVER</h3>
            <p className="text-xl mb-1">Your Score: <span className="text-yellow-400">{score}</span></p>
            <p className="text-lg">High Score: <span className="text-yellow-400">{highScore}</span></p>
          </motion.div>
        )}

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={onStart}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-xl rounded-lg shadow-lg transition-all duration-300 hover:shadow-red-500/50"
          >
            {gameOver ? 'PLAY AGAIN' : 'START GAME'}
          </Button>
        </motion.div>

        <div className="mt-12 text-sm text-gray-400">
          <p className="mb-2">Controls:</p>
          <p>Arrow Keys or WASD to move</p>
          <p>SPACE to jump</p>
          <p>F to fire repulsor blast</p>
        </div>
      </motion.div>
    </div>
  )
}

export default StartScreen