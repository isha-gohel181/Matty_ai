import ErrorHandler from "./error.middleware.js";
import { asyncHandler } from "./asyncHandler.middleware.js";
import { ApiKey } from "../models/apiKey.model.js";

export const verifyApiKey = asyncHandler(async (req, res, next) => {
    const apiKey = req.header("X-API-Key");

    if (!apiKey) {
        return next(new ErrorHandler("API key is required", 401));
    }

    const keyDoc = await ApiKey.findAndUpdateUsage(apiKey);

    if (!keyDoc) {
        return next(new ErrorHandler("Invalid or inactive API key", 401));
    }

    // Ensure user is fully populated
    if (!keyDoc.user) {
        return next(new ErrorHandler("API key user not found", 401));
    }

    req.user = keyDoc.user;
    req.apiKey = keyDoc;
    next();
});