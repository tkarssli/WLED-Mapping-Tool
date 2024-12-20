import React, { useEffect, useRef, useState } from "react";
import { InitialCellState } from "./App";

interface LEDGridProps {
  gridX: number;
  gridY: number;
  onGridUpdate: (grid: InitialCellState[][]) => void;
}

const LEDGrid: React.FC<LEDGridProps> = ({ gridX, gridY, onGridUpdate }) => {
  const [grid, setGrid] = useState<InitialCellState[][]>([]);
  const [_ledCount, setLedCount] = useState(0);

  const mouseState = useRef({ action: "" });

  useEffect(() => {
    setGrid(
      Array(gridY)
        .fill(0)
        .map(() =>
          Array(gridX)
            .fill(0)
            .map(() => ({ enabled: false, index: -1, skipped: false })),
        ),
    );
    setLedCount(0);
  }, [gridX, gridY]);

  const toggleCell = (
    x: number,
    y: number,
    mouseAction: string,
    isShiftKeyPressed: boolean,
  ) => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (rowIndex === y && colIndex === x) {
          if (cell.enabled) {
            if (mouseAction === "mouseDown") {
              mouseState.current = { action: "remove" };
            }
            if (
              mouseAction === "mouseEnter" &&
              mouseState.current.action !== "remove"
            )
              return cell;

            const removedIndex = cell.index;
            cell.index = -1;
            cell.enabled = false;
            cell.skipped = false;
            setLedCount((prevLedCount) => prevLedCount - 1);
            // Decrement indices of cells greater than the removed cell
            grid.forEach((row) =>
              row.forEach((c) => {
                if (c.index > removedIndex) {
                  c.index -= 1;
                }
              }),
            );
          } else {
            if (mouseAction === "mouseDown") {
              mouseState.current = { action: "add" };
            }
            if (
              mouseAction === "mouseEnter" &&
              mouseState.current.action !== "add"
            )
              return cell;
            setLedCount((prevLedCount) => {
              cell.index = prevLedCount;
              cell.enabled = true;
              if (isShiftKeyPressed) cell.skipped = true;
              return prevLedCount + 1;
            });
          }
        }
        return cell;
      }),
    );
    setGrid(newGrid);
    onGridUpdate(newGrid);
  };

  const smallGrid = gridX * gridY > 150;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridX}, ${smallGrid ? 20 : 40}px)`,
        gap: "2px",
      }}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleCell(x, y, "mouseDown", e.shiftKey);
            }}
            onMouseEnter={(e) => {
              e.preventDefault();
              e.buttons === 1 && toggleCell(x, y, "mouseEnter", e.shiftKey);
            }}
            style={{
              cursor: "pointer",
            }}
            className={`text-s relative flex h-${smallGrid ? 5 : 10} w-${smallGrid ? 5 : 10} select-none items-center justify-center rounded text-primary-content ${cell.enabled ? (cell.skipped ? "bg-yellow-400" : "bg-emerald-400") : "bg-gray-400"}`}
          >
            {cell.index >= 0 ? cell.index : <></>}{" "}
            {y === 0 ? <div className="absolute -top-7">{x}</div> : <></>}
            {x === 0 ? <div className="absolute -left-5">{y}</div> : <></>}
          </div>
        )),
      )}
    </div>
  );
};

export default LEDGrid;
