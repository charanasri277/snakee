import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono selection:bg-magenta-500/50 flex flex-col items-center py-8 px-4 overflow-hidden relative crt">
      <div className="noise"></div>
      <div className="scanline"></div>

      <header className="mb-12 text-center z-10 mt-4 screen-tear">
        <h1 className="text-3xl md:text-5xl font-pixel tracking-tighter mb-4 text-[#0ff] glitch-text uppercase" data-text="SYSTEM.OVERRIDE">
          SYSTEM.OVERRIDE
        </h1>
        <p className="text-[#f0f] font-mono tracking-widest text-xl border-y border-[#f0f] py-1 inline-block bg-black">
          // PROTOCOL: SNAKE_V1.0.9 //
        </p>
      </header>

      <main className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-8 xl:gap-12 w-full max-w-6xl z-10">
        {/* Left/Top: Game Stats & Controls Info */}
        <div className="flex flex-col gap-6 w-full max-w-xs order-2 xl:order-1">
          <div className="bg-black border-2 border-[#0ff] p-6 shadow-[4px_4px_0px_#f0f]">
            <h2 className="text-[#f0f] font-pixel text-xs mb-6 tracking-widest uppercase border-b-2 border-[#0ff] pb-2">DATA_YIELD</h2>
            <div className="flex justify-between items-end mb-4">
              <span className="text-[#0ff] font-mono text-xl">CURRENT_BUFFER</span>
              <span className="text-4xl font-mono text-[#f0f]">{score.toString().padStart(4, '0')}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-[#0ff] font-mono text-xl">MAX_CAPACITY</span>
              <span className="text-2xl font-mono text-[#0ff]">{highScore.toString().padStart(4, '0')}</span>
            </div>
          </div>

          <div className="bg-black border-2 border-[#f0f] p-6 shadow-[4px_4px_0px_#0ff]">
            <h2 className="text-[#0ff] font-pixel text-xs mb-6 tracking-widest uppercase border-b-2 border-[#f0f] pb-2">INPUT_MATRIX</h2>
            <ul className="space-y-4 text-lg text-[#f0f] font-mono">
              <li className="flex justify-between items-center">
                <span>VECTOR_ADJ</span> 
                <div className="flex gap-1">
                  <span className="bg-black px-2 py-1 border border-[#0ff] text-[#0ff]">W</span>
                  <span className="bg-black px-2 py-1 border border-[#0ff] text-[#0ff]">A</span>
                  <span className="bg-black px-2 py-1 border border-[#0ff] text-[#0ff]">S</span>
                  <span className="bg-black px-2 py-1 border border-[#0ff] text-[#0ff]">D</span>
                </div>
              </li>
              <li className="flex justify-between items-center">
                <span>HALT_PROC</span> 
                <span className="bg-black px-3 py-1 border border-[#f0f] text-[#f0f]">SPACE</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Center: Game */}
        <div className="order-1 xl:order-2 relative group mt-4 xl:mt-0 screen-tear">
          <div className="relative bg-black border-4 border-[#0ff] p-1 shadow-[8px_8px_0px_#f0f]">
            <SnakeGame onScoreChange={handleScoreChange} />
          </div>
        </div>

        {/* Right/Bottom: Music Player */}
        <div className="flex flex-col gap-6 w-full max-w-xs order-3">
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
