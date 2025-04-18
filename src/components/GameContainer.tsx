
import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { MainScene } from '../game/MainScene'
import { PreloadScene } from '../game/PreloadScene'

interface GameContainerProps {
  onScoreUpdate: (score: number) => void
  onLivesUpdate: (lives: number) => void
  onGameOver: () => void
}

const GameContainer = ({ onScoreUpdate, onLivesUpdate, onGameOver }: GameContainerProps) => {
  const gameRef = useRef<Phaser.Game | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current && !gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: containerRef.current,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 800 },
            debug: false
          }
        },
        scene: [
          new PreloadScene(), 
          new MainScene(onScoreUpdate, onLivesUpdate, onGameOver)
        ],
        pixelArt: true,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        }
      }

      gameRef.current = new Phaser.Game(config)
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [onScoreUpdate, onLivesUpdate, onGameOver])

  return <div ref={containerRef} className="game-container" />
}

export default GameContainer