import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { Template } from "../models/template.model.js";
import {
  uploadOnCloudinary,
} from "../utils/cloudinary.utils.js";
import { cloudinaryImageRefer } from "../utils/constants.utils.js";

// @desc    Create a new template
// @route   POST /api/v1/templates/create
// @access  Private (Admin)
export const createTemplate = asyncHandler(async (req, res, next) => {
  const { title, excalidrawJSON, category, tags } = req.body;
  const thumbnailLocalPath = req.file?.path;

  if (!title || !excalidrawJSON || !thumbnailLocalPath) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const thumbnail = await uploadOnCloudinary(
    thumbnailLocalPath,
    cloudinaryImageRefer,
    req.user,
    req.file.originalname
  );

  if (!thumbnail) {
    return next(new ErrorHandler("Error uploading thumbnail", 500));
  }

  const template = await Template.create({
    title,
    excalidrawJSON,
    thumbnailUrl: {
      public_id: thumbnail.public_id,
      secure_url: thumbnail.secure_url,
    },
    category,
    tags: tags ? tags.split(",") : [],
  });

  res.status(201).json({
    success: true,
    message: "Template created successfully",
    template,
  });
});

// @desc    Get all templates
// @route   GET /api/v1/templates
// @access  Public
export const getTemplates = asyncHandler(async (req, res, next) => {
  const { search, category, tags } = req.query;

  let query = {};

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  if (category) {
    query.category = category;
  }

  if (tags) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    query.tags = { $in: tagArray };
  }

  const templates = await Template.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    templates,
  });
});


// @desc    Get a single template by ID
// @route   GET /api/v1/templates/:id
// @access  Public
export const getTemplateById = asyncHandler(async (req, res, next) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    return next(new ErrorHandler("Template not found", 404));
  }

  res.status(200).json({
    success: true,
    template,
  });
});