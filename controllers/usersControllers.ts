import { isValidObjectId } from "mongoose";
import { RequestHandler } from "express";
import Users from "../models/Users";
import createHttpError from "http-errors";
import { clearCookieAndThrowError } from "../utils/clearCookieAndThrowError";
import Listings from "../models/Listings";
import { getAuth } from "firebase-admin/auth";
import BlockedUsers from "../models/BlockedUsers";
import BlockedDates from "../models/BlockedDates";
import Ratings from "../models/Ratings";
import Reservations from "../models/Reservations";
import Reports from "../models/Reports";
import { emailReportUser } from "../utils/emails/emailReportUser";
import { createTransport } from "nodemailer";
import env from "../utils/envalid";

export const getUserPhone: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  try {
    if (!id) {
      if (!id) {
        clearCookieAndThrowError(
          res,
          "A _id cookie is required to access this resource."
        );
      }
    }
    const user = await Users.findById(id);
    if (!user) {
      throw createHttpError(400, "No account with that id");
    }
    res.status(200).json({ user: { mobilePhone: user.mobilePhone } });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUserProfile: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }
    const user = await Users.findById(id)
      .populate("rating")
      .select("-password")
      .exec();

    if (!user) {
      res.clearCookie("_&!d");
      throw createHttpError(400, "No account with that id");
    }

    const recentListings = await Listings.find({
      host: user._id,
    })
      .sort({ createdAt: "desc" })
      .limit(5)
      .exec();

    res.status(200).json({ user, recentListings });
  } catch (error) {
    next(error);
  }
};

export const visitUserProfile: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { userID } = req.params;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const isBlocker = await BlockedUsers.findOne({
      blockedID: userID,
      blockerID: id,
    });

    const isBlocked = await BlockedUsers.findOne({
      blockedID: id,
      blockerID: userID,
    });

    if (isBlocked) {
      throw createHttpError(403, "Forbidden");
    }

    const user = await Users.findById(userID)
      .select(
        "-password -providerId -uid -hostNotifications -guestNotifications -subscriptionStatus -bookingRequests -wishlists -identityVerificationStatus"
      )
      .populate([
        {
          path: "listings",
          select: "listingAssets serviceTitle serviceType",
          options: {
            limit: 10,
          },
        },
        {
          path: "rating",
          populate: [
            {
              path: "guestID",
              select: "username email",
            },
            {
              path: "hostID",
              select: "username email",
            },
          ],
          options: {
            limit: 10,
          },
        },
      ])
      .sort({ createdAt: "desc" })
      .exec();

    if (!user) {
      throw createHttpError(400, "No account with that id");
    }

    res.status(200).json({ user, isBlocker: isBlocker != null });
  } catch (error) {
    next(error);
  }
};

export const getWishlists: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const wishlists = await Users.findById(id)
      .select("wishlists")
      .populate({
        path: "wishlists",
        select: ["listingAssets", "host", "serviceTitle", "serviceType"],
        populate: {
          path: "host",
          select: "username",
        },
      });

    res.status(200).json({ wishlists: wishlists?.wishlists });
  } catch (error) {
    next(error);
  }
};

export const updateWishlist: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { listingID } = req.body;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }
    const listing = await Listings.findById(listingID);

    if (!listing) {
      return res.status(400).json({ message: "Something went wrong." });
    }

    const listingAlreadyInWishlist = await Users.findOne({
      _id: id,
      wishlists: {
        $in: listingID,
      },
    });

    if (listingAlreadyInWishlist) {
      const listingRemovedFromWishlist = await Users.findByIdAndUpdate(id, {
        $pull: {
          wishlists: listingID,
        },
      });
      return res.status(200).json({ listingRemovedFromWishlist });
    }

    await Users.findByIdAndUpdate(id, {
      $push: {
        wishlists: {
          $each: [listingID],
          $position: 0,
        },
      },
    });

    res
      .status(201)
      .json({ message: "Success", listingName: listing.serviceTitle });
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }
    const user = await Users.findByIdAndUpdate(id, { ...req.body });
    if (!user) {
      throw createHttpError(400, "Error updating user");
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { emailVerified } = req.body;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }
    await Users.findByIdAndUpdate(id, {
      emailVerified,
    });

    res.status(200).json({ message: "Email status has been updated" });
  } catch (error) {
    next(error);
  }
};

