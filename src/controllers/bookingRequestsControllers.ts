import { RequestHandler } from "express";
import { clearCookieAndThrowError } from "../utils/clearCookieAndThrowError";
import Reservations from "../models/Reservations";
import BookingRequests from "../models/BookingRequests";
import Users from "../models/Users";
import HostNotifications from "../models/HostNotifications";
import Listings from "../models/Listings";
import createHttpError from "http-errors";

type TBookingRequest = {
  hostID: string;
  requestedBookingDateStartsAt: Date;
  requestedBookingDateEndsAt: Date;
  message: string;
};

export const getBookingRequestDetails: RequestHandler = async (
  req,
  res,
  next
) => {
  const id = req.cookies["_&!d"];
  const { bookingRequestID } = req.params;
  try {
    if (!id) {
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
    }
    const bookingRequest = await BookingRequests.findById(bookingRequestID)
      .populate([
        {
          path: "guestID",
          select:
            "username email photoUrl emailVerified identityVerified mobileVerified mobilePhone",
        },
        {
          path: "listingID",
        },
      ])
      .exec();

    if (!bookingRequest) {
      throw createHttpError(400, "Invalid booking request id");
    }

    res.status(200).json({ bookingRequest });
  } catch (error) {
    next(error);
  }
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
      throw createHttpError(400, "Listing is not active");
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
        .json({ error: "You've already sent a booking request" });
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

export const getGuestBookingRequests: RequestHandler = async (
  req,
  res,
  next
) => {
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

export const getHostBookingRequests: RequestHandler = async (
  req,
  res,
  next
) => {
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

    const bookingRequests = await BookingRequests.find({ hostID: id })
      .sort({ createdAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate([
        { path: "listingID" },
        { select: "username photoUrl", path: "guestID" },
      ])
      .exec();

    const totalPages = Math.ceil(bookingRequests.length / limit);

    res.status(200).json({ bookingRequests, totalPages });
  } catch (error) {
    next(error);
  }
};

export const getGuestApprovedBookingRequests: RequestHandler = async (
  req,
  res,
  next
) => {
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

    const approvedBookingRequests = await BookingRequests.find({
      guestID: id,
      status: "approved",
    })
      .sort({ createdAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate([{ path: "listingID" }, { select: "username", path: "hostID" }])
      .exec();

    const totalPages = Math.ceil(approvedBookingRequests.length / limit);

    res.status(200).json({ approvedBookingRequests, totalPages });
  } catch (error) {
    next(error);
  }
};

export const searchGuestBookingRequest: RequestHandler = async (
  req,
  res,
  next
) => {
  const id = req.cookies["_&!d"];
  const { search } = req.query;
  try {
    if (!id) {
      if (!id) {
        clearCookieAndThrowError(
          res,
          "A _id cookie is required to access this resource."
        );
      }
    }

    const bookingRequest = await BookingRequests.find({
      guestID: id,
    })
      .populate([
        {
          path: "hostID",
          select: "username",
        },
        {
          path: "listingID",
        },
      ])
      .exec();

    const searchResults = bookingRequest.filter(
      (v) =>
        (v.hostID as { username: string }).username
          .toLowerCase()
          .includes((search as string).toLowerCase()) ||
        (v.listingID as { serviceDescription: string }).serviceDescription
          .toLowerCase()
          .includes((search as string).toLowerCase())
    );

    res.status(200).json({ searchResults });
  } catch (error) {
    next(error);
  }
};

export const getGuestPendingBookingRequests: RequestHandler = async (
  req,
  res,
  next
) => {
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

    const pendingBookingRequests = await BookingRequests.find({
      guestID: id,
      status: "pending",
    })
      .sort({ createdAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate([{ path: "listingID" }, { select: "username", path: "hostID" }])
      .exec();

    const totalPages = Math.ceil(pendingBookingRequests.length / limit);

    res.status(200).json({ pendingBookingRequests, totalPages });
  } catch (error) {
    next(error);
  }
};

export const getGuestDeclinedBookingRequests: RequestHandler = async (
  req,
  res,
  next
) => {
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

    const declinedBookingRequests = await BookingRequests.find({
      guestID: id,
      status: "declined",
    })
      .sort({ createdAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate([{ path: "listingID" }, { select: "username", path: "hostID" }])
      .exec();

    const totalPages = Math.ceil(declinedBookingRequests.length / limit);

    res.status(200).json({ declinedBookingRequests, totalPages });
  } catch (error) {
    next(error);
  }
};

export const getGuestCancelledBookingRequests: RequestHandler = async (
  req,
  res,
  next
) => {
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

    const cancelledBookingRequests = await BookingRequests.find({
      guestID: id,
      status: "cancelled",
    })
      .sort({ createdAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate([{ path: "listingID" }, { select: "username", path: "hostID" }])
      .exec();

    const totalPages = Math.ceil(cancelledBookingRequests.length / limit);

    res.status(200).json({ cancelledBookingRequests, totalPages });
  } catch (error) {
    next(error);
  }
};
