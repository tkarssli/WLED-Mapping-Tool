import { useState } from 'react'
import './App.css'
import GridSettings from './GridSettings';
import LEDGrid from './LEDGrid';
import OutputPanel from './OutputPanel';

export interface InitialCellState {
  enabled: boolean,
  index: number
}

const App: React.FC = () => {
  const [gridSize, setGridSize] = useState({ x: 5, y: 5 });
  const [gridState, setGridState] = useState<InitialCellState[][]>([]);

  const handleGridSizeChange = (x: number, y: number) => {
    setGridSize({ x, y });
    setGridState([])
  };

  return (
    <div className='app'>
      <h1>WLED Mapping Tool</h1>
      <GridSettings onGridSizeChange={handleGridSizeChange} />
      <LEDGrid gridX={gridSize.x} gridY={gridSize.y} onGridUpdate={setGridState} />
      <OutputPanel grid={gridState} />
    </div>
  );
};


export default App
