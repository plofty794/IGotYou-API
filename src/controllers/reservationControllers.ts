import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Reservations from "../models/Reservations";
import Ratings from "../models/Ratings";
import BookingRequests from "../models/BookingRequests";
import HostNotifications from "../models/HostNotifications";
import { createTransport } from "nodemailer";
import env from "../utils/envalid";

export const getCurrentReservation: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const currentReservation = await Reservations.findOneAndUpdate(
      {
        hostID: id,
        confirmServiceEnded: false,
        $and: [
          {
            bookingStartsAt: {
              $lte: new Date().setHours(0, 0, 0, 0),
            },
          },
          {
            bookingEndsAt: {
              $gte: new Date().setHours(0, 0, 0, 0),
            },
          },
        ],
      },
      { status: "ongoing" }
    )
      .populate([
        { path: "guestID", select: "username email" },
        {
          path: "listingID",
          select: "serviceTitle serviceType listingAssets cancellationPolicy ",
        },
      ])
      .exec();

    res.status(200).json({
      currentReservation:
        currentReservation != null ? [currentReservation] : [],
    });
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
      bookingStartsAt: {
        $gt: new Date(),
      },
    })
      .populate([
        { path: "guestID", select: "username email" },
        {
          path: "listingID",
          select: "serviceTitle serviceType listingAssets cancellationPolicy",
        },
      ])
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const totalPages = Math.ceil(upcomingReservations.length / limit);

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
        $lt: new Date().setHours(0, 0, 0, 0),
      },
    })
      .populate([
        { path: "guestID", select: "username email" },
        {
          path: "listingID",
          select: "serviceTitle serviceType listingAssets cancellationPolicy",
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

export const getReservations: RequestHandler = async (req, res, next) => {
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

    await Reservations.updateMany(
      {
        bookingEndsAt: {
          $lt: new Date().setHours(0, 0, 0, 0),
        },
        status: "ongoing",
        confirmServiceEnded: false,
      },
      {
        status: "completed",
      }
    );

    const allReservations = await Reservations.find({
      hostID: id,
    })
      .populate([
        { path: "guestID", select: "username email mobilePhone" },
        {
          path: "listingID",
          select: "serviceTitle serviceType listingAssets cancellationPolicy",
        },
      ])
      .sort({ bookingStartsAt: "desc" })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const totalPages = allReservations.length / limit;

    res.status(200).json({ allReservations, totalPages });
  } catch (error) {
    next(error);
  }
};

export const getCurrentReservationDetails: RequestHandler = async (
  req,
  res,
  next
) => {
  const id = req.cookies["_&!d"];
  const { reservationID } = req.params;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const reservationDetails = await Reservations.findById(
      reservationID
    ).populate([
      {
        path: "hostID",
        select:
          "username email photoUrl emailVerified identityVerified mobileVerified mobilePhone educationalAttainment address work funFact mobilePhone userStatus rating",
      },
      {
        path: "guestID",
        select:
          "username email photoUrl emailVerified identityVerified mobileVerified mobilePhone educationalAttainment address work funFact mobilePhone userStatus rating",
      },
      {
        path: "listingID",
        select:
          "serviceTitle serviceType listingAssets cancellationPolicy price",
      },
    ]);

    if (!reservationDetails) {
      throw createHttpError(400, "No reservation with that ID.");
    }

    const hasRating = await Ratings.findById(reservationID);

    res.status(200).json({
      reservationDetails,
      isHost: (reservationDetails.hostID as { _id: string })._id == id,
      hasRating: hasRating ?? null,
    });
  } catch (error) {
    next(error);
  }
};

export const sendReservationPaymentToAdmin: RequestHandler = async (
  req,
  res,
  next
) => {
  const id = req.cookies["_&!d"];
  const { reservationID } = req.params;
  const { paymentType } = req.body;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    if (paymentType === "partial-payment") {
      const hasPreviousPartialPayment = await Reservations.findOne({
        _id: reservationID,
        paymentType: "partial-payment",
      });

      if (hasPreviousPartialPayment) {
        await hasPreviousPartialPayment.updateOne({
          fullPaymentAmount: req.body.expectedPaymentAmount,
          fullPaymentDate: new Date(),
          fullPaymentProofPhoto: req.body.paymentProofPhoto,
          fullPaymentRefNo: req.body.paymentRefNo,
          fullPaymentVerificationStatus: "pending",
        });

        return res
          .status(201)
          .json({ message: "Partial payment has been sent." });
      }

      await Reservations.findByIdAndUpdate(reservationID, {
        partialPaymentVerificationStatus: "pending",
        partialPaymentAmount: req.body.expectedPaymentAmount,
        partialPaymentDate: new Date(),
        paymentType: "partial-payment",
        partialPaymentProofPhoto: req.body.paymentProofPhoto,
        partialPaymentRefNo: req.body.paymentRefNo,
      });

      return res
        .status(201)
        .json({ message: "Partial payment has been sent." });
    }

    await Reservations.findByIdAndUpdate(reservationID, {
      fullPaymentVerificationStatus: "pending",
      fullPaymentAmount: req.body.expectedPaymentAmount,
      fullPaymentDate: new Date(),
      paymentType: "full-payment",
      fullPaymentProofPhoto: req.body.paymentProofPhoto,
      fullPaymentRefNo: req.body.paymentRefNo,
    });

    return res.status(201).json({ message: "Full payment has been sent." });
  } catch (error) {
    next(error);
  }
};

