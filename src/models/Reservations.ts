import { Schema, model, Types } from "mongoose";

const reservationsSchema = new Schema(
  {
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
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "previous"],
    },
  },
  { timestamps: true }
);

reservationsSchema.pre("save", function () {
  if (
    new Date(this.bookingStartsAt).toDateString() === new Date().toDateString()
  ) {
    this.status = "ongoing";
  } else if (
    new Date(this.bookingStartsAt).toDateString() > new Date().toDateString()
  ) {
    this.status = "upcoming";
  }
});

const Reservations = model("Reservations", reservationsSchema);
export default Reservations;
