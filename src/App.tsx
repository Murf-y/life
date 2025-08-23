import { useRef } from "react";
import Header from "./components/header";
import Grid from "./components/grid";

interface GridHandle {
  start: () => void;
  pause: () => void;
  step: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

function App() {
  const gridRef = useRef<GridHandle>(null);

  return (
    <div className="h-screen bg-yellow-900 flex flex-col">
      <Header
        onStart={() => gridRef.current?.start()}
        onPause={() => gridRef.current?.pause()}
        onStep={() => gridRef.current?.step()}
        onReset={() => gridRef.current?.reset()}
        onSpeedChange={(speed) => gridRef.current?.setSpeed(speed)}
      />
      <div className="flex-1 mt-16 overflow-hidden">
        <Grid ref={gridRef} />
      </div>
    </div>
  );
}

export default App;