export const updateUserEmail: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { email, uid } = req.body;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }
    const userRecord = await getAuth().updateUser(uid, {
      email,
      emailVerified: false,
    });

    const updatedUser = await Users.findByIdAndUpdate(id, {
      email: userRecord.email,
      emailVerified: userRecord.emailVerified,
    });

    res.status(201).json({ updatedUser });
  } catch (error) {
    next(error);
  }
};

export const searchUsername: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { username } = req.params;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const userDetails = await Users.find({
      _id: {
        $ne: id,
      },
      username: {
        $regex: username,
        $options: "mi",
      },
    })
      .select("username _id photoUrl email")
      .exec();

    res.status(200).json({ userDetails });
  } catch (error) {
    next(error);
  }
};

export const checkUserEmail: RequestHandler = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      throw createHttpError(400, "Email is required");
    }
    const user = await Users.findOne({ email: email });
    if (!user) {
      throw createHttpError(400, "No user with that email.");
    }
    if (!user.emailVerified) {
      throw createHttpError(400, "Email is not verified.");
    }
    res.status(200).json({ email: user.email });
  } catch (error) {
    next(error);
  }
};

// export const userSubscription: RequestHandler = async (req, res, next) => {
//   const id = req.headers.cookie?.split("_&!d=")[1];
//   try {
//     if (!id) {
//       res.clearCookie("_&!d");
//       throw createHttpError(
//         400,
//         "A _id cookie is required to access this resource."
//       );
//     }
//     const user = await Users.findByIdAndUpdate(id, {
//       ...req.body,
//     });
//     if (!user) {
//       res.clearCookie("_&!d");
//       throw createHttpError(400, "No user to mutate");
//     }
//     res.status(201).json({ user });
//   } catch (error) {
//     next(error);
//   }
// };

type TCreateUser = {
  username?: string;
  email?: string;
  password?: string;
  providerId?: string;
};

export const createUser: RequestHandler = async (req, res, next) => {
  const { email }: TCreateUser = req.body;
  try {
    const userExist = await Users.findOne({ email }).select("+username").exec();
    if (userExist) {
      throw createHttpError(400, "Username/Email already exist");
    }
    const newUser = await Users.create({ ...req.body });
    const { _id, username, uid } = newUser;
    res.cookie("_&!d", newUser._id.toString(), { httpOnly: true });
    res.status(201).json({ user: { _id, username, uid } });
  } catch (error) {
    next(error);
  }
};

type TUserLogIn = {
  email?: string;
  password?: string;
};

export const logInUser: RequestHandler = async (req, res, next) => {
  const { email, password }: TUserLogIn = req.body;
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      throw createHttpError(400, "Email doesn't exist");
    }
    if (user.providerId === "password") {
      user.password = password;
      await user.save();
    }
    res.cookie("_&!d", user._id.toString(), { httpOnly: true });
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

type TGoogleSignIn = {
  username: string;
  email: string;
  providerId: string;
  emailVerified: boolean;
};

export const googleSignIn: RequestHandler = async (req, res, next) => {
  const { email }: TGoogleSignIn = req.body;
  try {
    const userExist = await Users.findOne({ email });
    if (userExist) {
      res.cookie("_&!d", userExist._id.toString(), { httpOnly: true });
      return res.status(200).json({
        user: {
          _id: userExist._id,
          username: userExist.username,
          uid: userExist.uid,
        },
      });
    }
    const newUser = await Users.create({ ...req.body });

    res.cookie("_&!d", newUser._id.toString(), { httpOnly: true });
    res
      .status(201)
      .json({ user: { _id: newUser._id, username: newUser.username } });
  } catch (error) {
    next(error);
  }
};

export const logOutUser: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }
    const userExist = await Users.findById(id);
    if (!userExist) {
      throw createHttpError(400, "No user with that id");
    }
    res.clearCookie("_&!d", { httpOnly: true });
    res.status(200).json({ message: "User has been logged out" });
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!isValidObjectId(id)) {
      throw createHttpError(401, "Invalid userID");
    }
    const user = await Users.findByIdAndDelete(id);
    if (!user) {
      throw createHttpError(400, "User doesn't exist");
    }
    res.status(201).json({ message: "User has been removed" });
  } catch (error) {
    next(error);
  }
};

export const getBlockedDates: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const blockedDates = await BlockedDates.find({ user: id });

    const subscriptionExpiresAt = await Users.findById(id).select(
      "subscriptionExpiresAt"
    );

    res.status(201).json({
      blockedDates: blockedDates.flatMap((dates) => dates.blockedDates),
      subscriptionExpiresAt,
    });
  } catch (error) {
    next(error);
  }
};

