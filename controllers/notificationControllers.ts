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
      $or: [
        {
          notificationType: "Booking-Approved",
        },
        {
          notificationType: "Booking-Declined",
        },
        {
          notificationType: "New-Message",
        },
      ],
    })
      .populate([
        { select: ["username"], path: "senderID" },
        {
          path: "data",
          select: ["reservationID"],
        },
      ])
      .sort({ createdAt: "desc" })
      .exec();

    res.status(200).json({ guestNotifications });
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
        { select: ["username"], path: "senderID" },
        {
          path: "data",
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

export const readGuestBookingRequestNotification: RequestHandler = async (
  req,
  res,
  next
) => {
  const id = req.cookies["_&!d"];
  const { notificationID } = req.params;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    await GuestNotifications.findByIdAndUpdate(notificationID, {
      read: true,
    });

    res.status(200).json({ message: "read notification" });
  } catch (error) {
    next(error);
  }
};

export const readHostBookingRequestNotification: RequestHandler = async (
  req,
  res,
  next
) => {
  const id = req.cookies["_&!d"];
  const { notificationID } = req.params;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    await HostNotifications.findByIdAndUpdate(notificationID, {
      read: true,
    });

    res.status(200).json({ message: "read notification" });
  } catch (error) {
    next(error);
  }
};
