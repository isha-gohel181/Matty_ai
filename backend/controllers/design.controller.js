import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { Design } from "../models/design.model.js";
import {
  uploadOnCloudinary,
  destroyOnCloudinary,
} from "../utils/cloudinary.utils.js";
import { cloudinaryImageRefer } from "../utils/constants.utils.js";
import { logActivity } from "../utils/logActivity.js";

// @desc    Create a new design
// @route   POST /api/v1/designs
// @access  Private
const createDesign = asyncHandler(async (req, res, next) => {
  console.log("createDesign called");
  const { title, excalidrawJSON, tags } = req.body;
  const thumbnailLocalPath = req.file?.path;

  console.log("title:", title);
  console.log("excalidrawJSON:", excalidrawJSON);
  console.log("tags:", tags);
  console.log("thumbnailLocalPath:", thumbnailLocalPath);
  console.log("req.file:", req.file);

  if (!title || !excalidrawJSON || !thumbnailLocalPath) {
    console.log("Missing fields");
    return next(new ErrorHandler("All fields are required", 400));
  }

  const thumbnail = await uploadOnCloudinary(
    thumbnailLocalPath,
    cloudinaryImageRefer,
    req.user,
    req.file.originalname
  );

  console.log("thumbnail result:", thumbnail);

  if (!thumbnail) {
    console.log("Thumbnail upload failed");
    return next(new ErrorHandler("Error uploading thumbnail", 500));
  }

  const design = await Design.create({
    user: req.user._id,
    title,
    excalidrawJSON,
    thumbnailUrl: {
      public_id: thumbnail.public_id,
      secure_url: thumbnail.secure_url,
    },
    tags: tags || [],
  });

  // Log activity
  await logActivity(req.user._id, "upload", `Created design: ${title}`, req);

  res.status(201).json({
    success: true,
    message: "Design created successfully",
    design,
  });
});

// @desc    Get all designs for a user
// @route   GET /api/v1/designs
// @access  Private
const getMyDesigns = asyncHandler(async (req, res, next) => {
  const { search } = req.query;
  let query = { user: req.user._id };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  const designs = await Design.find(query).sort({
    updatedAt: -1,
  });

  res.status(200).json({
    success: true,
    designs,
  });
});

// @desc    Get a single design by ID
// @route   GET /api/v1/designs/:id
// @access  Private
const getDesignById = asyncHandler(async (req, res, next) => {
  const design = await Design.findById(req.params.id);

  if (!design) {
    return next(new ErrorHandler("Design not found", 404));
  }

  if (design.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to view this design", 403));
  }

  res.status(200).json({
    success: true,
    design,
  });
});

// @desc    Update a design
// @route   PUT /api/v1/designs/:id
// @access  Private
const updateDesign = asyncHandler(async (req, res, next) => {
  const { title, excalidrawJSON, tags } = req.body;
  const thumbnailLocalPath = req.file?.path;

  let design = await Design.findById(req.params.id);

  if (!design) {
    return next(new ErrorHandler("Design not found", 404));
  }

  if (design.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to update this design", 403));
  }

  design.title = title || design.title;
  design.excalidrawJSON = excalidrawJSON || design.excalidrawJSON;
  design.tags = tags !== undefined ? tags : design.tags;

  if (thumbnailLocalPath) {
    await destroyOnCloudinary(
      design.thumbnailUrl.public_id,
      cloudinaryImageRefer
    );
    const newThumbnail = await uploadOnCloudinary(
      thumbnailLocalPath,
      cloudinaryImageRefer,
      req.user,
      req.file.originalname
    );
    design.thumbnailUrl = {
      public_id: newThumbnail.public_id,
      secure_url: newThumbnail.secure_url,
    };
  }

  const updatedDesign = await design.save();

  // Log activity
  await logActivity(req.user._id, "update", `Updated design: ${title}`, req);

  res.status(200).json({
    success: true,
    message: "Design updated successfully",
    design: updatedDesign,
  });
});

// @desc    Delete a design
// @route   DELETE /api/v1/designs/:id
// @access  Private
const deleteDesign = asyncHandler(async (req, res, next) => {
  const design = await Design.findById(req.params.id);

  if (!design) {
    return next(new ErrorHandler("Design not found", 404));
  }

  if (design.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to delete this design", 403));
  }

  await destroyOnCloudinary(design.thumbnailUrl.public_id, cloudinaryImageRefer);
  await design.deleteOne();

  // Log activity
  await logActivity(req.user._id, "delete", `Deleted design: ${design.title}`, req);

  res.status(200).json({
    success: true,
    message: "Design deleted successfully",
  });
});

export {
  createDesign,
  getMyDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
};