import { Schema, InferSchemaType, model, Types } from "mongoose";

const listingPhotosSchema = new Schema({
  public_id: {
    type: String,
    required: true,
  },
  secure_url: {
    type: String,
    required: true,
  },
  original_filename: {
    type: String,
    required: true,
  },
});

const listingSchema = new Schema(
  {
    serviceType: {
      type: String,
      enum: [
        "Digital Audio Services",
        "Digital Video Services",
        "Graphic Design and Visual Arts",
        "Photography Services",
        "Animation and 3D Modeling",
        "Live Events and Concerts",
        "Digital Advertising and Marketing",
      ],
      required: true,
    },
    serviceDescription: {
      type: String,
      required: true,
    },
    listingPhotos: {
      type: [listingPhotosSchema],
      required: true,
    },
    host: {
      type: Types.ObjectId,
      ref: "Users",
    },
    price: {
      type: Number,
      required: true,
    },
    availableAt: {
      type: Date,
      required: true,
    },
    endsAt: {
      type: Date,
      required: true,
    },
    serviceLocation: {
      type: String,
      required: true,
    },
    cancellationPolicy: {
      type: String,
      enum: ["Flexible", "Moderate", "Strict"],
      required: true,
    },
  },
  { timestamps: true }
);

export type TListing = InferSchemaType<typeof listingSchema>;
const Listings = model("Listings", listingSchema);
export default Listings;
