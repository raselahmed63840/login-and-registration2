const mongoose = require("mongoose");

const liveSessionSchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    streamUrl: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Live", "Ended"],
      default: "Live",
    },

    hostType: {
      type: String,
      enum: ["admin", "vendor"],
      default: "admin",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.LiveSession ||
  mongoose.model("LiveSession", liveSessionSchema);