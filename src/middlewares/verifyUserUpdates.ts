import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { postcodeValidator } from "postcode-validator";
import Users from "../models/Users";

type TUserUpdates = {
  username?: string;
  address?: string;
  school?: string;
  work?: string;
  funFact?: string;
  mobilePhone?: string;
};

export const verifyUserUpdates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, mobilePhone }: TUserUpdates = req.body;
  // const postcode = address?.match(/\d{4}/g)?.join("");
  // const country_code = address?.match(/[A-Z]+$/g)?.join("");

  // const validPostCode = postcodeValidator(postcode!, country_code!);
  // if (!validPostCode) {
  //   return next(createHttpError(400, "Invalid zip code"));
  // }

  if (username) {
    const usernameExist = await Users.findOne({ username });
    if (usernameExist) {
      return next(createHttpError(409, "Username already exist"));
    }
  }

  if (mobilePhone) {
    const mobilePhoneTaken = await Users.findOne({ mobilePhone });
    if (mobilePhoneTaken) {
      return next(createHttpError(409, "Mobile phone already exist"));
    }
  }
  next();
};
