import './App.css';
import NewCharacter from "./newCharacter";

const CONTAINER_WIDTH = window.innerWidth
const CONTAINER_HEIGHT = window.innerHeight/4

function App() {
  return (
    <div className="App" style={{backgroundColor: 'red', position: 'relative', width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT}}>
        <NewCharacter/>
    </div>
  );
}

export default App;
