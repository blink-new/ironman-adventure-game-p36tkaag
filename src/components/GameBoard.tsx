
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import './GameBoard.css'

// Candy types
const candyColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']

// Special candy types
type SpecialType = 'normal' | 'striped-h' | 'striped-v' | 'wrapped' | 'color-bomb'

interface Candy {
  color: string
  special: SpecialType
  id: string
}

interface GameBoardProps {
  onScoreUpdate: (points: number) => void
  onMoveUsed: () => void
  gameOver: boolean
  level: number
}

const GameBoard = ({ onScoreUpdate, onMoveUsed, gameOver, level }: GameBoardProps) => {
  const boardSize = 8
  const [board, setBoard] = useState<Candy[][]>([])
  const [selectedCandy, setSelectedCandy] = useState<{row: number, col: number} | null>(null)
  const [isSwapping, setIsSwapping] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [animations, setAnimations] = useState<{row: number, col: number, type: string}[]>([])

  // Initialize the board
  const initializeBoard = useCallback(() => {
    const newBoard: Candy[][] = []
    
    for (let i = 0; i < boardSize; i++) {
      newBoard[i] = []
      for (let j = 0; j < boardSize; j++) {
        let color
        
        // Avoid creating matches on initialization
        do {
          color = candyColors[Math.floor(Math.random() * candyColors.length)]
        } while (
          (j >= 2 && newBoard[i][j-1]?.color === color && newBoard[i][j-2]?.color === color) ||
          (i >= 2 && newBoard[i-1][j]?.color === color && newBoard[i-2][j]?.color === color)
        )
        
        newBoard[i][j] = {
          color,
          special: 'normal',
          id: `${i}-${j}-${Math.random()}`
        }
      }
    }
    
    return newBoard
  }, [])

  // Initialize board on mount and level change
  useEffect(() => {
    setBoard(initializeBoard())
  }, [initializeBoard, level])

  // Check for matches
  const checkMatches = useCallback(() => {
    if (isChecking || gameOver) return
    
    setIsChecking(true)
    let matchFound = false
    const newBoard = [...board]
    const newAnimations: {row: number, col: number, type: string}[] = []
    
    // Check horizontal matches
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize - 2; j++) {
        if (
          newBoard[i][j] && 
          newBoard[i][j+1] && 
          newBoard[i][j+2] && 
          newBoard[i][j].color === newBoard[i][j+1].color && 
          newBoard[i][j].color === newBoard[i][j+2].color
        ) {
          // Determine match length
          let matchLength = 3
          while (j + matchLength < boardSize && 
                 newBoard[i][j].color === newBoard[i][j+matchLength].color) {
            matchLength++
          }
          
          // Create special candies based on match length
          if (matchLength >= 5) {
            // Color bomb for 5+ match
            newBoard[i][j] = {
              ...newBoard[i][j],
              special: 'color-bomb',
              id: `${i}-${j}-${Math.random()}`
            }
            newAnimations.push({row: i, col: j, type: 'color-bomb'})
          } else if (matchLength === 4) {
            // Striped candy for 4 match
            newBoard[i][j] = {
              ...newBoard[i][j],
              special: Math.random() > 0.5 ? 'striped-h' : 'striped-v',
              id: `${i}-${j}-${Math.random()}`
            }
            newAnimations.push({row: i, col: j, type: 'striped'})
          }
          
          // Mark candies for removal (except the first one if it's special)
          for (let k = (matchLength >= 4 ? 1 : 0); k < matchLength; k++) {
            newBoard[i][j+k] = null as any
            newAnimations.push({row: i, col: j+k, type: 'remove'})
          }
          
          // Award points
          onScoreUpdate(matchLength * 10)
          matchFound = true
          j += matchLength - 1 // Skip the matched candies
        }
      }
    }
    
    // Check vertical matches
    for (let j = 0; j < boardSize; j++) {
      for (let i = 0; i < boardSize - 2; i++) {
        if (
          newBoard[i][j] && 
          newBoard[i+1][j] && 
          newBoard[i+2][j] && 
          newBoard[i][j].color === newBoard[i+1][j].color && 
          newBoard[i][j].color === newBoard[i+2][j].color
        ) {
          // Determine match length
          let matchLength = 3
          while (i + matchLength < boardSize && 
                 newBoard[i][j].color === newBoard[i+matchLength][j].color) {
            matchLength++
          }
          
          // Create special candies based on match length
          if (matchLength >= 5) {
            // Color bomb for 5+ match
            newBoard[i][j] = {
              ...newBoard[i][j],
              special: 'color-bomb',
              id: `${i}-${j}-${Math.random()}`
            }
            newAnimations.push({row: i, col: j, type: 'color-bomb'})
          } else if (matchLength === 4) {
            // Striped candy for 4 match
            newBoard[i][j] = {
              ...newBoard[i][j],
              special: Math.random() > 0.5 ? 'striped-h' : 'striped-v',
              id: `${i}-${j}-${Math.random()}`
            }
            newAnimations.push({row: i, col: j, type: 'striped'})
          }
          
          // Mark candies for removal (except the first one if it's special)
          for (let k = (matchLength >= 4 ? 1 : 0); k < matchLength; k++) {
            newBoard[i+k][j] = null as any
            newAnimations.push({row: i+k, col: j, type: 'remove'})
          }
          
          // Award points
          onScoreUpdate(matchLength * 10)
          matchFound = true
          i += matchLength - 1 // Skip the matched candies
        }
      }
    }
    
    if (matchFound) {
      setAnimations(newAnimations)
      
      // Update the board after animations
      setTimeout(() => {
        setBoard(newBoard)
        
        // Fill empty spaces after a delay
        setTimeout(() => {
          fillEmptySpaces()
        }, 300)
      }, 300)
    } else {
      setIsChecking(false)
    }
  }, [board, isChecking, gameOver, onScoreUpdate])

  // Fill empty spaces with new candies
  const fillEmptySpaces = useCallback(() => {
    const newBoard = [...board]
    let newCandiesAdded = false
    
    // Move candies down
    for (let j = 0; j < boardSize; j++) {
      for (let i = boardSize - 1; i > 0; i--) {
        if (!newBoard[i][j]) {
          // Find the nearest candy above
          for (let k = i - 1; k >= 0; k--) {
            if (newBoard[k][j]) {
              newBoard[i][j] = newBoard[k][j]
              newBoard[k][j] = null as any
              newCandiesAdded = true
              break
            }
          }
        }
      }
    }
    
    // Add new candies at the top
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (!newBoard[i][j]) {
          newBoard[i][j] = {
            color: candyColors[Math.floor(Math.random() * candyColors.length)],
            special: 'normal',
            id: `${i}-${j}-${Math.random()}`
          }
          newCandiesAdded = true
        }
      }
    }
    
    setBoard(newBoard)
    
    // Check for new matches after filling
    if (newCandiesAdded) {
      setTimeout(() => {
        checkMatches()
      }, 500)
    } else {
      setIsChecking(false)
    }
  }, [board, checkMatches])

  // Handle candy selection
  const handleCandyClick = (row: number, col: number) => {
    if (isSwapping || isChecking || gameOver) return
    
    if (selectedCandy) {
      // Check if the clicked candy is adjacent to the selected one
      const isAdjacent = 
        (Math.abs(selectedCandy.row - row) === 1 && selectedCandy.col === col) ||
        (Math.abs(selectedCandy.col - col) === 1 && selectedCandy.row === row)
      
      if (isAdjacent) {
        // Swap candies
        swapCandies(selectedCandy.row, selectedCandy.col, row, col)
      } else {
        // Select the new candy instead
        setSelectedCandy({ row, col })
      }
    } else {
      // Select the candy
      setSelectedCandy({ row, col })
    }
  }

  // Swap candies
  const swapCandies = (row1: number, col1: number, row2: number, col2: number) => {
    setIsSwapping(true)
    
    const newBoard = [...board]
    const temp = newBoard[row1][col1]
    newBoard[row1][col1] = newBoard[row2][col2]
    newBoard[row2][col2] = temp
    
    setBoard(newBoard)
    setSelectedCandy(null)
    
    // Check if the swap creates a match
    setTimeout(() => {
      const hasMatch = checkForPotentialMatches(newBoard, row1, col1, row2, col2)
      
      if (hasMatch) {
        // Valid move
        onMoveUsed()
        setTimeout(() => {
          checkMatches()
          setIsSwapping(false)
        }, 300)
      } else {
        // Invalid move, swap back
        const revertBoard = [...newBoard]
        const temp = revertBoard[row1][col1]
        revertBoard[row1][col1] = revertBoard[row2][col2]
        revertBoard[row2][col2] = temp
        
        setBoard(revertBoard)
        setIsSwapping(false)
      }
    }, 400)
  }

  // Check if a swap would create a match
  const checkForPotentialMatches = (board: Candy[][], row1: number, col1: number, row2: number, col2: number) => {
    // Check horizontal matches for the first candy's new position
    if (col1 >= 2 && 
        board[row1][col1-1]?.color === board[row1][col1]?.color && 
        board[row1][col1-2]?.color === board[row1][col1]?.color) {
      return true
    }
    if (col1 <= boardSize - 3 && 
        board[row1][col1+1]?.color === board[row1][col1]?.color && 
        board[row1][col1+2]?.color === board[row1][col1]?.color) {
      return true
    }
    if (col1 >= 1 && col1 <= boardSize - 2 && 
        board[row1][col1-1]?.color === board[row1][col1]?.color && 
        board[row1][col1+1]?.color === board[row1][col1]?.color) {
      return true
    }
    
    // Check vertical matches for the first candy's new position
    if (row1 >= 2 && 
        board[row1-1][col1]?.color === board[row1][col1]?.color && 
        board[row1-2][col1]?.color === board[row1][col1]?.color) {
      return true
    }
    if (row1 <= boardSize - 3 && 
        board[row1+1][col1]?.color === board[row1][col1]?.color && 
        board[row1+2][col1]?.color === board[row1][col1]?.color) {
      return true
    }
    if (row1 >= 1 && row1 <= boardSize - 2 && 
        board[row1-1][col1]?.color === board[row1][col1]?.color && 
        board[row1+1][col1]?.color === board[row1][col1]?.color) {
      return true
    }
    
    // Check horizontal matches for the second candy's new position
    if (col2 >= 2 && 
        board[row2][col2-1]?.color === board[row2][col2]?.color && 
        board[row2][col2-2]?.color === board[row2][col2]?.color) {
      return true
    }
    if (col2 <= boardSize - 3 && 
        board[row2][col2+1]?.color === board[row2][col2]?.color && 
        board[row2][col2+2]?.color === board[row2][col2]?.color) {
      return true
    }
    if (col2 >= 1 && col2 <= boardSize - 2 && 
        board[row2][col2-1]?.color === board[row2][col2]?.color && 
        board[row2][col2+1]?.color === board[row2][col2]?.color) {
      return true
    }
    
    // Check vertical matches for the second candy's new position
    if (row2 >= 2 && 
        board[row2-1][col2]?.color === board[row2][col2]?.color && 
        board[row2-2][col2]?.color === board[row2][col2]?.color) {
      return true
    }
    if (row2 <= boardSize - 3 && 
        board[row2+1][col2]?.color === board[row2][col2]?.color && 
        board[row2+2][col2]?.color === board[row2][col2]?.color) {
      return true
    }
    if (row2 >= 1 && row2 <= boardSize - 2 && 
        board[row2-1][col2]?.color === board[row2][col2]?.color && 
        board[row2+1][col2]?.color === board[row2][col2]?.color) {
      return true
    }
    
    return false
  }

  // Render candy with appropriate styling based on type
  const renderCandy = (candy: Candy, row: number, col: number) => {
    if (!candy) return null
    
    const isSelected = selectedCandy && selectedCandy.row === row && selectedCandy.col === col
    
    // Animation for the current candy
    const animation = animations.find(a => a.row === row && a.col === col)
    
    let specialClass = ''
    if (candy.special === 'striped-h') specialClass = 'striped-h'
    if (candy.special === 'striped-v') specialClass = 'striped-v'
    if (candy.special === 'wrapped') specialClass = 'wrapped'
    if (candy.special === 'color-bomb') specialClass = 'color-bomb'
    
    return (
      <motion.div
        key={candy.id}
        className={`candy ${candy.color} ${specialClass} ${isSelected ? 'selected' : ''}`}
        onClick={() => handleCandyClick(row, col)}
        initial={{ scale: animation ? 0 : 1 }}
        animate={{ 
          scale: animation?.type === 'remove' ? 0 : 1,
          rotate: candy.special === 'color-bomb' ? 360 : 0
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 20,
          duration: 0.3
        }}
      >
        {candy.special === 'color-bomb' && (
          <Sparkles className="sparkle-icon" size={20} />
        )}
      </motion.div>
    )
  }

  return (
    <div className="game-board-container">
      <div className="game-board">
        <AnimatePresence>
          {board.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="board-row">
              {row.map((candy, colIndex) => (
                <div key={`cell-${rowIndex}-${colIndex}`} className="board-cell">
                  {renderCandy(candy, rowIndex, colIndex)}
                </div>
              ))}
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default GameBoard