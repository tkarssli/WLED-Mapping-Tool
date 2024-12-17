import { useState } from "react";
import { Rnd } from "react-rnd";
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/16/solid";
import {
  LedPanelOrientation,
  LedStartDirectionH,
  LedStartDirectionV,
} from "./PanelManager";
import { ArrowsRightLeftIcon, Bars4Icon } from "@heroicons/react/24/outline";
import { getPanelStyleData } from "./helpers/getPanelStyleData";

const hueList = [
  "hue-rotate-15",
  "hue-rotate-30",
  "hue-rotate-60",
  "hue-rotate-90",
  "hue-rotate-180",
  "-hue-rotate-90",
  "-hue-rotate-60",
  "-hue-rotate-30",
  "-hue-rotate-15",
];

const scaleFactor = 50;
const hPixelFactor = 1;
const vPixelFactor = 1;

const Panel = ({
  id,
  handleDragStop,
  handleDragStart,
  handleDrag,
  isSelected,
  ledStartDirectionH,
  ledStartDirectionV,
  ledPanelOrientation,
  isSerpentine,
  gridFactorX,
  gridFactorY,
}: {
  id: string;
  updateBoxes: () => void;
  handleDragStop: () => void;
  handleDragStart: () => void;
  handleDrag: () => void;
  isSelected: boolean;
  ledStartDirectionH: LedStartDirectionH;
  ledStartDirectionV: LedStartDirectionV;
  ledPanelOrientation: LedPanelOrientation;
  isSerpentine: boolean;
  gridFactorX: number;
  gridFactorY: number;
}) => {
  const [size, updateSize] = useState({
    width: scaleFactor * 2,
    height: scaleFactor * 2,
  });
  const [position, updatePosition] = useState({ x: 0, y: 0 });

  const handlePositionUpdate = ({ x, y }: { x: number; y: number }) => {
    updatePosition({
      x: Math.round(x / scaleFactor) * scaleFactor,
      y: Math.round(y / scaleFactor) * scaleFactor,
    });
  };

  const panelStyleData = getPanelStyleData(
    ledStartDirectionH,
    ledStartDirectionV,
    ledPanelOrientation,
    isSerpentine,
    size.width / scaleFactor,
    size.height / scaleFactor,
  );

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
        width: scaleFactor * 2,
        height: scaleFactor * 2,
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`handle mn872 relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-md bg-primary-content ${hueList[(parseInt(id) - 1) % 8]} ${isSelected ? "border-4 border-secondary" : "border-2 border-primary"}`}
      >
        <div className="font-bold">{id}</div>

        <div className="flex flex-row">
          <ArrowsRightLeftIcon
            className={`size-6 ${isSerpentine ? "" : "opacity-15"}`}
          />
          <div className="">{` ${(size.width / scaleFactor) * gridFactorX}x${(size.height / scaleFactor) * gridFactorY}`}</div>
          <ArrowLeftEndOnRectangleIcon
            className={`absolute size-4 ${panelStyleData?.inStartArrow} text-blue-600`}
          />
          <ArrowLeftStartOnRectangleIcon
            className={`absolute size-4 ${panelStyleData?.outStartArrow} text-red-600`}
          />
          <Bars4Icon
            className={`size-6 ${ledPanelOrientation === LedPanelOrientation.Horizontal ? "" : "rotate-90"}`}
          />
        </div>
      </div>
    </Rnd>
  );
};

export default Panel;
