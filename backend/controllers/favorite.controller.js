import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { Favorite } from "../models/favorite.model.js";

// @desc    Add template to favorites
// @route   POST /api/v1/favorites
// @access  Private
export const addToFavorites = asyncHandler(async (req, res, next) => {
  const { templateId } = req.body;
  const userId = req.user._id;

  if (!templateId) {
    return next(new ErrorHandler("Template ID is required", 400));
  }

  const existingFavorite = await Favorite.findOne({ user: userId, template: templateId });
  if (existingFavorite) {
    return next(new ErrorHandler("Template already in favorites", 400));
  }

  const favorite = await Favorite.create({
    user: userId,
    template: templateId,
  });

  res.status(201).json({
    success: true,
    message: "Template added to favorites",
    favorite,
  });
});

// @desc    Remove template from favorites
// @route   DELETE /api/v1/favorites/:templateId
// @access  Private
export const removeFromFavorites = asyncHandler(async (req, res, next) => {
  const { templateId } = req.params;
  const userId = req.user._id;

  const favorite = await Favorite.findOneAndDelete({ user: userId, template: templateId });

  if (!favorite) {
    return next(new ErrorHandler("Favorite not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Template removed from favorites",
  });
});

// @desc    Get user's favorite templates
// @route   GET /api/v1/favorites
// @access  Private
export const getFavorites = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const favorites = await Favorite.find({ user: userId }).populate('template').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    favorites: favorites.map(fav => fav.template),
  });
});

// @desc    Check if template is favorited by user
// @route   GET /api/v1/favorites/check/:templateId
// @access  Private
export const checkFavorite = asyncHandler(async (req, res, next) => {
  const { templateId } = req.params;
  const userId = req.user._id;

  const favorite = await Favorite.findOne({ user: userId, template: templateId });

  res.status(200).json({
    success: true,
    isFavorited: !!favorite,
  });
});