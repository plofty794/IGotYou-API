import { Schema, model, Types } from "mongoose";

const ratingSchema = new Schema(
  {
    userRating: {
      type: Number,
      required: true,
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
    feedback: {
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
