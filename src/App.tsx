import ActionBar from "./components/actionBar";
import Grid from "./components/grid";
import Header from "./components/header";
function App() {
  return (
    <div className="h-full relative flex flex-col">
      <Header />
      <Grid />
      <ActionBar />
    </div>
  );
}

export default App;
