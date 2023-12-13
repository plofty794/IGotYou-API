import { Schema, model, Types, InferSchemaType } from "mongoose";

const notificationSchema = new Schema(
  {
    fromUserID: {
      type: Types.ObjectId,
      ref: "Users",
    },
    fromAdmin: {
      type: Types.ObjectId,
      ref: "Admin",
    },
    toUserID: {
      type: Types.ObjectId,
      ref: "Users",
    },
    paymentStatus: {
      type: String,
      enum: ["reject", "success"],
    },
    notificationType: {
      type: String,
      enum: [
        "New-Message",
        "Booking-Confirmed",
        "Booking-Rejected",
        "Booking-Request",
        "Subscription-Status",
      ],
      required: true,
    },
    bookingRequest: {
      type: Types.ObjectId,
      ref: "BookingRequests",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export type TNotification = InferSchemaType<typeof notificationSchema>;
const Notifications = model("Notifications", notificationSchema);
export default Notifications;
