import { useEffect, useState } from "react";
import "./App.css";
import GridSettings from "./GridSettings";
import LEDGrid from "./LEDGrid";
import OutputPanel from "./OutputPanel";
import { themeChange } from "theme-change";
import PanelManager from "./PanelManager";

export interface InitialCellState {
  enabled: boolean;
  index: number;
  skipped: boolean;
}

const App: React.FC = () => {
  const [gridSize, setGridSize] = useState({ x: 5, y: 5 });
  const [gridState, setGridState] = useState<InitialCellState[][]>([]);

  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  const handleGridSizeChange = (x: number, y: number) => {
    setGridSize({ x, y });
    setGridState([]);
  };

  return (
    <div className="app relative flex h-screen flex-col items-center">
      <div>
        <span className="absolute mx-auto box-content flex w-fit select-none border bg-gradient-to-r from-red-500 via-green-600 to-blue-600 bg-clip-text text-center text-6xl font-extrabold leading-loose text-transparent blur-xl">
          WLED Mapping Tool
        </span>
        <h1 className="relative top-0 flex h-auto w-fit select-auto items-center justify-center bg-gradient-to-r from-red-500 via-green-600 to-blue-600 bg-clip-text text-center text-6xl font-extrabold leading-loose text-transparent">
          WLED Mapping Tool
        </h1>
      </div>
      <PanelManager />

      {/* <GridSettings onGridSizeChange={handleGridSizeChange} />
      <LEDGrid
        gridX={gridSize.x}
        gridY={gridSize.y}
        onGridUpdate={setGridState}
      />
      <OutputPanel grid={gridState} /> */}

      <div className="">
        <label className="absolute right-2 top-2 h-6 w-12">
          {/* Hidden Checkbox */}
          <input
            type="checkbox"
            className="h-0 w-0 opacity-0"
            data-toggle-theme="light,dark"
          />
          {/* Custom Toggle with SVGs */}
          <span className="btn btn-square btn-outline btn-sm">
            {/* SVG for Dark Mode */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
          </span>
        </label>
      </div>
    </div>
  );
};

export default App;
