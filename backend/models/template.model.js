import mongoose, { Schema } from "mongoose";

const templateSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Template title is required."],
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
    category: {
      type: String,
      required: true,
      default: "General",
    },
    tags: [String],
  },
  { timestamps: true }
);

export const Template = mongoose.model("Template", templateSchema);