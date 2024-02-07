import { Schema, Types, model } from "mongoose";

const subscriptionPaymentsSchema = new Schema(
  {
    paymentProofPhoto: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "reject"],
    },
    user: {
      type: Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

const SubscriptionPayments = model(
  "SubscriptionPayments",
  subscriptionPaymentsSchema
);
export default SubscriptionPayments;
