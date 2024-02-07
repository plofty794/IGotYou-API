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
    },
    requestedBookingDateEndsAt: {
      type: Date,
    },
    message: {
      type: String,
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
    type: {
      type: String,
      enum: ["Service-Cancellation-Request"],
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
    reservationID: {
      type: Types.ObjectId,
      ref: "Reservations",
    },
  },
  { timestamps: true }
);

const BookingRequests = model("BookingRequests", bookingRequestsSchema);
export default BookingRequests;
