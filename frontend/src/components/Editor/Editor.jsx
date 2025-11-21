import React, { useState, useRef, useEffect } from "react";
import {
  Excalidraw,
  MainMenu,
  WelcomeScreen,
  exportToBlob,
  exportToSvg,
} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Save,
  Trash2,
  Download,
  FileText,
  Sparkles,
  Palette,
  Bot,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createDesign,
  getDesignById,
  updateDesign,
  clearCurrentDesign,
} from "@/redux/slice/design/design.slice";
import { getTemplateById, clearCurrentTemplate } from "@/redux/slice/template/template.slice";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToPdf } from "@/lib/export";
import { useTheme } from "@/context/ThemeContext.jsx";
import AiSuggestions from "./AiSuggestions";
import ColorPalette from "./ColorPalette";

const Editor = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentDesign, loading, error } = useSelector(
    (state) => state.design
  );
  const { currentTemplate } = useSelector((state) => state.template);

  const { theme } = useTheme();

  const excalidrawRef = useRef(null);

  const [title, setTitle] = useState("Untitled Design");
  const [elements, setElements] = useState([]);
  const [key, setKey] = useState(0);
  const [autoSave, setAutoSave] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);

  useEffect(() => {
    if (id) dispatch(getDesignById(id));
    return () => dispatch(clearCurrentDesign());
  }, [id, dispatch]);

  useEffect(() => {
    if (currentDesign) {
      const loadedElements = JSON.parse(currentDesign.excalidrawJSON);
      setElements(loadedElements);
      setTitle(currentDesign.title);
      setKey((prev) => prev + 1);
    }
  }, [currentDesign]);

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      dispatch(getTemplateById(templateId));
    }
    return () => dispatch(clearCurrentTemplate());
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (currentTemplate) {
      try {
        let loadedData = currentTemplate.excalidrawJSON;
        
        // Handle string JSON that needs parsing
        if (typeof loadedData === 'string') {
          loadedData = JSON.parse(loadedData);
        }
        
        // If it's still a string after parsing (double-encoded), parse again
        if (typeof loadedData === 'string') {
          loadedData = JSON.parse(loadedData);
        }
        
        // Extract elements from the Excalidraw state object
        let loadedElements = loadedData;
        if (loadedData && typeof loadedData === 'object' && !Array.isArray(loadedData)) {
          // If it's an object with an 'elements' property, extract it
          if (loadedData.elements && Array.isArray(loadedData.elements)) {
            loadedElements = loadedData.elements;
          } else {
            console.warn('Could not find elements array in template data:', loadedData);
            loadedElements = [];
          }
        }
        
        // Ensure it's an array
        if (!Array.isArray(loadedElements)) {
          console.warn('Loaded elements is not an array:', loadedElements);
          loadedElements = [];
        }
        
        setElements(loadedElements);
        setTitle(currentTemplate.title);
        setKey((prev) => prev + 1);
      } catch (error) {
        console.error('Error parsing template JSON:', error);
        setElements([]);
        setTitle(currentTemplate.title);
      }
    }
  }, [currentTemplate]);

  useEffect(() => {
    let interval;
    if (autoSave) {
      interval = setInterval(() => {
        handleSave();
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoSave, elements, title]);

  // 🟩 Save / Update Design
  const handleSave = async () => {
    try {
      if (!elements || elements.length === 0) return;

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

      if (id) {
        dispatch(updateDesign({ id, designData: formData })).then((action) => {
          if (action.type === "design/update/fulfilled") {
            navigate("/dashboard/files");
          }
        });
      } else {
        dispatch(createDesign(formData)).then((action) => {
          if (action.type === "design/create/fulfilled") {
            navigate("/dashboard/files");
          }
        });
      }
    } catch (err) {
      console.error("Error saving design:", err);
    }
  };

  // 🟦 Export PNG / PDF
  const handleExport = async (format) => {
    if (!elements || elements.length === 0) return;

    const appState = {
      exportBackground: true,
      exportWithDarkMode: false,
    };

    if (format === "png") {
      const blob = await exportToBlob({ elements, appState, mimeType: "image/png" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${title}.png`;
      link.click();
    } else if (format === "pdf") {
      const svg = await exportToSvg({ elements, appState });
      exportToPdf(svg, `${title}.pdf`);
    }
  };

  const handleApplyTemplate = (templateData) => {
    try {
      let loadedData = templateData.excalidrawJSON;
      
      // Handle string JSON that needs parsing
      if (typeof loadedData === 'string') {
        loadedData = JSON.parse(loadedData);
      }
      
      // Extract elements from the Excalidraw state object
      let loadedElements = loadedData;
      if (loadedData && typeof loadedData === 'object' && !Array.isArray(loadedData)) {
        // If it's an object with an 'elements' property, extract it
        if (loadedData.elements && Array.isArray(loadedData.elements)) {
          loadedElements = loadedData.elements;
        } else {
          console.warn('Could not find elements array in AI template data:', loadedData);
          loadedElements = [];
        }
      }
      
      // Ensure it's an array
      if (!Array.isArray(loadedElements)) {
        console.warn('Loaded elements is not an array:', loadedElements);
        loadedElements = [];
      }
      
      setElements(loadedElements);
      setTitle(templateData.title || "AI Generated Design");
      setKey((prev) => prev + 1);
      
      // Close AI suggestions panel
      setShowAiSuggestions(false);
    } catch (error) {
      console.error('Error applying AI template:', error);
    }
  };

  const initialData = {
    elements,
    appState: { gridSize: null },
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="h-16 p-2 md:p-4 bg-background border-b flex flex-wrap items-center gap-2 md:gap-4">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full md:w-1/3" />

        {error && <p className="text-red-500 text-sm">{error.message || JSON.stringify(error)}</p>}

        <div className="grow" />

        {/* <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="autoSave"
            checked={autoSave}
            onChange={(e) => setAutoSave(e.target.checked)}
          />
          <label htmlFor="autoSave" className="text-sm">Auto-Save</label>
        </div> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="sm" 
              variant={(showAiSuggestions || showColorPalette) ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <Bot className="h-4 w-4" />
              AI Tools
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              onClick={() => {
                if (!showAiSuggestions) {
                  setShowAiSuggestions(true);
                  setShowColorPalette(false);
                } else {
                  setShowAiSuggestions(false);
                }
              }}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              AI Suggestions
              {showAiSuggestions && <span className="ml-auto text-xs text-muted-foreground">Active</span>}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                if (!showColorPalette) {
                  setShowColorPalette(true);
                  setShowAiSuggestions(false);
                } else {
                  setShowColorPalette(false);
                }
              }}
              className="flex items-center gap-2"
            >
              <Palette className="h-4 w-4" />
              Color Palette
              {showColorPalette && <span className="ml-auto text-xs text-muted-foreground">Active</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" onClick={() => handleExport("png")}>
          <Download className="mr-2 h-4 w-4" /> PNG
        </Button>

        <Button size="sm" onClick={() => handleExport("pdf")}>
          <FileText className="mr-2 h-4 w-4" /> PDF
        </Button>

        <Button size="sm" onClick={handleSave} disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Saving..." : "Save"}
        </Button>

        <Button size="sm" variant="outline" onClick={() => {
          setElements([]);
          setTitle("Untitled Design");
          setKey((prev) => prev + 1);
          navigate("/dashboard/editor");
        }}>
          <Trash2 className="mr-2 h-4 w-4" /> New
        </Button>
      </div>

      <div style={{ flex: 1 }}>
        <Excalidraw
          key={key}
          ref={excalidrawRef}
          initialData={initialData}
          theme={theme}
          onChange={(excalidrawElements) => setElements(excalidrawElements)}
        >
          <MainMenu>
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.DefaultItems.SaveAsImage />
            <MainMenu.DefaultItems.Export />
            <MainMenu.DefaultItems.Help />
          </MainMenu>
          <WelcomeScreen>
            <WelcomeScreen.Hints.MenuHint />
            <WelcomeScreen.Hints.ToolbarHint />
            <WelcomeScreen.Hints.HelpHint />
          </WelcomeScreen>
        </Excalidraw>
        {showAiSuggestions && <AiSuggestions onApplyTemplate={handleApplyTemplate} />}
        {showColorPalette && <ColorPalette />}
      </div>
    </div>
  );
};

export default Editor;
