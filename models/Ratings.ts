import { Schema, model, Types } from "mongoose";

const ratingSchema = new Schema(
  {
    guestRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    hostRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    guestID: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    hostID: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    guestFeedback: {
      type: String,
    },
    hostFeedback: {
      type: String,
    },
    reservationID: {
      type: Types.ObjectId,
      ref: "Reservations",
      required: true,
    },
  },
  { timestamps: true }
);

const Ratings = model("Ratings", ratingSchema);

export default Ratings;
