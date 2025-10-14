// frontend/src/pages/DashboardPages/ImageTestPage.jsx

import React, { useState, useRef } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const ImageTestPage = () => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !excalidrawAPI) {
      console.log("No file or Excalidraw API not ready.");
      return;
    }
    
    // The most direct way: let Excalidraw handle the file.
    // It will create the dataURL, the element, and update the scene.
    try {
      excalidrawAPI.addFiles([file]);
    } catch (error) {
      console.error("Error adding file to Excalidraw:", error);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="h-16 p-4 bg-background border-b flex items-center justify-between">
        <h1 className="text-xl font-bold">Image Upload Test Page</h1>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: "none" }}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current.click()}
          >
            <Upload className="mr-2 h-4 w-4" /> Test Upload
          </Button>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <Excalidraw
          excalidrawAPI={setExcalidrawAPI}
          theme="dark"
          initialData={{ appState: { gridSize: null } }}
        />
      </div>
    </div>
  );
};

export default ImageTestPage;