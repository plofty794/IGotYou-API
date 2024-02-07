import { RequestHandler } from "express";
import { clearCookieAndThrowError } from "../utils/clearCookieAndThrowError";
import BlockedUsers from "../models/BlockedUsers";

export const blockUser: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { blockedID } = req.params;
  const { reason } = req.body;
  try {
    if (!id) {
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
    }

    await BlockedUsers.create({
      blockerID: id,
      blockedID,
      reason,
    });

    res.status(201).json({ message: "User has been blocked." });
  } catch (error) {
    next(error);
  }
};

export const unblockUser: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { blockedID } = req.params;
  try {
    if (!id) {
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
    }

    await BlockedUsers.findOneAndDelete({
      blockerID: id,
      blockedID,
    });

    res.status(201).json({ message: "You have unblocked this user." });
  } catch (error) {
    next(error);
  }
};
