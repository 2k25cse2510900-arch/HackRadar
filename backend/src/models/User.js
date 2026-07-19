const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true },
    college: { type: String, default: "", trim: true },
    countryCode: { type: String, default: "+91", trim: true },
    year: { type: String, default: "", trim: true },
    degree: { type: String, default: "", trim: true },
    domains: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    goals: { type: [String], default: [] },
    preferredMode: { type: String, default: "" },
    availability: { type: String, default: "" },
    phoneNumber: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
    username: { type: String, trim: true, unique: true, sparse: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String, trim: true, default: "" },
    passwordHash: { type: String, select: false },
    googleId: { type: String, unique: true, sparse: true },
    authProvider: { type: String, enum: ["email", "google"], default: "email" },

    telegramChatId: { type: String, default: null },

    // NEW FIELDS
    telegramVerified: {
      type: Boolean,
      default: false,
    },

    telegramVerificationCode: {
      type: String,
      default: "",
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    telegramVerificationExpires: {
      type: Date,
      default: null,
    },

    profile: { type: profileSchema, default: () => ({}) },
  },
  { timestamps: true, collection: "Users" }
);

userSchema.methods.toSafeObject = function toSafeObject() {
  const user = this.toObject();
  delete user.passwordHash;
  return user;
};

module.exports = mongoose.model("User", userSchema);
