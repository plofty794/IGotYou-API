import { RequestHandler } from "express";
import SubscriptionPayments from "../models/SubscriptionPayments";
import createHttpError from "http-errors";
import Users from "../models/Users";
import { addDays } from "date-fns";
import { clearCookieAndThrowError } from "../utils/clearCookieAndThrowError";
import Notifications from "../models/GuestNotifications";
import { createTransport } from "nodemailer";
import env from "../utils/envalid";
import { emailPaymentSuccess } from "../utils/emails/emailPaymentSuccess";
import { emailPaymentReject } from "../utils/emails/emailPaymentReject";
import { emailSubscriptionRequest } from "../utils/emails/emailSubscriptionRequest";

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
    const totalPayments = await SubscriptionPayments.countDocuments();
    const totalPages = Math.ceil(totalPayments / limit);
    const verifiedPayments = await SubscriptionPayments.find({
      paymentStatus: "success",
    })
      .sort({ createdAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "user",
        select:
          "email username subscriptionExpiresAt identityVerified emailVerified mobileVerified",
      })
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
    const totalPayments = await SubscriptionPayments.countDocuments();
    const totalPages = Math.ceil(totalPayments / limit);
    const pendingPayments = await SubscriptionPayments.find({
      paymentStatus: "pending",
    })
      .sort({ createdAt: "desc" })
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

export const sendSubscriptionPayment: RequestHandler = async (
  req,
  res,
  next
) => {
  const id = req.cookies["_&!d"];
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

    const payment = await SubscriptionPayments.create({
      ...req.body,
      user: id,
    });

    await payment.populate({ path: "user", select: ["username", "email"] });

    const user = await Users.findByIdAndUpdate(id, {
      ...req.body,
    });

    await transport.sendMail({
      from: user?.email,
      to: "aceguevarra48@gmail.com",
      subject: "IGotYou - Subscription Request",
      html: emailSubscriptionRequest(
        user?.username!,
        user?.email!,
        new Date(payment?.createdAt!).toLocaleString()
      ),
    });

    res.status(201).json({ message: "Success" });
  } catch (error) {
    next(error);
  }
};

type TPaymentStatus = {
  paymentStatus: "success" | "pending" | "reject";
  _id: string;
};

export const searchUsernameVerifiedPayment: RequestHandler = async (
  req,
  res,
  next
) => {
  const admin_id = req.cookies.admin_id;
  const { username } = req.params;
  let searchOptions = {
    username: new RegExp("", "gi"),
  };
  if (username != null) {
    searchOptions.username = new RegExp(`${username}`, "gi");
  }
  try {
    if (!admin_id) {
      res.clearCookie("admin_id");
      throw createHttpError(
        401,
        "A _id cookie is required to access this resource."
      );
    }

    const user = await Users.findOne(searchOptions);

    const verifiedPayments = await SubscriptionPayments.find({
      paymentStatus: "success",
      user: user?._id,
    }).populate({
      path: "user",
      select:
        "email username subscriptionExpiresAt identityVerified emailVerified mobileVerified",
    });

    res.status(200).json({ verifiedPayments });
  } catch (error) {
    next(error);
  }
};

export const updateSubscriptionPhotosStatus: RequestHandler = async (
  req,
  res,
  next
) => {
  const admin_id = req.cookies.admin_id;
  const { paymentStatus, _id }: TPaymentStatus = req.body;
  const transport = createTransport({
    service: "gmail",
    auth: {
      user: env.ADMIN_EMAIL,
      pass: env.APP_PASSWORD,
    },
  });
  try {
    if (!admin_id) {
      res.clearCookie("admin_id");
      throw createHttpError(
        401,
        "A _id cookie is required to access this resource."
      );
    }
    if (paymentStatus === "success") {
      const paymentSuccess = await SubscriptionPayments.findByIdAndUpdate(_id, {
        ...req.body,
      });
      const updatedUserSubscription = await Users.findByIdAndUpdate(
        paymentSuccess?.user,
        {
          identityVerified: true,
          subscriptionStatus: "active",
          subscriptionExpiresAt: addDays(Date.now(), 30),
          userStatus: "host",
        },
        { new: true }
      );
      await transport.sendMail({
        from: "aceguevarra48@gmail.com",
        to: updatedUserSubscription?.email,
        subject: "IGotYou - Subscription Payment Update",
        html: emailPaymentSuccess(
          updatedUserSubscription?.username!,
          new Date(
            updatedUserSubscription?.subscriptionExpiresAt!
          ).toDateString()
        ),
      });
      return res.status(200).json({ paymentSuccess });
    }
    if (paymentStatus === "reject") {
      const paymentReject = await SubscriptionPayments.findByIdAndUpdate(_id, {
        paymentStatus: "reject",
      });
      const updatedUserSubscription = await Users.findByIdAndUpdate(
        paymentReject?.user,
        {
          subscriptionStatus: "reject",
        },
        { new: true }
      );
      await transport.sendMail({
        from: "aceguevarra48@gmail.com",
        to: updatedUserSubscription?.email,
        subject: "IGotYou - Subscription Payment Update",
        html: emailPaymentReject(
          updatedUserSubscription?.username!,
          new Date(
            updatedUserSubscription?.subscriptionExpiresAt!
          ).toDateString()
        ),
      });

      return res.status(200).json({ paymentReject });
    }
  } catch (error) {
    next(error);
  }
};
