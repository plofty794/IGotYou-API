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
    message: {
      type: String,
      required: true,
    },
    listingID: {
      type: Types.ObjectId,
      ref: "Listings",
    },
  },
  { timestamps: true }
);

const Reservations = model("Reservations", reservationsSchema);
export default Reservations;
