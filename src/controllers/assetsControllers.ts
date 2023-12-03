import { RequestHandler } from "express";
import { removeAsset } from "../utils/cloudinaryRemoveAssets";
import createHttpError from "http-errors";

export const removeAssets: RequestHandler = async (req, res, next) => {
  const { folder, assetName } = req.params;
  try {
    const result = await removeAsset(folder, assetName);
    if (!result) {
      throw createHttpError(
        400,
        "Something went wrong while removing the assets"
      );
    }
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};
