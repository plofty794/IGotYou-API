import { Schema, Types, model } from "mongoose";

const blockedUserSchema = new Schema(
  {
    blockerID: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    blockedID: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    reason: {
      type: String,
      enum: [
        "Harassment",
        "Spamming or excessive messaging",
        "Attempted fraud or scams",
        "Repeated booking cancellations or no-shows",
        "Abusive language or behavior",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const BlockedUsers = model("BlockedUsers", blockedUserSchema);

export default BlockedUsers;
