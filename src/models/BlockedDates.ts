import { model, Schema, Types } from "mongoose";

const blockedDatesSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      required: true,
    },
    blockedDates: {
      type: [Date],
      required: true,
    },
  },
  { timestamps: true }
);

const BlockedDates = model("BlockedDates", blockedDatesSchema);
export default BlockedDates;
