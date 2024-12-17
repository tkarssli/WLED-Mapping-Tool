import { LedStartDirectionH, LedStartDirectionV, LedPanelOrientation } from "../PanelManager";

export const getPanelStyleData = (
    ledStartDirectionH: LedStartDirectionH,
    ledStartDirectionV: LedStartDirectionV,
    ledPanelOrientation: LedPanelOrientation,
    isSerpentine: boolean,
    width: number,
    height: number,
  ) => {
    let inStartArrow = "";
    let outStartArrow = "";
    if (
      ledStartDirectionV === LedStartDirectionV.Top &&
      ledStartDirectionH === LedStartDirectionH.Left
    ) {
      let rotation =
        ledPanelOrientation === LedPanelOrientation.Horizontal
          ? "-rotate-90"
          : "";
      inStartArrow = `top-0 left-0 ${rotation}`;
      outStartArrow = `bottom-0 right-0 ${rotation}`;
  
      if (isSerpentine) {
        if (
          ledPanelOrientation === LedPanelOrientation.Horizontal &&
          height % 2 === 0
        )
          outStartArrow = `bottom-0 left-0 rotate-90`;
        if (
          ledPanelOrientation === LedPanelOrientation.Vertical &&
          width % 2 === 0
        )
          outStartArrow = `top-0 right-0 -rotate-180`;
      }
    }
    if (
      ledStartDirectionV === LedStartDirectionV.Top &&
      ledStartDirectionH === LedStartDirectionH.Right
    ) {
      let rotation =
        ledPanelOrientation === LedPanelOrientation.Horizontal ? "rotate-90" : "";
      inStartArrow = `top-0 right-0 ${rotation}`;
      outStartArrow = `bottom-0 left-0 ${rotation}`;
  
      if (isSerpentine) {
        if (
          ledPanelOrientation === LedPanelOrientation.Horizontal &&
          height % 2 === 0
        )
          outStartArrow = `bottom-0 right-0 rotate-90`;
        if (
          ledPanelOrientation === LedPanelOrientation.Vertical &&
          width % 2 === 0
        )
          outStartArrow = `top-0 left-0 -rotate-180`;
      }
    }
    if (
      ledStartDirectionV === LedStartDirectionV.Bottom &&
      ledStartDirectionH === LedStartDirectionH.Left
    ) {
      let rotation =
        ledPanelOrientation === LedPanelOrientation.Horizontal
          ? "-rotate-90"
          : "rotate-180";
      inStartArrow = `bottom-0 left-0 ${rotation}`;
      outStartArrow = `top-0 right-0 ${rotation}`;
  
      if (isSerpentine) {
        if (
          ledPanelOrientation === LedPanelOrientation.Horizontal &&
          height % 2 === 0
        )
          outStartArrow = `top-0 left-0 rotate-90`;
        if (
          ledPanelOrientation === LedPanelOrientation.Vertical &&
          width % 2 === 0
        )
          outStartArrow = `bottom-0 right-0 `;
      }
    }
    if (
      ledStartDirectionV === LedStartDirectionV.Bottom &&
      ledStartDirectionH === LedStartDirectionH.Right
    ) {
      let rotation =
        ledPanelOrientation === LedPanelOrientation.Horizontal
          ? "rotate-90"
          : "rotate-180";
      inStartArrow = `bottom-0 right-0 ${rotation}`;
      outStartArrow = `top-0 left-0 ${rotation}`;
  
      if (isSerpentine) {
        if (
          ledPanelOrientation === LedPanelOrientation.Horizontal &&
          height % 2 === 0
        )
          outStartArrow = `top-0 right-0 -rotate-90`;
        if (
          ledPanelOrientation === LedPanelOrientation.Vertical &&
          width % 2 === 0
        )
          outStartArrow = `bottom-0 left-0 `;
      }
    }
    return {
      inStartArrow,
      outStartArrow,
    };
  };