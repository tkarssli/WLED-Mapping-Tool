import React, { useState } from "react";
import { Rnd } from "react-rnd";

const scaleFactor = 50;

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
      onResizeStop={(e, direction, ref, delta, position) => {
        updateSize({
          width: Number(ref.style.width),
          height: Number(ref.style.height),
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
        className={`handle mn872 h-full w-full rounded-md bg-primary ${isSelected ? "border-2 border-secondary" : ""}`}
      >
        {id}
      </div>
    </Rnd>
  );
};

export default Panel;
