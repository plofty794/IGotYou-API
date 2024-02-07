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
    listingID: {
      type: Types.ObjectId,
      ref: "Listings",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "fully-paid", "partially-paid", "refunded"],
      default: "pending",
      required: true,
    },
    partialPaymentVerificationStatus: {
      type: String,
      enum: ["pending", "success", "rejected"],
    },
    fullPaymentVerificationStatus: {
      type: String,
      enum: ["pending", "success", "rejected"],
    },
    paymentType: {
      type: String,
      enum: ["full-payment", "partial-payment"],
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
    fullPaymentAmount: {
      type: Number,
    },
    partialPaymentAmount: {
      type: Number,
    },
    partialPaymentDate: {
      type: Date,
    },
    fullPaymentDate: {
      type: Date,
    },
    paymentRefundDate: {
      type: Date,
    },
    balance: {
      type: Number,
    },
    partialPaymentProofPhoto: {
      type: {
        public_id: {
          type: String,
        },
        secure_url: {
          type: String,
        },
        thumbnail_url: {
          type: String,
        },
      },
    },
    fullPaymentProofPhoto: {
      type: {
        public_id: {
          type: String,
        },
        secure_url: {
          type: String,
        },
        thumbnail_url: {
          type: String,
        },
      },
    },
    partialPaymentRefNo: {
      type: String,
    },
    fullPaymentRefNo: {
      type: String,
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      required: true,
    },
    confirmServiceEnded: {
      type: Boolean,
      default: false,
    },
    hostCancellationReason: {
      type: String,
      enum: [
        "personal illness or emergency",
        "unavailability of resources",
        "natural disasters or weather events",
        "payment issues",
        "safety Concerns",
        "disputes or conflicts",
      ],
    },
  },
  { timestamps: true }
);

const Reservations = model("Reservations", reservationsSchema);
export default Reservations;
