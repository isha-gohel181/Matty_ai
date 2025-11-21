import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { Template } from "../models/template.model.js";
import {
  uploadOnCloudinary,
  destroyOnCloudinary,
} from "../utils/cloudinary.utils.js";
import { cloudinaryImageRefer } from "../utils/constants.utils.js";
import { User } from "../models/user.model.js";

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

  // Ensure excalidrawJSON is properly stored
  // If it's an object, stringify it; if it's already a string, keep it
  let processedJSON = excalidrawJSON;
  if (typeof excalidrawJSON === 'object') {
    processedJSON = JSON.stringify(excalidrawJSON);
  } else if (typeof excalidrawJSON === 'string') {
    // Validate that it's valid JSON
    try {
      JSON.parse(excalidrawJSON);
      processedJSON = excalidrawJSON;
    } catch (error) {
      return next(new ErrorHandler("Invalid Excalidraw JSON format", 400));
    }
  }

  const template = await Template.create({
    title,
    excalidrawJSON: processedJSON,
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

  // Check if user is authenticated and premium
  let isPremium = false;
  if (req.user) {
    const user = await User.findById(req.user._id);
    if (user) {
      // Check if subscription is still active
      const now = new Date();
      if (user.subscriptionEndDate && user.subscriptionEndDate < now) {
        user.isPremium = false;
        await user.save();
      }
      isPremium = user.isPremium;
    }
  }

  let templates;
  if (isPremium) {
    // Premium users get all templates
    templates = await Template.find(query).sort({ createdAt: -1 });
  } else {
    // Free users get only first 10 templates
    templates = await Template.find(query).sort({ createdAt: -1 }).limit(10);
  }

  res.status(200).json({
    success: true,
    templates,
    isPremium,
    limited: !isPremium
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

// @desc    Update a template
// @route   PUT /api/v1/templates/:id
// @access  Private (Admin)
export const updateTemplate = asyncHandler(async (req, res, next) => {
  const { title, excalidrawJSON, category, tags } = req.body;
  const thumbnailLocalPath = req.file?.path;

  const template = await Template.findById(req.params.id);

  if (!template) {
    return next(new ErrorHandler("Template not found", 404));
  }

  // Handle thumbnail update if provided
  let thumbnailData = template.thumbnailUrl;
  if (thumbnailLocalPath) {
    // Delete old thumbnail from Cloudinary
    if (template.thumbnailUrl?.public_id) {
      await destroyOnCloudinary(template.thumbnailUrl.public_id);
    }

    // Upload new thumbnail
    const thumbnail = await uploadOnCloudinary(
      thumbnailLocalPath,
      cloudinaryImageRefer,
      req.user,
      req.file.originalname
    );

    if (!thumbnail) {
      return next(new ErrorHandler("Error uploading thumbnail", 500));
    }

    thumbnailData = {
      public_id: thumbnail.public_id,
      secure_url: thumbnail.secure_url,
    };
  }

  // Process excalidrawJSON
  let processedJSON = template.excalidrawJSON;
  if (excalidrawJSON) {
    if (typeof excalidrawJSON === 'object') {
      processedJSON = JSON.stringify(excalidrawJSON);
    } else if (typeof excalidrawJSON === 'string') {
      try {
        JSON.parse(excalidrawJSON);
        processedJSON = excalidrawJSON;
      } catch (error) {
        return next(new ErrorHandler("Invalid Excalidraw JSON format", 400));
      }
    }
  }

  // Update template
  const updatedTemplate = await Template.findByIdAndUpdate(
    req.params.id,
    {
      title: title || template.title,
      excalidrawJSON: processedJSON,
      thumbnailUrl: thumbnailData,
      category: category || template.category,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map(tag => tag.trim())) : template.tags,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Template updated successfully",
    template: updatedTemplate,
  });
});

// @desc    Delete a template
// @route   DELETE /api/v1/templates/:id
// @access  Private (Admin)
export const deleteTemplate = asyncHandler(async (req, res, next) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    return next(new ErrorHandler("Template not found", 404));
  }

  // Delete thumbnail from Cloudinary
  if (template.thumbnailUrl?.public_id) {
    await destroyOnCloudinary(template.thumbnailUrl.public_id);
  }

  // Delete template from database
  await Template.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Template deleted successfully",
  });
});