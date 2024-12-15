import React, { useEffect, useState } from 'react';

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
    <form className='flex flex-row gap-8 py-8 '>
      <label className='text-primary-content input input-bordered flex items-center gap-2'>
        Grid X:{' '}
        <input className="text-red-600 input input-sm input-bordered w-full max-w-16" type="number" value={x} onChange={(e) => setX(Math.max(1, Number(e.target.value)))} />
      </label>
      <label className='text-primary-content input input-bordered flex items-center gap-2'>
        Grid Y:{' '}
        <input className="text-red-600 input input-sm input-bordered w-full  max-w-16" value={y} onChange={(e) => setY(Math.max(1, Number(e.target.value)))} />
      </label>
    </form>
  );
};

export default GridSettings;
