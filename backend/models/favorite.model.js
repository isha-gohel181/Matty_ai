import mongoose, { Schema } from "mongoose";

const favoriteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    template: {
      type: Schema.Types.ObjectId,
      ref: "Template",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure a user can favorite a template only once
favoriteSchema.index({ user: 1, template: 1 }, { unique: true });

export const Favorite = mongoose.model("Favorite", favoriteSchema);