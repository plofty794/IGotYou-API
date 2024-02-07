import { Response } from "express";
import createHttpError from "http-errors";

export const clearCookieAndThrowError = (res: Response, message: string) => {
  res.clearCookie("_&!d");
  throw createHttpError(401, message);
};
