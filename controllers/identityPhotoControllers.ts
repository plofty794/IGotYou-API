import { RequestHandler } from "express";
import { clearCookieAndThrowError } from "../utils/clearCookieAndThrowError";
import IdentityPhotos from "../models/IdentityPhotos";
import Users from "../models/Users";
import { createTransport } from "nodemailer";
import env from "../utils/envalid";
import { emailIdentityVerificationRequest } from "../utils/emails/emailIdentityVerificationRequest";
import createHttpError from "http-errors";
import { emailIdentityVerificationRequestUpdate } from "../utils/emails/emailIdentityVerificationUpdate";

export const getIdentityVerificationRequests: RequestHandler = async (
  req,
  res,
  next
) => {
  const admin_id = req.cookies.admin_id;
  const limit = 10;
  const page = parseInt(req.params.page ?? "1") ?? 1;
  try {
    if (!admin_id) {
      throw createHttpError(401, "This action requires an identifier");
    }

    const pendingIdentityVerificationRequests = await IdentityPhotos.find({
      identityVerificationStatus: "pending",
    })
      .sort({ createdAt: "desc" })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate({ path: "user", select: "userStatus username email photoUrl" })
      .exec();

    const totalPages = Math.ceil(
      pendingIdentityVerificationRequests.length / limit
    );

    if (!pendingIdentityVerificationRequests.length) {
      return res
        .status(200)
        .json({ pendingIdentityVerificationRequests: [], totalPages: 0 });
    }

    res.status(200).json({ pendingIdentityVerificationRequests, totalPages });
  } catch (error) {
    next(error);
  }
};

export const sendIdentityVerificationRequest: RequestHandler = async (
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

    const identityPhoto = await IdentityPhotos.create({
      ...req.body,
      user: id,
      identityVerificationStatus: "pending",
    });

    await identityPhoto.populate({
      path: "user",
      select: ["username", "email"],
    });

    const user = await Users.findByIdAndUpdate(id, {
      identityVerificationStatus: "pending",
    });

    await transport.sendMail({
      to: "aceguevarra48@gmail.com",
      subject: "IGotYou - Identity Verification Request",
      html: emailIdentityVerificationRequest(
        user?.username!,
        user?.email!,
        new Date(identityPhoto?.createdAt!).toLocaleString()
      ),
    });

    res.status(201).json({ message: "Success" });
  } catch (error) {
    next(error);
  }
};

export const updatePendingIdentityVerificationRequest: RequestHandler = async (
  req,
  res,
  next
) => {
  const admin_id = req.cookies.admin_id;
  const { identityPhotoId } = req.params;
  const { identityVerificationStatus } = req.body;
  const transport = createTransport({
    service: "gmail",
    auth: {
      user: env.ADMIN_EMAIL,
      pass: env.APP_PASSWORD,
    },
  });
  try {
    if (!admin_id) {
      clearCookieAndThrowError(
        res,
        "A admin_id cookie is required to access this resource."
      );
    }

    const updatedIdentityRequest = await IdentityPhotos.findByIdAndUpdate(
      identityPhotoId,
      {
        identityVerificationStatus: req.body.identityVerificationStatus,
      }
    );

    const user = await Users.findByIdAndUpdate(req.body.userId, {
      identityVerificationStatus,
      identityVerified: identityVerificationStatus === "success" ? true : false,
    });

    await transport.sendMail({
      to: user?.email,
      subject: "IGotYou - Identity Verification Request Update",
      html: emailIdentityVerificationRequestUpdate(
        user?.username!,
        user?.email!,
        new Date(updatedIdentityRequest?.updatedAt!).toLocaleString(),
        identityVerificationStatus
      ),
    });

    res.status(200).json({ message: "Success" });
  } catch (error) {
    next(error);
  }
};
