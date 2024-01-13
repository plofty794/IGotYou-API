import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Reservations from "../models/Reservations";
import { addDays } from "date-fns";

export const getCurrentReservations: RequestHandler = async (
  req,
  res,
  next
) => {
  const id = req.cookies["_&!d"];
  const page = parseInt(req.params.page ?? "1") ?? 1;
  const limit = 10;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const currentReservations = await Reservations.find({
      hostID: id,
      bookingStarts: {
        $eq: new Date().setHours(0, 0, 0, 0),
      },
    })
      .populate([
        { path: "guestID", select: "username email" },
        {
          path: "listingID",
          select: "serviceDescription serviceType listingPhotos",
        },
      ])
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const totalPages = currentReservations.length / limit;

    res.status(200).json({ currentReservations, totalPages });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingReservations: RequestHandler = async (
  req,
  res,
  next
) => {
  const id = req.cookies["_&!d"];
  const page = parseInt(req.params.page ?? "1") ?? 1;
  const limit = 10;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const upcomingReservations = await Reservations.find({
      hostID: id,
      bookingStarts: {
        $gt: new Date(),
      },
    })
      .populate([
        { path: "guestID", select: "username email" },
        {
          path: "listingID",
          select: "serviceDescription serviceType listingPhotos",
        },
      ])
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const totalPages = upcomingReservations.length / limit;

    res.status(200).json({ upcomingReservations, totalPages });
  } catch (error) {
    next(error);
  }
};

export const getPreviousReservations: RequestHandler = async (
  req,
  res,
  next
) => {
  const id = req.cookies["_&!d"];
  const page = parseInt(req.params.page ?? "1") ?? 1;
  const limit = 10;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const previousReservations = await Reservations.find({
      hostID: id,
      bookingEndsAt: {
        $lt: new Date(),
      },
    })
      .populate([
        { path: "guestID", select: "username email" },
        {
          path: "listingID",
          select: "serviceDescription serviceType listingPhotos",
        },
      ])
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const totalPages = previousReservations.length / limit;

    res.status(200).json({ previousReservations, totalPages });
  } catch (error) {
    next(error);
  }
};
