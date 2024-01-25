import { RequestHandler } from "express";
import { clearCookieAndThrowError } from "../utils/clearCookieAndThrowError";
import Reservations from "../models/Reservations";
import BookingRequests from "../models/BookingRequests";
import Users from "../models/Users";
import HostNotifications from "../models/HostNotifications";
import Listings from "../models/Listings";
import createHttpError from "http-errors";
import GuestNotifications from "../models/GuestNotifications";
import { createTransport } from "nodemailer";
import env from "../utils/envalid";
import { emailBookingRequestAccepted } from "../utils/emails/emailBookingRequestAccepted";
import { compareAsc } from "date-fns";
import { emailPendingServicePayment } from "../utils/emails/emailPendingServicePayment";

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
            "username email photoUrl emailVerified identityVerified mobileVerified mobilePhone educationalAttainment address work funFact mobilePhone userStatus",
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
      $or: [
        {
          status: "Active",
        },
        { status: "Inactive" },
      ],
    });

    if (!listingIsActive) {
      throw createHttpError(400, "Listing has been disabled by the host");
    }

    const bookingRequestAlreadyExist = await BookingRequests.findOne({
      guestID: id,
      hostID,
      listingID,
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

    await newHostNotification.populate([
      {
        path: "senderID",
        select: "username",
      },
      {
        path: "recipientID",
        select: "username",
      },
    ]);

    res.status(201).json({
      receiverName: (newHostNotification.recipientID as { username: string })
        .username,
    });
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
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
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
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
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
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
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
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
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
        (v.listingID as { serviceTitle: string }).serviceTitle
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
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
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
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
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
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
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

export const cancelBookingRequest: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { bookingRequestID } = req.params;
  const { guestCancelReasons } = req.body;
  try {
    if (!id) {
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
    }

    const bookingRequestIsPending = await BookingRequests.findOne({
      _id: bookingRequestID,
      status: "pending",
    });

    if (!bookingRequestIsPending) {
      return res.status(400).json({
        message: "Booking request cancellation failed.",
      });
    }

    await bookingRequestIsPending.updateOne({
      status: "cancelled",
      guestCancelReasons,
    });

    const cancelledBookingRequestNotification =
      await HostNotifications.findOneAndUpdate(
        {
          data: bookingRequestID,
        },
        {
          read: false,
          notificationType: "Booking-Cancelled",
        }
      ).populate({
        path: "recipientID",
        select: "username",
      });

    res.status(200).json({
      message: "Booking request has been cancelled.",
      receiverName: (
        cancelledBookingRequestNotification?.recipientID as {
          username: string;
        }
      ).username,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptBookingRequest: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { bookingRequestID } = req.params;
  const { receiverName } = req.body;
  const transport = createTransport({
    service: "gmail",
    auth: {
      user: env.ADMIN_EMAIL,
      pass: env.APP_PASSWORD,
    },
  });
  try {
    if (!id) {
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
    }

    const approvedBookingRequests = await BookingRequests.findByIdAndUpdate(
      bookingRequestID,
      {
        status: "approved",
      },
      {
        new: true,
      }
    ).populate([
      { path: "guestID", select: "email username" },
      { path: "listingID", select: "serviceTitle" },
    ]);

    const newReservation = await Reservations.create({
      guestID: approvedBookingRequests?.guestID,
      hostID: id,
      bookingStartsAt: approvedBookingRequests?.requestedBookingDateStartsAt,
      bookingEndsAt: approvedBookingRequests?.requestedBookingDateEndsAt,
      listingID: approvedBookingRequests?.listingID,
      status:
        compareAsc(
          approvedBookingRequests!.requestedBookingDateStartsAt,
          new Date().setHours(0, 0, 0, 0)
        ) > 0
          ? "scheduled"
          : "ongoing",
      paymentStatus: "pending",
      paymentAmount: approvedBookingRequests?.totalPrice,
    });

    await Listings.findByIdAndUpdate(approvedBookingRequests?.listingID, {
      $push: {
        reservedDates: newReservation?._id,
      },
    });

    await GuestNotifications.create({
      senderID: id,
      recipientID: approvedBookingRequests?.guestID,
      data: approvedBookingRequests?._id,
      notificationType: "Booking-Approved",
    });

    await Promise.all([
      transport.sendMail({
        to: (approvedBookingRequests?.guestID as { email: string }).email,
        subject: "Booking Request Update",
        html: emailBookingRequestAccepted(
          (approvedBookingRequests?.guestID as { username: string }).username
        ),
      }),
      transport.sendMail({
        to: (approvedBookingRequests?.guestID as { email: string }).email,
        subject: `Complete Your Service Payment for ${
          (approvedBookingRequests?.listingID as { serviceTitle: string })
            .serviceTitle
        }`,
        html: emailPendingServicePayment(
          (approvedBookingRequests?.guestID as { username: string }).username,
          (approvedBookingRequests?.listingID as { serviceTitle: string })
            .serviceTitle
        ),
      }),
    ]);

    res
      .status(201)
      .json({ bookingRequestID: approvedBookingRequests?._id, receiverName });
  } catch (error) {
    next(error);
  }
};

export const reAttemptBookingRequest: RequestHandler = async (
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

    const bookingReattemptIsValid = await BookingRequests.findOne({
      _id: bookingRequestID,
      requestedBookingDateStartsAt: {
        $lte: new Date().setHours(0, 0, 0, 0),
      },
    });

    if (bookingReattemptIsValid) {
      const reAttemptBookingRequest = await BookingRequests.findByIdAndUpdate(
        bookingRequestID,
        { status: "pending", guestCancelReasons: undefined }
      );
    }
  } catch (error) {
    next(error);
  }
};
