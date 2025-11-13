import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import sharp from 'sharp';
import { User } from "../models/user.model.js";

// Helper function to check usage limits
const checkUsageLimit = async (userId, serviceType) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }

  // Check if subscription is active
  const now = new Date();
  if (user.subscriptionEndDate && user.subscriptionEndDate < now) {
    user.isPremium = false;
    await user.save();
  }

  if (user.isPremium) {
    return { allowed: true, remaining: 'unlimited' };
  }

  // For free users, implement monthly limits
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Initialize usage tracking if not exists
  if (!user.usageLimits) {
    user.usageLimits = {
      month: currentMonth,
      year: currentYear,
      aiSuggestions: 0,
      colorPalettes: 0
    };
  }

  // Reset counters if it's a new month
  if (user.usageLimits.month !== currentMonth || user.usageLimits.year !== currentYear) {
    user.usageLimits = {
      month: currentMonth,
      year: currentYear,
      aiSuggestions: 0,
      colorPalettes: 0
    };
  }

  const limits = {
    aiSuggestions: 5,
    colorPalettes: 3
  };

  const currentUsage = user.usageLimits[serviceType];
  const limit = limits[serviceType];

  if (currentUsage >= limit) {
    return {
      allowed: false,
      remaining: 0,
      message: `Free limit exceeded. Upgrade to premium for unlimited ${serviceType === 'aiSuggestions' ? 'AI suggestions' : 'color palettes'}.`
    };
  }

  return {
    allowed: true,
    remaining: limit - currentUsage - 1
  };
};

// Helper function to increment usage
const incrementUsage = async (userId, serviceType) => {
  const user = await User.findById(userId);

  if (user.isPremium) return; // No need to track for premium users

  if (!user.usageLimits) {
    user.usageLimits = {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      aiSuggestions: 0,
      colorPalettes: 0
    };
  }

  user.usageLimits[serviceType] = (user.usageLimits[serviceType] || 0) + 1;
  await user.save();
};

// Initialize the Google Generative AI client
let genAI;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
  console.warn('GEMINI_API_KEY not found. AI features will not work.');
}

export const getDesignSuggestions = asyncHandler(async (req, res, next) => {
  const { prompt } = req.body;

  if (!prompt) {
    return next(new ErrorHandler("Prompt is required", 400));
  }

  if (!genAI) {
    return next(new ErrorHandler("AI service is not configured. Please add GEMINI_API_KEY to environment variables.", 503));
  }

  // Check usage limits
  const usageCheck = await checkUsageLimit(req.user._id, 'aiSuggestions');
  if (!usageCheck.allowed) {
    return next(new ErrorHandler(usageCheck.message, 429));
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
      remainingRequests: usageCheck.remaining
    });

    // Increment usage after successful response
    await incrementUsage(req.user._id, 'aiSuggestions');
  } catch (error) {
    console.error("Error generating design suggestions:", error);
    return next(new ErrorHandler("Failed to generate design suggestions", 500));
  }
});

export const generateColorPalette = asyncHandler(async (req, res, next) => {
  const imageLocalPath = req.file?.path;

  if (!imageLocalPath) {
    return next(new ErrorHandler("Image file is required", 400));
  }

  // Check usage limits
  const usageCheck = await checkUsageLimit(req.user._id, 'colorPalettes');
  if (!usageCheck.allowed) {
    return next(new ErrorHandler(usageCheck.message, 429));
  }

  try {
    // Extract colors using Sharp - resize to small grid and sample
    const image = sharp(imageLocalPath);
    const { data } = await image
      .resize(3, 3, { fit: 'cover', position: 'center' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Extract colors from the 3x3 grid (9 pixels)
    const colors = new Set();
    for (let i = 0; i < data.length; i += 3) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const hex = '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
      colors.add(hex);
    }

    const hexPalette = Array.from(colors).slice(0, 5); // Take up to 5 unique colors

    // Use Gemini to suggest complementary colors
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are a color design expert. Given the following dominant colors extracted from an image: ${hexPalette.join(', ')}.

      Suggest a complete color palette that includes these colors and adds complementary colors to create a harmonious design.
      Provide the response in JSON format with the following structure:
      {
        "primary": ["#hex1", "#hex2", ...], // The extracted colors
        "complementary": ["#hex3", "#hex4", ...], // Suggested complementary colors
        "fullPalette": ["#hex1", "#hex2", "#hex3", ...] // All colors together
      }

      Ensure the palette has 5-8 colors total. Do not include any other text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Clean up the response
    const jsonResponse = JSON.parse(text.replace(/```json/g, "").replace(/```/g, ""));

    res.status(200).json({
      success: true,
      palette: jsonResponse,
      remainingRequests: usageCheck.remaining
    });

    // Increment usage after successful response
    await incrementUsage(req.user._id, 'colorPalettes');
  } catch (error) {
    console.error("Error generating color palette:", error);
    return next(new ErrorHandler("Failed to generate color palette", 500));
  }
});