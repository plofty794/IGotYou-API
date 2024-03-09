import { Schema, model, Types } from "mongoose";

const evidenceSchema = new Schema({
  public_id: {
    type: String,
    required: true,
  },
  secure_url: {
    type: String,
    required: true,
  },
  original_filename: {
    type: String,
    required: true,
  },
  thumbnail_url: {
    type: String,
    required: true,
  },
  resource_type: {
    type: String,
    enum: ["audio", "video", "image"],
  },
  format: {
    type: String,
    required: true,
  },
});

const reportSchema = new Schema(
  {
    reporter: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    reportedUser: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    evidence: {
      type: evidenceSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Reports = model("Reports", reportSchema);
export default Reports;
