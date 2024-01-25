import { Schema, model, Types } from "mongoose";

const bookingRequestsSchema = new Schema(
  {
    guestID: {
      type: Types.ObjectId,
      ref: "Users",
    },
    hostID: {
      type: Types.ObjectId,
      ref: "Users",
    },
    requestedBookingDateStartsAt: {
      type: Date,
      required: true,
    },
    requestedBookingDateEndsAt: {
      type: Date,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined", "cancelled"],
      default: "pending",
    },
    listingID: {
      type: Types.ObjectId,
      ref: "Listings",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    hostDeclineReasons: {
      type: String,
      enum: [
        "unverified identity",
        "maintenance/upkeep",
        "mismatched expectations",
        "safety concerns",
        "no reviews",
        "negative reviews",
      ],
    },
    guestCancelReasons: {
      type: String,
      enum: [
        "unverified identity",
        "unexpected events",
        "mismatched expectations",
        "safety concerns",
        "no reviews",
        "negative reviews",
        "change of heart",
      ],
    },
  },
  { timestamps: true }
);

const BookingRequests = model("BookingRequests", bookingRequestsSchema);
export default BookingRequests;
