import mongoose, { Schema } from "mongoose";

const designSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Design title is required."],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters."],
    },
    excalidrawJSON: {
      type: String, // Storing the JSON as a string
      required: true,
    },
    thumbnailUrl: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: [30, "Tag cannot be more than 30 characters."],
    }],
    visibility: {
      type: String,
      enum: ["private", "team", "public"],
      default: "private",
    },
    sharedWith: [{
      type: Schema.Types.ObjectId,
      ref: "Team",
    }],
  },
  { timestamps: true }
);

export const Design = mongoose.model("Design", designSchema);