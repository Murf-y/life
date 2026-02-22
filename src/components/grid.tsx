import {
  forwardRef,
  useState,
  useImperativeHandle,
  useEffect,
  useRef,
  useCallback,
} from "react";

interface GridHandle {
  start: () => void;
  pause: () => void;
  step: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

interface GridProps {
  onGenerationChange?: (gen: number) => void;
}

const createGrid = (
  rows: number,
  cols: number,
  existing?: boolean[][],
): boolean[][] => {
  const grid: boolean[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: boolean[] = [];
    for (let j = 0; j < cols; j++) {
      row.push(existing?.[i]?.[j] ?? false);
    }
    grid.push(row);
  }
  return grid;
};

const getCellSize = (width: number): number => {
  if (width < 480) return 14;
  if (width < 768) return 16;
  if (width < 1024) return 18;
  return 20;
};

const GAP = 1;

const Grid = forwardRef<GridHandle, GridProps>(
  ({ onGenerationChange }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight - 60,
    });

    const cellSize = getCellSize(containerSize.width);
    const effectiveCell = cellSize + GAP;
    const numCols =
      containerSize.width > 0
        ? Math.floor((containerSize.width + GAP) / effectiveCell)
        : 0;
    const numRows =
      containerSize.height > 0
        ? Math.floor((containerSize.height + GAP) / effectiveCell)
        : 0;

    const [grid, setGrid] = useState<boolean[][]>(() =>
      createGrid(
        Math.max(
          1,
          Math.floor(
            (window.innerHeight - 60 + GAP) /
              (getCellSize(window.innerWidth) + GAP),
          ),
        ),
        Math.max(
          1,
          Math.floor(
            (window.innerWidth + GAP) / (getCellSize(window.innerWidth) + GAP),
          ),
        ),
      ),
    );
    const [generation, setGeneration] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState(100);
    const runningRef = useRef(false);
    const speedRef = useRef(100);

    // ResizeObserver for accurate container measurement
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          setContainerSize({
            width: Math.floor(entry.contentRect.width),
            height: Math.floor(entry.contentRect.height),
          });
        }
      });

      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    // Resize grid when container dimensions change
    useEffect(() => {
      if (numRows > 0 && numCols > 0) {
        setGrid((prev) => {
          if (prev.length === numRows && (prev[0]?.length ?? 0) === numCols)
            return prev;
          return createGrid(
            numRows,
            numCols,
            prev.length > 0 ? prev : undefined,
          );
        });
      }
    }, [numRows, numCols]);

    // Report generation changes to parent
    useEffect(() => {
      onGenerationChange?.(generation);
    }, [generation, onGenerationChange]);

    const performOneIteration = useCallback(() => {
      setGrid((grid) => {
        if (grid.length === 0) return grid;
        const rows = grid.length;
        const cols = grid[0].length;

        const newgrid = grid.map((row) => [...row]);

        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            let neighbors = 0;
            for (let di = -1; di <= 1; di++) {
              for (let dj = -1; dj <= 1; dj++) {
                if (di === 0 && dj === 0) continue;
                const ni = i + di;
                const nj = j + dj;
                if (
                  ni >= 0 &&
                  ni < rows &&
                  nj >= 0 &&
                  nj < cols &&
                  grid[ni][nj]
                ) {
                  neighbors++;
                }
              }
            }

            if (grid[i][j] && (neighbors < 2 || neighbors > 3)) {
              newgrid[i][j] = false;
            } else if (!grid[i][j] && neighbors === 3) {
              newgrid[i][j] = true;
            }
          }
        }

        return newgrid;
      });
      setGeneration((g) => g + 1);
    }, []);

    const runSimulation = useCallback(() => {
      if (!runningRef.current) return;
      performOneIteration();
      setTimeout(runSimulation, speedRef.current);
    }, [performOneIteration]);

    useEffect(() => {
      runningRef.current = isRunning;
      speedRef.current = speed;
    }, [isRunning, speed]);

    useImperativeHandle(ref, () => ({
      start() {
        setIsRunning(true);
        if (!runningRef.current) {
          runningRef.current = true;
          runSimulation();
        }
      },
      pause() {
        setIsRunning(false);
        runningRef.current = false;
      },
      step() {
        performOneIteration();
      },
      reset() {
        setGrid((prev) => createGrid(prev.length, prev[0]?.length ?? 0));
        setGeneration(0);
        setIsRunning(false);
        runningRef.current = false;
      },
      setSpeed(newSpeed: number) {
        setSpeed(newSpeed);
        speedRef.current = newSpeed;
      },
    }));

    const toggleCell = useCallback((i: number, j: number) => {
      setGrid((prev) => {
        const newgrid = prev.map((row) => [...row]);
        newgrid[i][j] = !newgrid[i][j];
        return newgrid;
      });
    }, []);

    return (
      <div
        ref={containerRef}
        className="w-full h-full bg-void overflow-hidden relative"
      >
        {grid.length > 0 && numCols > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${numRows}, ${cellSize}px)`,
              gap: `${GAP}px`,
              backgroundColor: "#1a1a1a",
            }}
          >
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`cell ${cell ? "cell-alive" : "cell-dead"}`}
                  onClick={() => toggleCell(i, j)}
                />
              )),
            )}
          </div>
        )}

        {/* Hint overlay */}
        {generation === 0 && !isRunning && (
          <div className="absolute bottom-5 sm:bottom-6 left-0 right-0 text-center pointer-events-none select-none">
            <span className="text-ink-muted text-[10px] sm:text-xs tracking-[0.2em] uppercase font-mono">
              <span className="sm:hidden">Tap to draw</span>
              <span className="hidden sm:inline">
                Click to draw · Space to start
              </span>
            </span>
          </div>
        )}
      </div>
    );
  },
);

Grid.displayName = "Grid";

export default Grid;
