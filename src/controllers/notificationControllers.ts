import { RequestHandler } from "express";
import createHttpError from "http-errors";
import GuestNotifications from "../models/GuestNotifications";
import HostNotifications from "../models/HostNotifications";

export const getGuestNotifications: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const guestNotifications = await GuestNotifications.find({
      recipientID: id,
      read: false,
    })
      .sort({ createdAt: "desc" })
      .exec();

    res
      .status(200)
      .json({
        guestNotifications: guestNotifications.map((v) => v.notificationType),
      });
  } catch (error) {
    next(error);
  }
};

export const getHostNotifications: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }
    const hostNotifications = await HostNotifications.find({ recipientID: id })
      .populate([
        { select: ["username", "photoUrl"], path: "fromGuestID" },
        { select: ["username", "photoUrl"], path: "toHostID" },
        {
          path: "bookingRequest",
          populate: "listingID",
        },
      ])
      .sort({ createdAt: "desc" })
      .exec();

    res.status(200).json({ hostNotifications });
  } catch (error) {
    next(error);
  }
};

export const updateGuestNotification: RequestHandler = async (
  req,
  res,
  next
) => {
  const id = req.cookies["_&!d"];
  const { notificationID } = req.body;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }
    const updateNotification = await GuestNotifications.findByIdAndUpdate(
      notificationID,
      {
        read: true,
      }
    );

    res.status(201).json({ updateNotification });
  } catch (error) {
    next(error);
  }
};
