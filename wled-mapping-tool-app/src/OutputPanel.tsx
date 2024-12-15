import React from 'react';
import { InitialCellState } from './App';
import './OutputPanel.css';

interface OutputPanelProps {
  grid: InitialCellState[][];
}

const OutputPanel: React.FC<OutputPanelProps> = ({ grid }) => {
  const generateJSON = () => {
    const json = {
      leds: grid
        .flatMap((row, y) => row.map((cell) => (cell.enabled ? cell.index : -1)))
        .filter((cell) => cell !== null),
    };
    return JSON.stringify(json, null, 0);
  };

  const downloadJSON = () => {
    const blob = new Blob([generateJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'led_map.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className='outputPanel'>
      <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{generateJSON()}</pre>
      <button onClick={downloadJSON}>Download JSON</button>
    </div>
  );
};

export default OutputPanel;
