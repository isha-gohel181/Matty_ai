import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getDesignSuggestions = asyncHandler(async (req, res, next) => {
  const { prompt } = req.body;

  if (!prompt) {
    return next(new ErrorHandler("Prompt is required", 400));
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const fullPrompt = `
      You are a design assistant for a graphic design application. 
      A user has provided the following prompt for a new design: "${prompt}".

      Based on this prompt, provide design suggestions in a structured JSON format. 
      The JSON object should have the following keys:
      - "palette": An array of 3-5 hex color codes that would work well together.
      - "fonts": An object with "heading" and "body" keys, suggesting appropriate font families (e.g., "Montserrat", "Lato").
      - "layout": A brief, one-sentence description of a suggested layout (e.g., "A large, centered image with a bold title at the top and contact information at the bottom.").

      Do not include any other text or formatting in your response.
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = await response.text();

    // Clean up the response to ensure it's valid JSON
    const jsonResponse = JSON.parse(text.replace(/```json/g, "").replace(/```/g, ""));

    res.status(200).json({
      success: true,
      suggestions: jsonResponse,
    });
  } catch (error) {
    console.error("Error generating design suggestions:", error);
    return next(new ErrorHandler("Failed to generate design suggestions", 500));
  }
});