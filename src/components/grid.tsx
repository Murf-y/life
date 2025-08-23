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

const Grid = forwardRef<GridHandle>((props, ref) => {
  const screen_width = window.innerWidth;
  const screen_height = window.innerHeight;

  const square_width = 20;
  const square_height = 20;

  const numberOfColumns = Math.floor(screen_width / square_width);
  const numberOfRows = Math.floor((screen_height - 80) / square_height); // Account for header

  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(100); // milliseconds between iterations
  const runningRef = useRef(isRunning);
  const speedRef = useRef(speed);

  const getInitialGrid = () => {
    const grid: boolean[][] = [];
    for (let i = 0; i < numberOfRows; i++) {
      grid.push([]);
      for (let j = 0; j < numberOfColumns; j++) {
        grid[i].push(false);
      }
    }
    return grid;
  };

  const [grid, setGrid] = useState(getInitialGrid());

  const produce = (
    grid: boolean[][],
    callback: (newgrid: boolean[][]) => void
  ) => {
    const newgrid = JSON.parse(JSON.stringify(grid));
    callback(newgrid);
    return newgrid;
  };

  const getNeighbors = (i: number, j: number) => {
    const neighbors = [
      [i - 1, j - 1],
      [i - 1, j],
      [i - 1, j + 1],
      [i, j - 1],
      [i, j + 1],
      [i + 1, j - 1],
      [i + 1, j],
      [i + 1, j + 1],
    ];

    return neighbors.filter((neighbor) => {
      const [x, y] = neighbor;
      return x >= 0 && x < numberOfRows && y >= 0 && y < numberOfColumns;
    });
  };

  const performOneIteration = useCallback(() => {
    setGrid((grid) => {
      return produce(grid, (newgrid) => {
        for (let i = 0; i < numberOfRows; i++) {
          for (let j = 0; j < numberOfColumns; j++) {
            const neighbors = getNeighbors(i, j);
            const numberOfNeighbors = neighbors.reduce((acc, neighbor) => {
              const [x, y] = neighbor;
              return acc + (grid[x][y] ? 1 : 0);
            }, 0);

            if (
              grid[i][j] &&
              (numberOfNeighbors < 2 || numberOfNeighbors > 3)
            ) {
              newgrid[i][j] = false;
            } else if (!grid[i][j] && numberOfNeighbors === 3) {
              newgrid[i][j] = true;
            } else {
              newgrid[i][j] = grid[i][j];
            }
          }
        }
      });
    });
  }, [numberOfRows, numberOfColumns]);

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
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
      setGrid(getInitialGrid());
      setIsRunning(false);
      runningRef.current = false;
    },
    setSpeed(newSpeed: number) {
      setSpeed(newSpeed);
      speedRef.current = newSpeed;
    },
  }));

  return (
    <div className="w-full h-full bg-yellow-900 overflow-hidden">
      <div
        className="flex flex-wrap"
        style={{ width: numberOfColumns * square_width }}
      >
        {grid.map((row, i) => {
          return row.map((cell, j) => {
            return (
              <div
                key={`${i}-${j}`}
                onClick={() => {
                  const newgrid = produce(grid, (newgrid) => {
                    newgrid[i][j] = !newgrid[i][j];
                  });
                  setGrid(newgrid);
                }}
                style={{
                  width: square_width,
                  height: square_height,
                  backgroundColor: grid[i][j] ? "#AA4465" : "#EDF0DA",
                }}
                className="cursor-pointer border border-yellow-dark transition-colors duration-150 hover:border-yellow-500"
              ></div>
            );
          });
        })}
      </div>
    </div>
  );
});

Grid.displayName = "Grid";

export default Grid;
