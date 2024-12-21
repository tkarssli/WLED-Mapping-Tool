import { useEffect, useState } from "react";
import Panel from "./Panel";
import {
  ArrowLeftIcon,
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
  ArrowUturnUpIcon,
  ArrowUpIcon,
  ArrowUturnRightIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";
import { RndDragEvent, DraggableData, Position } from "react-rnd";
import { ResizeDirection } from "re-resizable";
import OutputPanel, { BoxData } from "./OutputPanel";

export interface Box {
  id: string;
  x: number;
  y: number;
  ledStartDirectionH: LedStartDirectionH;
  ledStartDirectionV: LedStartDirectionV;
  ledPanelOrientation: LedPanelOrientation;
  serpentineState: boolean;
  startWidth?: number;
  startHeight?: number;
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

const PanelManager = () => {
  const [boxes, setBoxes] = useState({} as Record<string, Box>);
  const [isCollision, setIsCollision] = useState(false);
  const [safePoint, setSafePoint] = useState({ x: 0, y: 0 });
  const [selectedBox, setSelectedBox] = useState<null | string>(null);
  const [gridFactorX, setGridFactorX] = useState(1);
  const [gridFactorY, setGridFactorY] = useState(1);
  const [boundingRect, setBoundingRect] = useState(
    {} as { x: number; y: number; width: number; height: number },
  );
  const [scaleFactor, _setScaleFactor] = useState(50);
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
        startWidth: 100,
        startHeight: 100,
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
    setTimeout(() => {
      updateBoundingRect();
    }, 100);
  }, [boxes]);

  const updateBoundingRect = () => {
    const allRects = Object.keys(boxes).map((id) => {
      const element = document.getElementById(id);
      return element?.getBoundingClientRect();
    });

    if (allRects.length === 0) return;

    const scrollY = window.scrollY;

    const minX = Math.min(
      ...allRects.map((rect) => (rect ? rect.left : Infinity)),
    );
    const minY =
      Math.min(...allRects.map((rect) => (rect ? rect.top : Infinity))) +
      scrollY;
    const maxX = Math.max(
      ...allRects.map((rect) => (rect ? rect.right : Infinity)),
    );
    const maxY =
      Math.max(...allRects.map((rect) => (rect ? rect.bottom : Infinity))) +
      scrollY;

    setBoundingRect({
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    });
  };

  const handleOverlap = (node: HTMLElement, xy: Position) => {
    const main = node?.querySelector(".mn872"); // current dragged or resized node
    const targetRect = main?.getBoundingClientRect();
    const hasOverlaps = [...document.querySelectorAll(".mn872")].some(
      (group) => {
        if (group === main) return; // continue with a loop if the current element is inside the group
        if (
          targetRect &&
          haveIntersection(group.getBoundingClientRect(), targetRect)
        ) {
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

  const handleDragStart = (
    _e: RndDragEvent,
    _data: DraggableData,
    id: string,
    lastPos: Position,
  ) => {
    setSafePoint(lastPos);
    setSelectedBox(id);
  };

  /* We use 1ms timeout as browser needs a tiny bit of time to have everything in sync.
On the other hand, we need to have correct values. Try it without timeout and you will see.
I call this function from Rnd component during "onDrag" event. It should work for other events too. */
  const handleDrag = (_e: RndDragEvent, { node, x, y }: DraggableData) => {
    setTimeout(() => handleOverlap(node, { x, y }), 1);
  };

  const handleDragStop = (
    _e: RndDragEvent,
    data: DraggableData,
    updatePosition: (data: Position) => void,
    id: string,
  ) => {
    if (isCollision) {
      setBoxes((prevBoxes) => ({
        ...prevBoxes,
        [id]: {
          ...prevBoxes[id],
          x: safePoint.x,
          y: safePoint.y,
        },
      }));
      updatePosition(safePoint);
      setIsCollision(false);
      return;
    }

    setBoxes((prevBoxes) => ({
      ...prevBoxes,
      [id]: {
        ...prevBoxes[id],
        x: data.x,
        y: data.y,
      },
    }));
    updatePosition({ x: data.x, y: data.y });
    updateBoundingRect();
  };

  const handleResize = (
    _e: MouseEvent | TouchEvent,
    _direction: ResizeDirection,
    _ref: HTMLElement,
    _delta: {
      height: number;
      width: number;
    },
    _position: Position,
  ) => {};

  const handleResizeStop = (
    _e: MouseEvent | TouchEvent,
    _direction: ResizeDirection,
    _ref: HTMLElement,
    _delta: {
      height: number;
      width: number;
    },
    _position: Position,
  ) => {
    updateBoundingRect();
  };

  const toggleStartDirectionH = (id: string | null) => {
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

  const toggleStartDirectionV = (id: string | null) => {
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

  const togglePanelOrientation = (id: string | null) => {
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
  const toggleSerpentineState = (id: string | null) => {
    if (!id) return;
    setBoxes((prevBoxes) => ({
      ...prevBoxes,
      [id]: {
        ...prevBoxes[id],
        serpentineState: !prevBoxes[id].serpentineState,
      },
    }));
  };

  const loadPanels = (panels: BoxData[]) => {
    // Find the largest grid factor that would make all panels fit
    let { gcdX, gcdY } = findLargestGridFactor(panels);
    if (gcdX >= 20 && gcdY >= 20 && gcdX % 4 === 0 && gcdY % 4 === 0) {
      gcdX = gcdX / 4;
      gcdY = gcdY / 4;
    } else if (gcdX >= 10 && gcdY >= 10 && gcdX % 2 === 0 && gcdY % 2 === 0) {
      gcdX = gcdX / 2;
      gcdY = gcdY / 2;
    }
    setGridFactorX(gcdX);
    setGridFactorY(gcdY);

    let newPanels = {} as Record<string, Box>;

    panels.forEach((panel, index) => {
      const newId = (index + 1).toString();
      newPanels[newId] = {
        id: newId,
        x: (panel.x * scaleFactor) / gcdX,
        y: (panel.y * scaleFactor) / gcdY,
        ledStartDirectionV: panel.ledStartDirectionV,
        ledStartDirectionH: panel.ledStartDirectionH,
        ledPanelOrientation: panel.ledPanelOrientation,
        serpentineState: panel.serpentineState,
        startWidth: (panel.width * scaleFactor) / gcdX,
        startHeight: (panel.height * scaleFactor) / gcdY,
      };
    });

    setBoxes(newPanels);
  };

  const savePanels = () => {
    const allRects: Record<string, DOMRect | undefined> = {};
    Object.keys(boxes).map((id) => {
      const element = document.getElementById(id);
      allRects[id] = element?.getBoundingClientRect();
    });
    const panels = Object.keys(boxes).map((id) => {
      const panel = boxes[id];
      const rect = allRects[id];
      if (rect?.width && rect?.height) {
        return {
          x: (panel.x / scaleFactor) * gridFactorX,
          y: (panel.y / scaleFactor) * gridFactorY,
          width: (rect?.width / scaleFactor) * gridFactorX,
          height: (rect?.height / scaleFactor) * gridFactorY,
          ledStartDirectionV: panel.ledStartDirectionV,
          ledStartDirectionH: panel.ledStartDirectionH,
          ledPanelOrientation: panel.ledPanelOrientation,
          serpentineState: panel.serpentineState,
        } as BoxData;
      }
    });

    return panels;
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
        <div className="tooltip tooltip-right" data-tip="Save panels to config">
          <button
            className="btn btn-square btn-outline rounded-md bg-orange-200"
            onClick={() =>
              (
                document?.getElementById("my_modal_2") as HTMLDialogElement
              )?.showModal()
            }
          >
            <ArrowDownTrayIcon className="size-6" />
          </button>
        </div>
      </div>
      <div
        onClick={() => setSelectedBox(null)}
        className="m-4 h-full w-full rounded-lg border"
      >
        {Object.keys(boxes).map((id, _index) => (
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
            scaleFactor={scaleFactor}
            startWidth={boxes[id].startWidth}
            startHeight={boxes[id].startHeight}
            startX={boxes[id].x}
            startY={boxes[id].y}
          />
        ))}
      </div>
      <div
        className={`pointer-events-none absolute rounded border-2 border-primary ${Object.values(boxes).length < 2 ? "hidden" : ""}`}
        style={{
          left: boundingRect.x,
          top: boundingRect.y,
          width: boundingRect.width,
          height: boundingRect.height,
        }}
      />
      <div
        onClick={updateBoundingRect}
        className="bold absolute left-12 top-8 rounded-lg border bg-primary p-4 font-bold text-primary-content"
      >{`True LED count: ${getTotalLeds(boundingRect, scaleFactor, gridFactorX, gridFactorY)}`}</div>
      <OutputPanel loadPanels={loadPanels} savePanels={savePanels} />
    </div>
  );
};
export default PanelManager;

const getTotalLeds = (
  boundingRect: any,
  scaleFactor: number,
  gridFactorX: number,
  gridFactorY: number,
) => {
  const xWidth = ((boundingRect.width ?? 0) / scaleFactor) * gridFactorX;
  const yWidth = ((boundingRect.height ?? 0) / scaleFactor) * gridFactorY;
  return xWidth * yWidth;
};

function haveIntersection(other: DOMRect, main: DOMRect) {
  const isIntersection = !(
    main.x >= other.x + other.width ||
    main.x + main.width <= other.x ||
    main.y >= other.y + other.height ||
    main.y + main.height <= other.y
  );
  return isIntersection;
}

const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

const findLargestGridFactor = (panels: BoxData[]) => {
  let gcdX = panels[0].x;
  let gcdY = panels[0].y;

  panels.forEach((panel) => {
    gcdX = gcd(gcdX, panel.x);
    gcdY = gcd(gcdY, panel.y);
  });

  return { gcdX, gcdY };
};
