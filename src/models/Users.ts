import { Schema, InferSchemaType, model, Types } from "mongoose";
import env from "../utils/envalid";
import bcrypt from "bcrypt";

const ratingSchema = new Schema(
  {
    userRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    ratedBy: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const usersSchema = new Schema(
  {
    providerId: {
      type: String,
    },
    //User Details
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    password: {
      type: String,
    },
    mobileVerified: {
      type: Boolean,
      default: false,
    },
    mobilePhone: {
      type: String,
    },
    address: {
      type: String,
    },
    school: {
      type: String,
    },
    funFact: {
      type: String,
    },
    work: {
      type: String,
    },
    photoUrl: {
      type: String,
    },
    // Host details
    uid: {
      type: String,
      required: true,
    },
    userStatus: {
      type: String,
      enum: ["host", "guest"],
      default: "guest",
    },
    listings: {
      type: [Types.ObjectId],
      ref: "Listings",
    },
    rating: {
      type: [ratingSchema],
    },
    subscriptionStatus: {
      type: String,
      enum: ["pending", "active", "expired", "reject"],
    },
    reservations: {
      type: [Types.ObjectId],
      ref: "Reservations",
    },
    subscriptionExpiresAt: {
      type: Date,
    },
    // Other details
    wishlists: {
      type: [Types.ObjectId],
      ref: "Listings",
    },
    notifications: {
      type: [Types.ObjectId],
      ref: "Notifications",
    },
    bookingRequests: {
      type: [Types.ObjectId],
      ref: "BookingRequests",
    },
    conversation: {
      type: [Types.ObjectId],
      ref: "Conversations",
    },
  },
  { timestamps: true }
);

usersSchema.pre("save", async function () {
  if (this.password) {
    const hashedPassword = await bcrypt.hash(this?.password, env.SALT);
    this.password = hashedPassword;
  }
});

export type TUser = InferSchemaType<typeof usersSchema>;
const Users = model("Users", usersSchema);
export default Users;
