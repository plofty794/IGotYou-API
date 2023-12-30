import { RequestHandler } from "express";
import { clearCookieAndThrowError } from "../utils/clearCookieAndThrowError";
import Reservations from "../models/Reservations";
import BookingRequests from "../models/BookingRequests";
import Users from "../models/Users";
import HostNotifications from "../models/HostNotifications";
import Listings from "../models/Listings";

type TBookingRequest = {
  hostID: string;
  requestedBookingDateStartsAt: Date;
  requestedBookingDateEndsAt: Date;
  message: string;
};

export const sendBookingRequest: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { listingID } = req.params;
  const {
    hostID,
    requestedBookingDateEndsAt,
    requestedBookingDateStartsAt,
  }: TBookingRequest = req.body;
  try {
    if (!id) {
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
    }

    const listingIsActive = await Listings.findOne({
      _id: listingID,
      status: "Active",
    });

    if (!listingIsActive) {
      return res.status(400).json({ message: "Listing is not active." });
    }

    const bookingRequestAlreadyExist = await BookingRequests.findOne({
      guestID: id,
      hostID,
      listingID,
      requestedBookingDateStartsAt,
      requestedBookingDateEndsAt,
    });

    if (bookingRequestAlreadyExist) {
      return res
        .status(400)
        .json({ message: "You've already sent a booking request" });
    }

    const hasReservation = await Reservations.findOne({
      listingID,
      hostID,
      $and: [
        {
          bookingStartsAt: { $lte: requestedBookingDateEndsAt },
        },
        {
          bookingEndsAt: { $gte: requestedBookingDateStartsAt },
        },
      ],
    });

    if (hasReservation) {
      return res.status(400).json({ message: "Dates are already taken" });
    }

    const newBookingRequest = await BookingRequests.create({
      ...req.body,
      guestID: id,
    });

    const newHostNotification = await HostNotifications.create({
      senderID: id,
      recipientID: hostID,
      notificationType: "Booking-Request",
      data: newBookingRequest._id,
    });

    await newHostNotification.populate({
      path: "senderID",
      select: "username",
    });

    const receiverName = await Users.findById(hostID).select("username");

    res
      .status(201)
      .json({ newHostNotification, receiverName: receiverName?.username });
  } catch (error) {
    next(error);
  }
};

export const getBookingRequests: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const limit = 10;
  const page = parseInt(req.params.page ?? "1") ?? 1;
  try {
    if (!id) {
      if (!id) {
        clearCookieAndThrowError(
          res,
          "A _id cookie is required to access this resource."
        );
      }
    }

    const bookingRequests = await BookingRequests.find({ guestID: id })
      .sort({ createdAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate([{ path: "listingID" }, { select: "username", path: "hostID" }])
      .exec();

    const totalPages = Math.ceil(bookingRequests.length / limit);

    res.status(200).json({ bookingRequests, totalPages });
  } catch (error) {
    next(error);
  }
};
