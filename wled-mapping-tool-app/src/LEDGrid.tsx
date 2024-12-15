import React, { useEffect, useState } from 'react';
import { InitialCellState } from './App';

interface LEDGridProps {
    gridX: number;
    gridY: number;
    onGridUpdate: (grid: InitialCellState[][]) => void;
}


const LEDGrid: React.FC<LEDGridProps> = ({ gridX, gridY, onGridUpdate }) => {
    const [grid, setGrid] = useState<InitialCellState[][]>(
        []
    );
    const [ledCount, setLedCount] = useState(0);


    useEffect(() => {
        setGrid(Array(gridY).fill(0).map(() => Array(gridX).fill(0).map(() => ({ enabled: false, index: -1 }))));
    }, [gridX, gridY])

    const toggleCell = (x: number, y: number) => {
        const newGrid = grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
                if (rowIndex === y && colIndex === x) {
                    if (cell.enabled) {
                        const removedIndex = cell.index;
                        cell.index = -1;
                        cell.enabled = false;
                        setLedCount(ledCount - 1);
                        // Decrement indices of cells greater than the removed cell
                        grid.forEach((row) =>
                            row.forEach((c) => {
                                if (c.index > removedIndex) {
                                    c.index -= 1;
                                }
                            })
                        );
                    } else {
                        cell.index = ledCount;
                        cell.enabled = true;
                        setLedCount(ledCount + 1);
                    }
                }
                return cell;
            })
        );
        setGrid(newGrid);
        onGridUpdate(newGrid);
    };

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridX}, 20px)`,
                gap: '2px',
            }}
        >
            {grid.map((row, y) =>
                row.map((cell, x) => (
                    <div
                        key={`${x}-${y}`}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            toggleCell(x, y)
                        }}
                        onMouseEnter={(e) => { e.preventDefault(); e.buttons === 1 && toggleCell(x, y) }}
                        style={{
                            width: 20,
                            height: 20,
                            backgroundColor: cell.enabled ? 'blue' : 'lightgray',
                            border: '1px solid black',
                            cursor: 'pointer',
                        }}
                    >{cell.index >= 0 ? cell.index : <></>} </div>
                ))
            )}
        </div>
    );
};

export default LEDGrid;
