import { config } from "dotenv";
import cloudinary from "cloudinary";

config();

export const removeAsset = (folder?: string, assetName?: string) => {
  return cloudinary.v2.api.delete_resources([`${folder}/${assetName}`], {
    invalidate: true,
    resource_type: "image",
  });
};
