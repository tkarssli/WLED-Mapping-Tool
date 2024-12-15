import React from 'react';
import { InitialCellState } from './App';
import './OutputPanel.css';
import CodeBlock from './CodeBlock';

interface OutputPanelProps {
  grid: InitialCellState[][];
}

const OutputPanel: React.FC<OutputPanelProps> = ({ grid }) => {
  const generateJSON = () => {
    const json = {
      leds: grid
        .flatMap((row) => row.map((cell) => (cell.enabled ? cell.index : -1)))
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
      <CodeBlock language={'json'} downloadHandler={downloadJSON}>{generateJSON()}</CodeBlock>
    </div>
  );
};

export default OutputPanel;
