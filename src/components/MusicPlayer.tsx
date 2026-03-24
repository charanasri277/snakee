import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: 'SYS_INIT.WAV', artist: 'UNKNOWN_ENTITY', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'MEM_LEAK.MP3', artist: 'NULL_POINTER', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'KERNEL_PANIC.OGG', artist: 'ROOT_ACCESS', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
  const prevTrack = () => setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

  return (
    <div className="bg-black border-2 border-[#0ff] p-6 shadow-[4px_4px_0px_#f0f] flex flex-col items-center w-full">
      <div className="flex items-center justify-between w-full border-b-2 border-[#f0f] pb-2 mb-6">
        <h2 className="text-[#f0f] font-pixel text-xs tracking-widest uppercase">AUDIO_UPLINK</h2>
        <span className="text-[#0ff] font-mono text-sm animate-pulse">{isPlaying ? 'TX_ACTIVE' : 'TX_IDLE'}</span>
      </div>

      <audio
        ref={audioRef}
        src={TRACKS[currentTrack].url}
        onEnded={nextTrack}
      />
      
      <div className="text-left w-full mb-8 border border-[#0ff] p-3 bg-[#001111]">
        <h3 className={`text-[#0ff] font-mono text-xl uppercase truncate ${isPlaying ? 'screen-tear' : ''}`}>
          &gt; {TRACKS[currentTrack].title}
        </h3>
        <p className="text-[#f0f] text-sm font-mono mt-1">SRC: {TRACKS[currentTrack].artist}</p>
      </div>

      <div className="flex items-center justify-between w-full mb-6 font-mono text-2xl">
        <button onClick={prevTrack} className="text-[#0ff] hover:bg-[#0ff] hover:text-black border border-transparent hover:border-[#0ff] px-2 transition-none">
          [ &lt;&lt; ]
        </button>
        <button onClick={togglePlay} className="text-[#f0f] hover:bg-[#f0f] hover:text-black border border-[#f0f] px-4 py-1 transition-none animate-pulse">
          {isPlaying ? '[ || ]' : '[ &gt; ]'}
        </button>
        <button onClick={nextTrack} className="text-[#0ff] hover:bg-[#0ff] hover:text-black border border-transparent hover:border-[#0ff] px-2 transition-none">
          [ &gt;&gt; ]
        </button>
      </div>

      <div className="flex items-center gap-4 w-full border-t border-[#0ff] pt-4">
        <button onClick={() => setIsMuted(!isMuted)} className="text-[#f0f] font-mono text-lg hover:bg-[#f0f] hover:text-black px-1">
          {isMuted || volume === 0 ? 'VOL:00' : 'VOL:LV'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            if (isMuted) setIsMuted(false);
          }}
          className="w-full h-2 bg-black border border-[#0ff] appearance-none cursor-pointer accent-[#f0f] rounded-none"
        />
      </div>
    </div>
  );
}
