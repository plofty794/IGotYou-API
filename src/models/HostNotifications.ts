import { Schema, model, Types, InferSchemaType } from "mongoose";

const hostNotificationSchema = new Schema(
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
      enum: [
        "New-Message",
        "Booking-Request",
        "Booking-Cancelled",
        "Re-attempt-Request",
      ],
      required: true,
    },
    data: {
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

export type THostNotification = InferSchemaType<typeof hostNotificationSchema>;
const HostNotifications = model("HostNotifications", hostNotificationSchema);
export default HostNotifications;