export const changeAvailability: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { sortedDates } = req.body;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const sortedDatesAreBlocked = await BlockedDates.findOne({
      user: id,
      blockedDates: {
        $in: sortedDates,
      },
    });

    if (sortedDatesAreBlocked) {
      await BlockedDates.findOneAndDelete({
        user: id,
        blockedDates: {
          $in: sortedDates,
        },
      });
      return res
        .status(200)
        .json({ message: "Date availability has been updated." });
    }

    await BlockedDates.create({
      user: id,
      blockedDates: sortedDates,
    });

    res.status(201).json({ message: "Selected dates has been blocked." });
  } catch (error) {
    next(error);
  }
};

export const rateUser: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { reservationID, hostID, guestID } = req.body;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const hostRatingExist = await Ratings.findOne({
      reservationID,
      hostID,
      guestID,
      hostFeedback: req.body.hostFeedback,
      hostRating: req.body.hostRating,
    });

    if (hostRatingExist) {
      throw createHttpError(400, "You've already rated this guest.");
    }

    const guestRatingExist = await Ratings.findOne({
      reservationID,
      hostID,
      guestID,
      guestFeedback: req.body.guestFeedback,
      guestRating: req.body.guestRating,
    });

    if (guestRatingExist) {
      throw createHttpError(400, "You've already rated this host.");
    }

    const reservationOngoing = await Reservations.findOne({
      _id: reservationID,
      confirmServiceEnded: false,
    });

    if (reservationOngoing) {
      throw createHttpError(
        400,
        "Ratings takes effect once the guest marks it as complete."
      );
    }

    const newRating = await Ratings.create({
      hostID,
      guestID,
      reservationID,
      ...req.body,
    });

    if (req.body.guestFeedback) {
      await Users.findByIdAndUpdate(hostID, {
        $push: {
          rating: [newRating._id],
        },
      });
    } else {
      await Users.findByIdAndUpdate(guestID, {
        $push: {
          rating: [newRating._id],
        },
      });
    }

    res.status(200).json({ message: "Service review has been sent." });
  } catch (error) {
    next(error);
  }
};

export const getHostReviews: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const limit = 10;
  const page = parseInt(req.params.page ?? "1") ?? 1;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const hostRatings = await Ratings.find({
      hostID: id,
      $and: [
        {
          guestFeedback: {
            $ne: null,
          },
        },
        {
          guestRating: {
            $ne: null,
          },
        },
      ],
    })
      .populate([
        { path: "guestID", select: "username email photoUrl" },
        {
          path: "reservationID",
          populate: {
            path: "listingID",
            select: "serviceTitle",
          },
        },
      ])
      .sort({ createdAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    res.status(200).json({ hostRatings });
  } catch (error) {
    next(error);
  }
};

export const getGuestReviews: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const limit = 10;
  const page = parseInt(req.params.page ?? "1") ?? 1;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const hostRatings = await Ratings.find({
      guestID: id,
    })
      .populate([
        { path: "hostID", select: "username email photoUrl" },
        {
          path: "reservationID",
          populate: {
            path: "listingID",
            select: "serviceTitle",
          },
        },
      ])
      .sort({ createdAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    res.status(200).json({ hostRatings });
  } catch (error) {
    next(error);
  }
};

export const submitReport: RequestHandler = async (req, res, next) => {
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
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const reporterName = await Users.findById(id).select("username email");

    const reportExist = await Reports.findOne({
      reporter: id,
      reportedUser: req.body.reportedUser,
    });

    if (reportExist) {
      throw createHttpError(400, "You've already reported this user.");
    }

    const newReport = await Reports.create({
      ...req.body,
      reporter: id,
    });

    await newReport.populate({
      path: "reportedUser",
      select: "email username",
    });

    await Users.findByIdAndUpdate(req.body.reportedUser, {
      $push: {
        reports: [newReport._id],
      },
    });

    await transport.sendMail({
      to: env.ADMIN_EMAIL,
      subject: "IGotYou - Important User Report",
      html: emailReportUser(
        reporterName.email,
        reporterName.username,
        (newReport.reportedUser as { username: string }).username,
        req.body.reason,
        req.body.evidence.secure_url
      ),
    });

    return res.status(200).json({ message: "Report has been submitted." });
  } catch (error) {
    next(error);
  }
};
