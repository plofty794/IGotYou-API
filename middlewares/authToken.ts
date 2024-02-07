import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/verifyAccessToken";
import createHttpError from "http-errors";

export const authToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  if (!accessToken) {
    return next(createHttpError(401, "Token is required"));
  }
  const decodedToken = await verifyAccessToken(accessToken);
  if (typeof decodedToken == "string") {
    return next(createHttpError(401, decodedToken));
  }
  next();
};
