import { RequestHandler } from "express";
import { clearCookieAndThrowError } from "../utils/clearCookieAndThrowError";
import IdentityPhotos from "../models/IdentityPhotos";
import Users from "../models/Users";
import { createTransport } from "nodemailer";
import env from "../utils/envalid";
import { emailIdentityVerificationRequest } from "../utils/emails/emailIdentityVerificationRequest";

const transport = createTransport({
  service: "gmail",
  auth: {
    user: "aceguevarra48@gmail.com",
    pass: env.APP_PASSWORD,
  },
});

export const sendIdentityVerificationRequest: RequestHandler = async (
  req,
  res,
  next
) => {
  const id = req.cookies["_&!d"];
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
      from: user?.email,
      to: "aceguevarra48@gmail.com",
      subject: "IGotYou - Identity Verification Request Request",
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
