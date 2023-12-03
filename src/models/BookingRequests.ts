import { Schema, InferSchemaType, model, Types } from "mongoose";

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
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
    listingID: {
      type: Types.ObjectId,
      ref: "Listings",
    },
  },
  { timestamps: true }
);

const BookingRequests = model("BookingRequests", bookingRequestsSchema);
export default BookingRequests;
