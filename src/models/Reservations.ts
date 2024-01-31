import { Schema, model, Types } from "mongoose";

const reservationsSchema = new Schema(
  {
    hostID: {
      type: Types.ObjectId,
      ref: "Users",
    },
    guestID: {
      type: Types.ObjectId,
      ref: "Users",
    },
    bookingStartsAt: {
      type: Date,
      required: true,
    },
    bookingEndsAt: {
      type: Date,
      required: true,
    },
    listingID: {
      type: Types.ObjectId,
      ref: "Listings",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "fully-paid", "partially-paid", "refunded"],
      default: "pending",
      required: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
    partialPaymentDate: {
      type: Date,
    },
    fullPaymentDate: {
      type: Date,
    },
    paymentRefundDate: {
      type: Date,
    },
    balance: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      required: true,
    },
  },
  { timestamps: true }
);

const Reservations = model("Reservations", reservationsSchema);
export default Reservations;
