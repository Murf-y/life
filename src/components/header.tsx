import React, { useState, useEffect, useCallback, useRef } from "react";

interface HeaderProps {
  onStart: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  generation: number;
}

const Header: React.FC<HeaderProps> = ({
  onStart,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
  generation,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(100);

  // Stable refs for callbacks to avoid effect churn during fast simulation
  const isPlayingRef = useRef(false);
  const onStartRef = useRef(onStart);
  const onPauseRef = useRef(onPause);
  const onStepRef = useRef(onStep);
  const onResetRef = useRef(onReset);

  useEffect(() => {
    onStartRef.current = onStart;
    onPauseRef.current = onPause;
    onStepRef.current = onStep;
    onResetRef.current = onReset;
  });

  const handlePlayPause = useCallback(() => {
    if (isPlayingRef.current) {
      onPauseRef.current();
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      onStartRef.current();
      setIsPlaying(true);
      isPlayingRef.current = true;
    }
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    onResetRef.current();
  }, []);

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseInt(e.target.value);
    setSpeed(newSpeed);
    onSpeedChange(newSpeed);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        if (!isPlayingRef.current) onStepRef.current();
      } else if (e.code === "KeyR") {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePlayPause, handleReset]);

  const formatGen = (n: number) => String(n).padStart(5, "0");

  const ghostBtn =
    "inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-ink border-2 border-stroke-heavy hover:border-ink transition-colors cursor-pointer bg-transparent select-none";
  const ghostBtnDisabled =
    "inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-ink-muted border-2 border-stroke hover:border-stroke cursor-not-allowed bg-transparent select-none";

  return (
    <header className="flex-shrink-0 bg-void border-b-[3px] border-stroke-heavy px-3 sm:px-5 py-2.5">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Title + Generation */}
        <div className="flex items-center gap-2 sm:gap-3 mr-auto">
          <h1 className="text-ink font-bold text-sm sm:text-base tracking-tight uppercase flex items-center gap-1.5 select-none">
            <span className="text-neon text-base sm:text-lg leading-none">
              ■
            </span>
            <span className="hidden sm:inline">Game of </span>Life
          </h1>
          <span
            className={`text-[10px] sm:text-xs font-mono tracking-wider transition-colors duration-200 ${
              isPlaying ? "text-neon" : "text-ink-dim opacity-70"
            }`}
          >
            {formatGen(generation)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Play / Pause */}
          <button
            onClick={handlePlayPause}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-accent text-ink border-2 border-accent hover:bg-accent-hover hover:border-accent-hover transition-colors cursor-pointer select-none"
          >
            {isPlaying ? "❚❚" : "▶"}
            <span className="hidden md:inline">
              {isPlaying ? "Pause" : "Play"}
            </span>
          </button>

          {/* Step */}
          <button
            onClick={onStep}
            disabled={isPlaying}
            className={isPlaying ? ghostBtnDisabled : ghostBtn}
          >
            »<span className="hidden md:inline">Step</span>
          </button>

          {/* Clear */}
          <button onClick={handleReset} className={ghostBtn}>
            ✕<span className="hidden md:inline">Clear</span>
          </button>
        </div>

        {/* Speed */}
        <div className="hidden xs:flex items-center gap-2 pl-2 sm:pl-3 border-l-[3px] border-stroke-heavy">
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={speed}
            onChange={handleSpeedChange}
            className="w-12 sm:w-20 md:w-24"
          />
          <span className="text-ink-dim text-[10px] font-mono w-9 text-right">
            {speed}ms
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
