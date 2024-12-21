import React, { useEffect, useRef } from "react";
import "./OutputPanel.css";
import {
  LedPanelOrientation,
  LedStartDirectionH,
  LedStartDirectionV,
} from "./PanelManager";
import { formatUrl, urlRegex } from "./helpers/stringUtils";

interface OutputPanelProps {
  loadPanels: (json: BoxData[]) => void;
  savePanels: () => (BoxData | undefined)[];
}

export interface BoxData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  ledStartDirectionH: LedStartDirectionH;
  ledStartDirectionV: LedStartDirectionV;
  ledPanelOrientation: LedPanelOrientation;
  serpentineState: boolean;
}

const OutputPanel: React.FC<OutputPanelProps> = ({
  loadPanels,
  savePanels,
}) => {
  const [json, setJson] = React.useState({} as any);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toggleState, setToggleState] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [urlError, setUrlError] = React.useState("");
  const [sendSuccess, setSendSuccess] = React.useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.addEventListener("", handleClose);
    }
    return () => {
      if (dialog) {
        dialog.removeEventListener("close", handleClose);
      }
    };
  }, []);

  const handleClose = () => {
    // Do something
  };

  const generateJSON = (json: object) => {
    return JSON.stringify(json, null, 0);
  };

  const handleLoadPanels = () => {
    if (!toggleState) {
      fetchConfig(url, (json: string) => {
        const panels = parsePanelsFromJson(json);
        loadPanels(panels);
      });
    } else {
      const panels = parsePanelsFromJson(json);
      loadPanels(panels);
    }
  };

  const handleLoadFile = (json: any) => {
    setJson(json);
  };

  const fetchConfig = (url: string, cb: (json: string) => void) => {
    const formattedUrl = formatUrl(url);

    fetch(`${formattedUrl}/json/cfg`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("[fetchConfig] Network response was not ok");
        }
        return response.json();
      })
      .then((json) => {
        setJson(json);
        cb(json);
      })
      .catch((error) => {
        console.error("[fetchConfig] Error fetching JSON:", error);
      });
  };

  const sendConfig = () => {
    const formattedUrl = formatUrl(url);
    const panelExportJson = exportPanels();

    fetch(`${formattedUrl}/json/cfg`, {
      method: "PUT",
      body: JSON.stringify(panelExportJson),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("[sendConfig] Network response was not ok");
        }
        return;
      })
      .then(() => {
        setSendSuccess(true);
        setTimeout(() => setSendSuccess(false), 3000);
      })
      .catch((error) => {
        console.error("[sendConfig] Error sending JSON:", error);
      });
  };

  const parsePanelsFromJson = (json: any) => {
    const wledPanels = json?.hw?.led?.matrix?.panels;
    if (wledPanels && wledPanels.length > 0) {
      const panels = wledPanels.map((panel: any) => {
        return {
          x: panel.x,
          y: panel.y,
          width: panel.w,
          height: panel.h,
          ledStartDirectionV: panel.b
            ? LedStartDirectionV.Bottom
            : LedStartDirectionV.Top,
          ledStartDirectionH: panel.r
            ? LedStartDirectionH.Right
            : LedStartDirectionH.Left,
          ledPanelOrientation: panel.v
            ? LedPanelOrientation.Vertical
            : LedPanelOrientation.Horizontal,
          serpentineState: panel.s,
        } as BoxData;
      });
      return panels;
    }
  };

  const exportPanels = () => {
    const panels = savePanels();
    json.hw.led.matrix.panels = panels.map((panel) => {
      if (!panel) return;
      return {
        x: panel.x,
        y: panel.y,
        w: panel.width,
        h: panel.height,
        b: panel.ledStartDirectionV === LedStartDirectionV.Bottom,
        r: panel.ledStartDirectionH === LedStartDirectionH.Right,
        v: panel.ledPanelOrientation === LedPanelOrientation.Vertical,
        s: panel.serpentineState,
      };
    });
    json.hw.led.matrix.mpc = panels.length;
    setJson(json);
    return json;
  };
  const downloadJSON = () => {
    const panelExportJson = exportPanels();
    const blob = new Blob([generateJSON(panelExportJson)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cfg.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          handleLoadFile(json);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;

    setSendSuccess(false);

    try {
      // use regex
      const match = url.match(urlRegex);
      if (match === null) {
        throw new Error("Invalid URL");
      }

      setUrlError("");
      setUrl(url);
    } catch {
      setUrlError("Invalid URL");
      setUrl("");
    }
  };

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToggleState(event.target.checked);
  };

  return (
    <div className="outputPanel">
      <dialog id="my_modal_2" className="modal">
        <div
          className={`modal-box ${sendSuccess ? "border-2 border-green-600" : ""} `}
        >
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-row items-center gap-4 font-bold">
              URL
              <input
                type="checkbox"
                className="toggle border bg-primary hover:bg-blue-700"
                defaultChecked={toggleState}
                onChange={(e) => {
                  handleToggleChange(e);
                }}
              />
              Config
            </div>
            <div className="flex flex-row items-center gap-4">
              {toggleState ? (
                <input
                  type="file"
                  accept=".json"
                  className={`file-input file-input-bordered file-input-primary file-input-sm w-full max-w-xs`}
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              ) : (
                <input
                  type="text"
                  placeholder="URL Address"
                  className={`input input-bordered w-full max-w-xs ${urlError === "" ? "" : "input-error"}`}
                  onChange={handleUrlChange}
                  defaultValue={url}
                />
              )}
              <button
                className="primary btn btn-accent btn-sm"
                onClick={handleLoadPanels}
                disabled={
                  (Object.keys(json).length === 0 && url === "") ||
                  urlError !== ""
                }
              >
                Load Panels
              </button>
            </div>
            <div className="flex flex-row items-center gap-4">
              <button
                className="btn btn-primary btn-accent"
                onClick={downloadJSON}
                disabled={Object.keys(json).length === 0}
              >
                Download
              </button>
              <button
                className="btn btn-primary btn-accent"
                onClick={sendConfig}
                disabled={
                  url === "" ||
                  urlError !== "" ||
                  Object.keys(json).length === 0
                }
              >
                Send
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleClose}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default OutputPanel;
