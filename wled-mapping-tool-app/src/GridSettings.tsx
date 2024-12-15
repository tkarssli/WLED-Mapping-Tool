import React, { useState } from 'react';
import './GridSettings.css';

interface GridSettingsProps {
  onGridSizeChange: (x: number, y: number) => void;
}

const GridSettings: React.FC<GridSettingsProps> = ({ onGridSizeChange }) => {
  const [x, setX] = useState(10);
  const [y, setY] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGridSizeChange(x, y);
  };

  return (
    <form onSubmit={handleSubmit} className='gridSettings'>
      <label>
        Grid X:
        <input type="number" value={x} onChange={(e) => setX(Number(e.target.value))} />
      </label>
      <label>
        Grid Y:
        <input type="number" value={y} onChange={(e) => setY(Number(e.target.value))} />
      </label>
      <button type="submit">Set Grid</button>
    </form>
  );
};

export default GridSettings;
