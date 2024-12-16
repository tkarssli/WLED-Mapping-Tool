import { useState } from "react";
import Panel from "./Panel";
import { Rnd } from "react-rnd";
const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0",
};

export interface Box {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

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
  const [boxes, setBoxes] = useState([] as string[]);
  const [isCollision, setIsCollision] = useState(false);
  const [safePoint, setSafePoint] = useState({ x: 0, y: 0 });
  const [selectedBox, setSelectedBox] = useState(null);

  const addPanelHandler = () => {
    const newBox = boxes.reduce((acc, box) => (acc > box ? acc : box), 0) + 1;
    const newBoxes = [...boxes, newBox];
    setBoxes(newBoxes);
  };

  const handleOverlap = (node, xy) => {
    const main = node?.querySelector(".mn872"); // current dragged or resized node
    const targetRect = main?.getBoundingClientRect();
    [...document.querySelectorAll(".mn872")].some((group) => {
      if (group === main) return; // continue with a loop if the current element is inside the group
      if (haveIntersection(group.getBoundingClientRect(), targetRect)) {
        console.log("isCollision");
        setIsCollision(true);
        return true; // current element is overlapping - stop loop
      }
      console.log(xy);
      setIsCollision(false);
      setSafePoint(xy); // remove this line if you want to snap to initial position
      return; // continue with a loop - current element is NOT overlapping
    });
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
      console.log("isCollision");
      updatePosition(safePoint);
      setIsCollision(false);
      return;
    }
    console.log("isNotCollision");
    console.log({ x: data.x, y: data.y });
    updatePosition({ x: data.x, y: data.y });
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <button className="btn btn-primary w-60" onClick={addPanelHandler}>
        Add Panel
      </button>
      <div className="h-3/4 w-8/12 rounded-lg border">
        {Object.values(boxes).map((box, index) => (
          <Panel
            id={box}
            handleDragStart={handleDragStart}
            handleDrag={handleDrag}
            handleDragStop={handleDragStop}
            isSelected={selectedBox === box}
          />
        ))}
      </div>
    </div>
  );
};

export default PanelManager;
