import jsPDF from "jspdf";

/**
 * Export Excalidraw SVG to PDF (browser-compatible)
 * @param {SVGSVGElement | string} svg - The SVG element or string to export
 * @param {string} filename - Output filename
 */
export const exportToPdf = async (svg, filename = "export.pdf") => {
  try {
    // Convert SVG element to string if needed
    const svgString =
      typeof svg === "string" ? svg : new XMLSerializer().serializeToString(svg);

    // Create an SVG Blob
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    // Create an Image to draw the SVG on a Canvas
    const img = new Image();
    img.onload = function () {
      // Create a canvas same size as the image
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      // Draw the SVG image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Convert the canvas to a PNG data URL
      const pngDataUrl = canvas.toDataURL("image/png");

      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: img.width > img.height ? "landscape" : "portrait",
        unit: "pt",
        format: [img.width, img.height],
      });

      // Add the image to the PDF
      pdf.addImage(pngDataUrl, "PNG", 0, 0, img.width, img.height);

      // Save the PDF
      pdf.save(filename);

      // Clean up
      URL.revokeObjectURL(url);
    };

    img.onerror = (err) => {
      console.error("Error loading SVG image for PDF export:", err);
    };

    img.src = url;
  } catch (error) {
    console.error("Error exporting to PDF:", error);
  }
};
