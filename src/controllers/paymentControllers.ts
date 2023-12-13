import { RequestHandler } from "express";
import Payments from "../models/Payments";
import createHttpError from "http-errors";
import Users from "../models/Users";
import { addDays } from "date-fns";
import { clearCookieAndThrowError } from "../utils/clearCookieAndThrowError";
import Notifications from "../models/Notifications";
import { createTransport } from "nodemailer";
import env from "../utils/envalid";

const transport = createTransport({
  service: "gmail",
  auth: {
    user: "aceguevarra48@gmail.com",
    pass: env.APP_PASSWORD,
  },
});

const mailDetails = {
  from: "aceguevarra48@gmail.com",
  to: "aceguevarra48@gmail.com",
  subject: "Test mail",
  text: "Node.js testing mail for GeeksforGeeks",
};

export const getVerifiedPayments: RequestHandler = async (req, res, next) => {
  const admin_id = req.cookies.admin_id;
  const limit = 10;
  const page = parseInt(req.params.page ?? "1") ?? 1;
  try {
    if (!admin_id) {
      res.clearCookie("admin_id");
      throw createHttpError(
        401,
        "A _id cookie is required to access this resource."
      );
    }
    const totalPayments = await Payments.countDocuments();
    const totalPages = Math.ceil(totalPayments / limit);
    const verifiedPayments = await Payments.find({
      paymentStatus: "success",
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user")
      .exec();

    if (!verifiedPayments.length) {
      return res.status(200).json({ verifiedPayments: null, totalPages: 0 });
    }
    res.status(200).json({ verifiedPayments, totalPages });
  } catch (error) {
    next(error);
  }
};

export const getPendingPayments: RequestHandler = async (req, res, next) => {
  const admin_id = req.cookies.admin_id;
  const limit = 10;
  const page = parseInt(req.params.page ?? "1") ?? 1;
  try {
    if (!admin_id) {
      res.clearCookie("admin_id");
      throw createHttpError(
        401,
        "A _id cookie is required to access this resource."
      );
    }
    const totalPayments = await Payments.countDocuments();
    const totalPages = Math.ceil(totalPayments / limit);
    const pendingPayments = await Payments.find({
      paymentStatus: "pending",
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user")
      .exec();

    if (!pendingPayments.length) {
      return res.status(200).json({ pendingPayments: null, totalPages: 0 });
    }
    res.status(200).json({ pendingPayments, totalPages });
  } catch (error) {
    next(error);
  }
};

export const sendPaymentProof: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  try {
    if (!id) {
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
    }
    const paymentProof = await (
      await Payments.create({ ...req.body, paymentStatus: "pending", user: id })
    ).populate("user");
    const updatedUserSubscription = await Users.findByIdAndUpdate(id, {
      ...req.body,
    });
    res.status(201).json({ paymentProof, updatedUserSubscription });
  } catch (error) {
    next(error);
  }
};

type TPaymentStatus = {
  paymentStatus: "success" | "pending" | "reject";
  _id: string;
};

export const updatePaymentProofStatus: RequestHandler = async (
  req,
  res,
  next
) => {
  const admin_id = req.cookies.admin_id;
  const { paymentStatus, _id }: TPaymentStatus = req.body;
  try {
    if (!admin_id) {
      res.clearCookie("admin_id");
      throw createHttpError(
        401,
        "A _id cookie is required to access this resource."
      );
    }
    if (paymentStatus === "success") {
      const paymentSuccess = await Payments.findByIdAndUpdate(_id, {
        ...req.body,
      });
      const updatedUserSubscription = await Users.findByIdAndUpdate(
        paymentSuccess?.user,
        {
          subscriptionStatus: "active",
          subscriptionExpiresAt: addDays(Date.now(), 30),
          userStatus: "host",
        }
      );
      return res.status(200).json({ paymentSuccess, updatedUserSubscription });
    }
    if (paymentStatus === "reject") {
      const paymentReject = await Payments.findByIdAndUpdate(_id, {
        paymentStatus: "reject",
      });
      const updatedUserSubscription = await Users.findByIdAndUpdate(
        paymentReject?.user,
        {
          subscriptionStatus: "reject",
        }
      );
      return res.status(200).json({ paymentReject, updatedUserSubscription });
    }
  } catch (error) {
    next(error);
  }
};

export const sendPaymentNotificationStatus = async (data: any) => {
  const userID = await Users.findOne({ username: data.username });
  console.log(data);
  const newNotification = await Notifications.create({
    notificationType: "Subscription-Status",
    toUserID: userID?._id,
    fromAdmin: data.adminID,
    paymentStatus: data.status,
  });

  await newNotification.populate({
    select: ["username", "photoUrl"],
    path: "fromAdmin",
  });

  await userID?.updateOne({
    $push: {
      notifications: newNotification._id,
    },
  });

  return { newNotification };
};
