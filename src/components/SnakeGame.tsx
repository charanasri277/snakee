import React, { useEffect, useRef, useState, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const SPEED = 70;

type Point = { x: number; y: number };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [dir, setDir] = useState<Point>({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const stateRef = useRef({ snake, dir, food, gameOver, isPaused, score, hasStarted });
  useEffect(() => {
    stateRef.current = { snake, dir, food, gameOver, isPaused, score, hasStarted };
  }, [snake, dir, food, gameOver, isPaused, score, hasStarted]);

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setDir({ x: 0, y: -1 });
    setFood({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    });
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
    setHasStarted(true);
  }, [onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { dir, gameOver, hasStarted } = stateRef.current;
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) {
        if (e.key === 'Enter' || e.key === ' ') resetGame();
        return;
      }

      if (!hasStarted) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
          setHasStarted(true);
        }
      }

      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w': if (dir.y !== 1) setDir({ x: 0, y: -1 }); break;
        case 'arrowdown':
        case 's': if (dir.y !== -1) setDir({ x: 0, y: 1 }); break;
        case 'arrowleft':
        case 'a': if (dir.x !== 1) setDir({ x: -1, y: 0 }); break;
        case 'arrowright':
        case 'd': if (dir.x !== -1) setDir({ x: 1, y: 0 }); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetGame]);

  useEffect(() => {
    const moveSnake = () => {
      const { snake, dir, food, gameOver, isPaused, hasStarted } = stateRef.current;
      if (gameOver || isPaused || !hasStarted) return;

      const head = snake[0];
      const newHead = { x: head.x + dir.x, y: head.y + dir.y };

      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        return;
      }

      const newSnake = [newHead, ...snake];
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        let newFood;
        while (true) {
          newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
          };
          // eslint-disable-next-line no-loop-func
          if (!newSnake.some(s => s.x === newFood.x && s.y === newFood.y)) {
            break;
          }
        }
        setFood(newFood);
      } else {
        newSnake.pop();
      }
      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  }, [onScoreChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw harsh grid
    ctx.strokeStyle = '#003333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_SIZE, i); ctx.stroke();
    }

    // Draw food (Magenta Square)
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(food.x * CELL_SIZE + 2, food.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);

    // Draw snake (Cyan head, Magenta body, harsh pixels)
    snake.forEach((segment, index) => {
      if (index === 0) {
        ctx.fillStyle = '#00ffff';
      } else {
        // Alternating colors for glitchy look
        ctx.fillStyle = index % 2 === 0 ? '#ff00ff' : '#00ffff';
      }
      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });
  }, [snake, food]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="block bg-black"
      />
      
      {!hasStarted && !gameOver && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10 border-2 border-[#0ff] m-4">
          <p className="text-[#0ff] font-pixel text-sm mb-4 animate-pulse text-center leading-loose">AWAITING<br/>INPUT_VECTOR</p>
          <p className="text-[#f0f] font-mono text-xl">[W A S D]</p>
        </div>
      )}

      {isPaused && hasStarted && !gameOver && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-10 border-2 border-[#f0f] m-4 screen-tear">
          <p className="text-[#f0f] font-pixel text-xl glitch-text" data-text="PROC_SUSPENDED">PROC_SUSPENDED</p>
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-10 border-4 border-[#f0f] m-2 screen-tear">
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-[#f0f] font-pixel text-2xl glitch-text text-center leading-loose" data-text="FATAL_ERROR">FATAL_ERROR</h2>
            <div className="flex flex-col items-center bg-black border border-[#0ff] px-6 py-4">
              <span className="text-[#0ff] font-mono text-xl mb-2">DATA_CORRUPTED</span>
              <span className="text-[#f0f] font-mono text-4xl">{score}</span>
            </div>
            <button
              onClick={resetGame}
              className="mt-4 px-6 py-2 bg-black border-2 border-[#0ff] text-[#0ff] font-pixel text-xs hover:bg-[#0ff] hover:text-black transition-none uppercase"
            >
              [ REBOOT_SYS ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
