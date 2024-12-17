import { useState } from "react";
import Panel from "./Panel";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
  ArrowTurnUpRightIcon,
  ArrowUturnUpIcon,
  ArrowUpIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/outline";

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

// This will handle our overlap calculations
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
    setTimeout(() => handleOverlap(node, { x, y }), 1);
  };

  const handleDragStop = (e, data, updatePosition) => {
    if (isCollision) {
      updatePosition(safePoint);
      setIsCollision(false);
      return;
    }
    updatePosition({ x: data.x, y: data.y });
  };
  console.log(boxes);

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
            className="btn btn-square disabled btn-outline rounded-md"
            onClick={() => toggleSerpentineState(selectedBox)}
            disabled={!selectedBox}
          >
            <ArrowsRightLeftIcon className="size-6" />
          </button>
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
            isSelected={selectedBox === id}
            ledStartDirectionH={boxes[id].ledStartDirectionH}
            ledStartDirectionV={boxes[id].ledStartDirectionV}
            ledPanelOrientation={boxes[id].ledPanelOrientation}
            isSerpentine={boxes[id].serpentineState}
          />
        ))}
      </div>
    </div>
  );
};

export default PanelManager;
