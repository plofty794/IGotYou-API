import { Schema, Types, model } from "mongoose";

const paymentsSchema = new Schema(
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

const Payments = model("Payments", paymentsSchema);
export default Payments;
