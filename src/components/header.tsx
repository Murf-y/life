import React, { useState } from "react";

interface HeaderProps {
  onStart: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

const Header: React.FC<HeaderProps> = ({
  onStart,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(100);

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onStart();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    onReset();
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseInt(e.target.value);
    setSpeed(newSpeed);
    onSpeedChange(newSpeed);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-yellow-dark border-b border-yellow-darker px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-yellow-darker">Game of Life</h1>

        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            {isPlaying ? (
              <>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Play
              </>
            )}
          </button>

          {/* Step Button */}
          <button
            onClick={onStep}
            disabled={isPlaying}
            className="px-4 py-2 disabled:text-gray-700 disabled:cursor-not-allowed text-yellow-darker rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Step
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="px-4 py-2 text-yellow-darker rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Reset
          </button>

          {/* Speed Control */}
          <div className="flex items-center gap-3 bg-yellow-dark px-4 py-2 rounded-lg">
            <label className="text-yellow-darker text-sm font-medium">
              Speed:
            </label>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={speed}
              onChange={handleSpeedChange}
              // style the thumb
              className="w-32 h-2 bg-primary-light rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-yellow-darker text-sm w-12 text-right">
              {speed}ms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
