import React, { useState } from "react";
import { Rnd } from "react-rnd";
import {
  ArrowLongDownIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/16/solid";

const scaleFactor = 50;
const hPixelFactor = 1;
const vPixelFactor = 1;
const ledPanelDirection = "horizontal";
// const ledPanelDirection = "vertical";
const ledStartDirection = "left";

const getPanelDirection = (
  ledPanelDirection: string,
  ledStartDirection?: string,
) => {
  if (ledStartDirection === "left") {
  }
  if (ledPanelDirection === "horizontal") {
    return {
      rotation: 0,
      direction: "left",
    };
  }
  if (ledPanelDirection === "vertical") {
    return {
      rotation: 90,
      direction: "right",
    };
  }
};

const Panel = ({
  id,
  handleDragStop,
  handleDragStart,
  handleDrag,
  isSelected,
}: {
  id: string;
  updateBoxes: () => void;
  handleDragStop: () => void;
  handleDragStart: () => void;
  handleDrag: () => void;
  isSelected: boolean;
}) => {
  const [size, updateSize] = useState({
    width: scaleFactor * 1,
    height: scaleFactor * 1,
  });
  const [position, updatePosition] = useState({ x: 0, y: 0 });

  const handlePositionUpdate = ({ x, y }: { x: number; y: number }) => {
    updatePosition({
      x: Math.round(x / scaleFactor) * scaleFactor,
      y: Math.round(y / scaleFactor) * scaleFactor,
    });
  };

  return (
    <Rnd
      className={``}
      dragGrid={[scaleFactor, scaleFactor]}
      resizeGrid={[scaleFactor, scaleFactor]}
      minHeight={scaleFactor}
      minWidth={scaleFactor}
      position={position}
      size={size}
      bounds="parent"
      onDragStart={(e, data) => {
        handleDragStart(e, data, id, position);
      }}
      onDrag={handleDrag}
      onDragStop={(e, data) => {
        handleDragStop(e, data, handlePositionUpdate);
      }}
      onResize={(e, direction, ref, delta, position) => {
        updateSize({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
        handlePositionUpdate(position);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateSize({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
        handlePositionUpdate(position);
      }}
      default={{
        x: 0,
        y: 0,
        width: scaleFactor,
        height: scaleFactor,
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`handle mn872 relative flex h-full w-full items-center justify-center gap-1 rounded-md bg-orange-${(((parseInt(id) - 1) % 8) + 1) * 100} ${isSelected ? "border-4 border-secondary" : "border-2 border-primary"}`}
      >
        <div className="font-bold text-secondary-content">{id}</div>
        <div className="text-secondary-content">{` ${(size.width / scaleFactor) * hPixelFactor}x${(size.height / scaleFactor) * vPixelFactor}`}</div>
        <ArrowLongDownIcon
          className={`absolute size-4 rotate-${getPanelDirection(ledPanelDirection)?.rotation} ${getPanelDirection(ledPanelDirection)?.direction}-0 top-0 text-blue-600`}
        />
        <ArrowLongDownIcon
          className={`absolute size-4 rotate-${getPanelDirection(ledPanelDirection)?.rotation} bottom-0 right-0 text-orange-600`}
        />
        <ChevronDoubleRightIcon
          className={`absolute left-0 size-4 text-green-600`}
        />
        <ChevronDoubleRightIcon
          className={`absolute right-0 size-4 text-red-600`}
        />
      </div>
    </Rnd>
  );
};

export const test = {
  // Programatically used tailwind classes that would get pruned on build
  safelist: [
    "bg-orange-100",
    "bg-orange-200",
    "bg-orange-300",
    "bg-orange-400",
    "bg-orange-500",
    "bg-orange-600",
    "bg-orange-700",
    "bg-orange-800",
  ],
  //
};

export default Panel;
