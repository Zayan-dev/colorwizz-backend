import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    contact: { type: String }, // Can add a regex expression for validation e.g. match: /^[0-9]{10}$/
    gender: { type: String }, // Enum for predefined gender options
    savedPalettes: {
      type: [[String]], // Array of arrays of strings
      default: [], // Optional: default to an empty array
    },
    subscriptionPlan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free',
    },
    subscriptionExpiry: {
      type: Date,
      default: null, // Explicitly set default to null
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema, "users");
export default User;
