import { Schema, model, Types, InferSchemaType } from "mongoose";

const guestNotificationSchema = new Schema(
  {
    senderID: {
      type: Types.ObjectId,
      ref: "Users",
    },
    recipientID: {
      type: Types.ObjectId,
      ref: "Users",
    },
    notificationType: {
      type: String,
      enum: ["New-Message", "Booking-Approved", "Booking-Declined"],
      required: true,
    },
    data: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export type TGuestNotification = InferSchemaType<
  typeof guestNotificationSchema
>;
const GuestNotifications = model("GuestNotifications", guestNotificationSchema);
export default GuestNotifications;
