import { useState } from "react";

function Grid() {
  const screen_width = window.innerWidth;
  const screen_height = window.innerHeight * 0.833333;

  const square_width = 24;
  const square_height = 24;

  const numberOfColumns = Math.floor(screen_width / square_width);
  const numberOfRows = Math.floor(screen_height / square_height);

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
    callback: { (newgrid: any): void; (arg0: any): void }
  ) => {
    const newgrid = JSON.parse(JSON.stringify(grid));
    callback(newgrid);
    return newgrid;
  };

  return (
    <div className="w-full h-5/6 flex flex-wrap">
      {grid.map((row, i) => {
        return row.map((cell, j) => {
          return (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newgrid = produce(grid, (newgrid) => {
                  newgrid[i][j] = 1 - newgrid[i][j];
                });
                setGrid(newgrid);
              }}
              style={{
                backgroundColor: grid[i][j] ? "#AA4465" : "#EDF0DA",
              }}
              className={`cursor-pointer border border-yellow-dark w-5 h-5`}
            ></div>
          );
        });
      })}
    </div>
  );
}

export default Grid;