export const getPendingServicePayments: RequestHandler = async (
  req,
  res,
  next
) => {
  const page = parseInt(req.params.page ?? "1") ?? 1;
  const limit = 10;
  const admin_id = req.cookies.admin_id;
  try {
    if (!admin_id) {
      throw createHttpError(401, "This action requires an identifier");
    }

    const pendingServicePayments = await Reservations.find({
      $or: [
        { partialPaymentVerificationStatus: "pending" },
        { fullPaymentVerificationStatus: "pending" },
      ],
    })
      .populate([
        {
          path: "hostID",
          select:
            "username email photoUrl emailVerified identityVerified mobileVerified mobilePhone educationalAttainment address work funFact mobilePhone userStatus rating",
        },
        {
          path: "guestID",
          select:
            "username email photoUrl emailVerified identityVerified mobileVerified mobilePhone educationalAttainment address work funFact mobilePhone userStatus rating",
        },
        {
          path: "listingID",
          select:
            "serviceTitle serviceType listingAssets cancellationPolicy price",
        },
      ])
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const totalPages = Math.ceil(pendingServicePayments.length / limit);

    res.status(200).json({ pendingServicePayments, totalPages });
  } catch (error) {
    next(error);
  }
};

export const updatePendingServicePayment: RequestHandler = async (
  req,
  res,
  next
) => {
  const admin_id = req.cookies.admin_id;
  const { reservationID } = req.params;
  const {
    paymentType,
    paymentStatus,
    partialPaymentVerificationStatus,
    fullPaymentVerificationStatus,
    status,
  } = req.body;
  try {
    if (!admin_id) {
      throw createHttpError(401, "This action requires an identifier");
    }

    const reservation = await Reservations.findById(reservationID);

    if (
      paymentType === "partial-payment" &&
      paymentStatus === "pending" &&
      partialPaymentVerificationStatus === "pending" &&
      status === "success"
    ) {
      await Reservations.findByIdAndUpdate(reservationID, {
        partialPaymentVerificationStatus: "success",
        paymentStatus: "partially-paid",
        balance: reservation!.paymentAmount / 2,
      });

      return res
        .status(201)
        .json({ message: "Partial payment has been verified." });
    }

    if (
      paymentType === "partial-payment" &&
      paymentStatus === "partially-paid" &&
      partialPaymentVerificationStatus === "success" &&
      status === "success"
    ) {
      await Reservations.findByIdAndUpdate(reservationID, {
        fullPaymentVerificationStatus: "success",
        paymentStatus: "fully-paid",
        balance: 0,
      });

      return res
        .status(201)
        .json({ message: "Partial payment has been verified." });
    }

    if (
      paymentType === "full-payment" &&
      paymentStatus === "pending" &&
      fullPaymentVerificationStatus === "pending" &&
      status === "success"
    ) {
      await Reservations.findByIdAndUpdate(reservationID, {
        fullPaymentVerificationStatus: "success",
        paymentStatus: "fully-paid",
        balance: 0,
      });

      return res
        .status(201)
        .json({ message: "Partial payment has been verified." });
    }
  } catch (error) {
    next(error);
  }
};

export const requestServiceCancellation: RequestHandler = async (
  req,
  res,
  next
) => {
  const id = req.cookies["_&!d"];
  const { reservationID } = req.params;
  const { guestCancelReasons } = req.body;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const reservation = await BookingRequests.findOne({ reservationID });

    if (!reservation) {
      throw createHttpError(400, "No reservation with that ID");
    }

    const newServiceCancellationRequest = await BookingRequests.create({
      guestID: id,
      hostID: reservation?.hostID,
      type: "Service-Cancellation-Request",
      guestCancelReasons,
      listingID: reservation?.listingID,
      reservationID,
    });

    const newHostNotification = await HostNotifications.create({
      senderID: id,
      recipientID: reservation?.hostID,
      notificationType: "Service-Cancellation-Request",
      data: newServiceCancellationRequest?._id,
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

export const confirmServiceEnded: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { reservationID } = req.params;
  const transport = createTransport({
    service: "gmail",
    auth: {
      user: env.ADMIN_EMAIL,
      pass: env.APP_PASSWORD,
    },
  });

  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    await Reservations.findByIdAndUpdate(reservationID, {
      confirmServiceEnded: true,
    });

    res.status(200).json({ message: "Service is now confirmed done." });
  } catch (error) {
    next(error);
  }
};
