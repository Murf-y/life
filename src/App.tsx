import { useRef, useState } from "react";
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
  const [generation, setGeneration] = useState(0);

  return (
    <div className="h-full bg-void flex flex-col overflow-hidden">
      <Header
        onStart={() => gridRef.current?.start()}
        onPause={() => gridRef.current?.pause()}
        onStep={() => gridRef.current?.step()}
        onReset={() => gridRef.current?.reset()}
        onSpeedChange={(speed) => gridRef.current?.setSpeed(speed)}
        generation={generation}
      />
      <div className="flex-1 overflow-hidden">
        <Grid ref={gridRef} onGenerationChange={setGeneration} />
      </div>
    </div>
  );
}

export default App;
