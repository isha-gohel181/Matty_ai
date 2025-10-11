import React, { useState, useRef, useEffect } from "react";
import {
  Excalidraw,
  MainMenu,
  WelcomeScreen,
  exportToBlob,
} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createDesign,
  getDesignById,
  updateDesign,
  clearCurrentDesign,
} from "@/redux/slice/design/design.slice";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentDesign, loading, error } = useSelector((state) => state.design);
  const excalidrawRef = useRef(null);
  const [title, setTitle] = useState("Untitled Design");
  const [elements, setElements] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(getDesignById(id));
    }
    return () => {
      dispatch(clearCurrentDesign());
    };
  }, [id, dispatch]);

  const [key, setKey] = useState(0);

  useEffect(() => {
    if (currentDesign) {
      const loadedElements = JSON.parse(currentDesign.excalidrawJSON);
      setElements(loadedElements);
      setTitle(currentDesign.title);
      setKey(prev => prev + 1); // Force remount
    }
  }, [currentDesign]);

  const handleSave = async () => {
    console.log("handleSave called");
    try {
      console.log("elements:", elements);
      if (!elements || elements.length === 0) {
        console.log("No elements to save");
        return;
      }

      const blob = await exportToBlob({
        elements,
        mimeType: "image/png",
        appState: {
          exportBackground: true,
          exportWithDarkMode: false,
        },
      });

      const formData = new FormData();
      formData.append("title", title);
      formData.append("excalidrawJSON", JSON.stringify(elements));
      formData.append("thumbnail", blob, `${title.replace(/\s+/g, "-")}.png`);

      console.log("Dispatching save action");
      if (id) {
        dispatch(updateDesign({ id, designData: formData }));
      } else {
        dispatch(createDesign(formData)).then((action) => {
          if (action.type === "design/create/fulfilled") {
            navigate(`/dashboard/editor/${action.payload.design._id}`);
          }
        });
      }
    } catch (err) {
      console.error("Error saving design:", err);
    }
  };

  const initialData = {
    elements: elements,
    appState: {
      gridSize: null,
    },
  };

  return (
    <div style={{ height: "100vh ", display: "flex", flexDirection: "column" }}>
      <div className="h-16 p-4 bg-background border-b flex items-center gap-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-1/3"
        />
        {error && <p className="text-red-500 text-sm">{error.message || JSON.stringify(error)}</p>}
        <div className="flex-grow" />
        <Button size="sm" onClick={handleSave} disabled={loading}>
          <Save className="mr-2 h-4 w-4" /> {loading ? "Saving..." : "Save"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setElements([]);
            setTitle("Untitled Design");
            setKey(prev => prev + 1);
            navigate("/dashboard/editor");
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" /> New
        </Button>
      </div>
      <div style={{ flex: 1 }}>
        <Excalidraw
          key={key}
          ref={excalidrawRef}
          initialData={initialData}
          theme="dark"
          onChange={(excalidrawElements) => setElements(excalidrawElements)}
        >
          <MainMenu>
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.DefaultItems.SaveAsImage />
            <MainMenu.DefaultItems.Export />
            <MainMenu.DefaultItems.Help />
            <MainMenu.DefaultItems.ToggleTheme />
          </MainMenu>
          <WelcomeScreen>
            <WelcomeScreen.Hints.MenuHint />
            <WelcomeScreen.Hints.ToolbarHint />
            <WelcomeScreen.Hints.HelpHint />
          </WelcomeScreen>
        </Excalidraw>
      </div>
    </div>
  );
};

export default Editor;