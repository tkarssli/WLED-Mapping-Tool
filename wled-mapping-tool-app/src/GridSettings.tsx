import React, { useEffect, useState } from 'react';
import './GridSettings.css';

interface GridSettingsProps {
  onGridSizeChange: (x: number, y: number) => void;
}

const GridSettings: React.FC<GridSettingsProps> = ({ onGridSizeChange }) => {
  const [x, setX] = useState(10);
  const [y, setY] = useState(10);

  const [debouncedX, setDebouncedX] = useState(x);
  const [debouncedY, setDebouncedY] = useState(y);

  // Debounce the input changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedX(x);
      setDebouncedY(y);
    }, 600);

    return () => {
      clearTimeout(handler); // Cleanup previous timeouts
    };
  }, [x, y]);

  // Trigger the grid size change when debounced values are updated
  useEffect(() => {
    onGridSizeChange(debouncedX, debouncedY);
  }, [debouncedX, debouncedY]);

  return (
    <form className='gridSettings'>
      <label>
        Grid X:
        <input type="number" value={x} onChange={(e) => setX(Math.max(1, Number(e.target.value)))} />
      </label>
      <label>
        Grid Y:
        <input type="number" value={y} onChange={(e) => setY(Math.max(1, Number(e.target.value)))} />
      </label>
    </form>
  );
};

export default GridSettings;
