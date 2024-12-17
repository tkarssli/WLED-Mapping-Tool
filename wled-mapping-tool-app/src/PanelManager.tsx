import { useEffect, useState } from "react";
import Panel from "./Panel";
import {
  ArrowLeftIcon,
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
  ArrowUturnUpIcon,
  ArrowUpIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/outline";
import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";

export interface Box {
  id: string;
  x: number;
  y: number;
  ledStartDirectionH: LedStartDirectionH;
  ledStartDirectionV: LedStartDirectionV;
  ledPanelOrientation: LedPanelOrientation;
  serpentineState: boolean;
}

export enum LedStartDirectionV {
  Top = "top",
  Bottom = "bottom",
}

export enum LedStartDirectionH {
  Left = "left",
  Right = "right",
}

export enum LedPanelOrientation {
  Horizontal = "horizontal",
  Vertical = "vertical",
}

const defaultLedStartDirectionV = LedStartDirectionV.Top;
const defaultLedStartDirectionH = LedStartDirectionH.Left;
const defaultLedPanelOrientation = LedPanelOrientation.Horizontal;
const defaultSerpentineState = true;

function haveIntersection(other, main) {
  const isIntersection = !(
    main.x >= other.x + other.width ||
    main.x + main.width <= other.x ||
    main.y >= other.y + other.height ||
    main.y + main.height <= other.y
  );
  return isIntersection;
}

const PanelManager = () => {
  const [boxes, setBoxes] = useState({} as Record<string, Box>);
  const [isCollision, setIsCollision] = useState(false);
  const [safePoint, setSafePoint] = useState({ x: 0, y: 0 });
  const [selectedBox, setSelectedBox] = useState(null);
  const [gridFactorX, setGridFactorX] = useState(1);
  const [gridFactorY, setGridFactorY] = useState(1);
  const [boundingRect, setBoundingRect] = useState({});

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        removePanelHandler();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedBox]);

  const addPanelHandler = () => {
    // Get largest number from boxes
    const newId =
      Math.max(...Object.keys(boxes).map((id) => parseInt(id)), 0) + 1;
    setBoxes((prevBoxes) => ({
      ...prevBoxes,
      [newId]: {
        x: 0,
        y: 0,
        ledStartDirectionV: defaultLedStartDirectionV,
        ledStartDirectionH: defaultLedStartDirectionH,
        ledPanelOrientation: defaultLedPanelOrientation,
        serpentineState: defaultSerpentineState,
      },
    }));
  };

  const removePanelHandler = () => {
    if (selectedBox) {
      setBoxes((prevBoxes) => {
        const newBoxes = { ...prevBoxes };
        delete newBoxes[selectedBox];
        return newBoxes;
      });
      setSelectedBox(null);
    }
  };
  useEffect(() => {
    updateBoundingRect();
  }, [boxes]);

  const updateBoundingRect = () => {
    const allRects = Object.keys(boxes).map((id) => {
      const element = document.getElementById(id);
      return element?.getBoundingClientRect();
    });

    if (allRects.length === 0) return;

    const minX = Math.min(...allRects.map((rect) => rect.left));
    const minY = Math.min(...allRects.map((rect) => rect.top));
    const maxX = Math.max(...allRects.map((rect) => rect.right));
    const maxY = Math.max(...allRects.map((rect) => rect.bottom));

    console.log({ minX, minY, maxX, maxY });
    setBoundingRect({
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    });
  };

  const handleOverlap = (node, xy) => {
    const main = node?.querySelector(".mn872"); // current dragged or resized node
    const targetRect = main?.getBoundingClientRect();
    const hasOverlaps = [...document.querySelectorAll(".mn872")].some(
      (group) => {
        if (group === main) return; // continue with a loop if the current element is inside the group
        if (haveIntersection(group.getBoundingClientRect(), targetRect)) {
          return true; // current element is overlapping - stop loop
        }
        return; // continue with a loop - current element is NOT overlapping
      },
    );
    if (hasOverlaps) {
      setIsCollision(true);
    } else {
      setIsCollision(false);
      setSafePoint(xy); // remove this line if you want to snap to initial position
    }
  };

  const handleDragStart = (e, { x, y }, id, lastPos) => {
    setSafePoint(lastPos);
    setSelectedBox(id);
  };

  /* We use 1ms timeout as browser needs a tiny bit of time to have everything in sync.
On the other hand, we need to have correct values. Try it without timeout and you will see.
I call this function from Rnd component during "onDrag" event. It should work for other events too. */
  const handleDrag = (e, { node, x, y }) => {
    // getBoundingRect(node, { x, y });
    setTimeout(() => handleOverlap(node, { x, y }), 1);
  };

  const handleDragStop = (e, data, updatePosition) => {
    if (isCollision) {
      updatePosition(safePoint);
      setIsCollision(false);
      return;
    }
    updatePosition({ x: data.x, y: data.y });
    updateBoundingRect();
    // getBoundingRect(null, { x: data.x, y: data.y });
  };

  const handleResize = (e, direction, ref, delta, position) => {
    // getBoundingRect(ref, position);
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    // getBoundingRect(ref, position);
  };

  const toggleStartDirectionH = (id: number | null) => {
    if (!id) return;
    setBoxes((prevBoxes) => ({
      ...prevBoxes,
      [id]: {
        ...prevBoxes[id],
        ledStartDirectionH:
          prevBoxes[id].ledStartDirectionH === LedStartDirectionH.Left
            ? LedStartDirectionH.Right
            : LedStartDirectionH.Left,
      },
    }));
  };

  const toggleStartDirectionV = (id: number | null) => {
    if (!id) return;
    setBoxes((prevBoxes) => ({
      ...prevBoxes,
      [id]: {
        ...prevBoxes[id],
        ledStartDirectionV:
          prevBoxes[id].ledStartDirectionV === LedStartDirectionV.Top
            ? LedStartDirectionV.Bottom
            : LedStartDirectionV.Top,
      },
    }));
  };

  const togglePanelOrientation = (id: number | null) => {
    if (!id) return;
    setBoxes((prevBoxes) => ({
      ...prevBoxes,
      [id]: {
        ...prevBoxes[id],
        ledPanelOrientation:
          prevBoxes[id].ledPanelOrientation === LedPanelOrientation.Horizontal
            ? LedPanelOrientation.Vertical
            : LedPanelOrientation.Horizontal,
      },
    }));
  };
  const toggleSerpentineState = (id: number | null) => {
    if (!id) return;
    setBoxes((prevBoxes) => ({
      ...prevBoxes,
      [id]: {
        ...prevBoxes[id],
        serpentineState: !prevBoxes[id].serpentineState,
      },
    }));
  };

  return (
    <div className="flex h-full w-full flex-row">
      <div className="flex flex-col gap-4 p-8">
        <div className="tooltip tooltip-right" data-tip="Add a new panel">
          <button
            className="btn btn-square btn-outline rounded-md bg-green-200"
            onClick={addPanelHandler}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </div>
        <div className="tooltip tooltip-right" data-tip="Remove selected panel">
          <button
            className="btn btn-square disabled btn-outline rounded-md bg-red-200"
            onClick={removePanelHandler}
            disabled={!selectedBox}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </div>
        <div
          className="tooltip tooltip-right"
          data-tip="Toggle start direction [ left | right ]"
        >
          <button
            className="btn btn-square disabled btn-outline rounded-md"
            onClick={() => toggleStartDirectionH(selectedBox)}
            disabled={!selectedBox}
          >
            <ArrowLeftIcon className="size-6" />
          </button>
        </div>
        <div
          className="tooltip tooltip-right"
          data-tip="Toggle start direction [ top | bottom ]"
        >
          <button
            className="btn btn-square disabled btn-outline rounded-md"
            onClick={() => toggleStartDirectionV(selectedBox)}
            disabled={!selectedBox}
          >
            <ArrowUpIcon className="size-6" />
          </button>
        </div>
        <div
          className="tooltip tooltip-right"
          data-tip="Switch panel direction [ horizontal | vertical ]"
        >
          <button
            className="btn btn-square disabled btn-outline rounded-md"
            onClick={() => togglePanelOrientation(selectedBox)}
            disabled={!selectedBox}
          >
            {selectedBox ? (
              boxes[selectedBox].ledPanelOrientation ===
              LedPanelOrientation.Horizontal ? (
                <ArrowUturnUpIcon className="size-6" />
              ) : (
                <ArrowUturnRightIcon className="size-6" />
              )
            ) : (
              <ArrowsUpDownIcon className="size-6" />
            )}
          </button>
        </div>
        <div className="tooltip tooltip-right" data-tip="Toggle serpentine">
          <button
            className="btn btn-square btn-outline rounded-md"
            onClick={() => toggleSerpentineState(selectedBox)}
            disabled={!selectedBox}
          >
            <ArrowsRightLeftIcon className="size-6" />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-2">
          <div className="flex flex-row gap-2">
            <button
              className="btn btn-outline btn-xs rounded-md"
              onClick={() => setGridFactorX(gridFactorX + 1)}
            >
              <PlusIcon className="size-3" />
            </button>
            <button
              className="btn btn-outline btn-xs rounded-md"
              onClick={() =>
                setGridFactorX(gridFactorX - 1 ? gridFactorX - 1 : 1)
              }
            >
              <MinusIcon className="size-3" />
            </button>
          </div>
          <div className="whitespace-nowrap text-xs font-bold">
            X Factor: {`${gridFactorX}`}*
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-2">
          <div className="flex flex-row gap-2">
            <button
              className="btn btn-outline btn-xs rounded-md"
              onClick={() => setGridFactorY(gridFactorY + 1)}
            >
              <PlusIcon className="size-3" />
            </button>
            <button
              className="btn btn-outline btn-xs rounded-md"
              onClick={() =>
                setGridFactorY(gridFactorY - 1 ? gridFactorY - 1 : 1)
              }
            >
              <MinusIcon className="size-3" />
            </button>
          </div>
          <div className="whitespace-nowrap text-xs font-bold">
            Y Factor: {`${gridFactorY}`}*
          </div>
        </div>
      </div>
      <div
        onClick={() => setSelectedBox(null)}
        className="m-4 h-full w-full rounded-lg border"
      >
        {Object.keys(boxes).map((id, index) => (
          <Panel
            id={id}
            key={id}
            handleDragStart={handleDragStart}
            handleDrag={handleDrag}
            handleDragStop={handleDragStop}
            handleResize={handleResize}
            handleResizeStop={handleResizeStop}
            isSelected={selectedBox === id}
            ledStartDirectionH={boxes[id].ledStartDirectionH}
            ledStartDirectionV={boxes[id].ledStartDirectionV}
            ledPanelOrientation={boxes[id].ledPanelOrientation}
            isSerpentine={boxes[id].serpentineState}
            gridFactorX={gridFactorX}
            gridFactorY={gridFactorY}
          />
        ))}
      </div>
      <div
        className="pointer-events-none absolute border"
        style={{
          left: boundingRect.x,
          top: boundingRect.y,
          width: boundingRect.width,
          height: boundingRect.height,
        }}
      />
    </div>
  );
};

export default PanelManager;
