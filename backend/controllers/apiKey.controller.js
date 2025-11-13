import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { ApiKey } from "../models/apiKey.model.js";

// Generate a new API key for the user
export const generateApiKey = asyncHandler(async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        return next(new ErrorHandler("API key name is required", 400));
    }

    const key = ApiKey.generateKey();

    const apiKey = new ApiKey({
        user: req.user._id,
        key,
        name
    });

    await apiKey.save();

    res.status(201).json({
        success: true,
        message: "API key generated successfully",
        apiKey: {
            id: apiKey._id,
            name: apiKey.name,
            key: apiKey.key,
            createdAt: apiKey.createdAt
        }
    });
});

// Get all API keys for the user
export const getApiKeys = asyncHandler(async (req, res, next) => {
    const apiKeys = await ApiKey.find({ user: req.user._id }).select('-user');

    res.status(200).json({
        success: true,
        apiKeys
    });
});

// Delete an API key
export const deleteApiKey = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const apiKey = await ApiKey.findOneAndDelete({ _id: id, user: req.user._id });

    if (!apiKey) {
        return next(new ErrorHandler("API key not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "API key deleted successfully"
    });
});

// Toggle API key active status
export const toggleApiKey = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const apiKey = await ApiKey.findOne({ _id: id, user: req.user._id });

    if (!apiKey) {
        return next(new ErrorHandler("API key not found", 404));
    }

    apiKey.isActive = !apiKey.isActive;
    await apiKey.save();

    res.status(200).json({
        success: true,
        message: `API key ${apiKey.isActive ? 'activated' : 'deactivated'} successfully`,
        apiKey: {
            id: apiKey._id,
            name: apiKey.name,
            isActive: apiKey.isActive
        }
    });
});