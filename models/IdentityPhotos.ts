import { Schema, Types, model } from "mongoose";

const identitySchema = new Schema(
  {
    identityPhoto: {
      type: String,
    },
    identityVerificationStatus: {
      type: String,
      enum: ["pending", "success", "reject"],
    },
    user: {
      type: Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

const IdentityPhotos = model("IdentityPhotos", identitySchema);
export default IdentityPhotos;
