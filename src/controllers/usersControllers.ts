import { isValidObjectId } from "mongoose";
import { RequestHandler } from "express";
import Users from "../models/Users";
import createHttpError from "http-errors";
import { clearCookieAndThrowError } from "../utils/clearCookieAndThrowError";
import Listings from "../models/Listings";

import BookingRequests from "../models/BookingRequests";
import { getAuth } from "firebase-admin/auth";

// export const getHosts: RequestHandler = async (req, res, next) => {
//   const id = req.cookies["_&!d"];
//   try {
//     if (!id) {
//       clearCookieAndThrowError(
//         res,
//         "A _id cookie is required to access this resource."
//       );
//     }

//     const hosts = await Listings.find({
//       $function: function () {
//         return (
//           new Date(this.availableAt).getTime() <= Date.now() &&
//           new Date(this.endsAt).getTime() >= Date.now()
//         );
//       },
//     }).populate("host");

//     if (!hosts.length) {
//       return res.status(200).json({ hosts: [] });
//     }
//     res.status(200).json({ hosts });
//   } catch (error) {
//     next(error);
//   }
// };

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

    const user = await Users.findById(id);

    if (!user) {
      throw createHttpError(400, "No user with that id");
    }

    const bookingRequests = await BookingRequests.find({ guestID: user._id })
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
      .populate(["listings", "bookingRequests"])
      .select("-password")
      .exec();

    if (!user) {
      res.clearCookie("_&!d");
      throw createHttpError(400, "No account with that id");
    }

    const activeListings = await Listings.find({
      host: user._id,
      endsAt: { $gte: new Date() },
    });

    res.status(200).json({ user, activeListings });
  } catch (error) {
    next(error);
  }
};

export const visitUserProfile: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await Users.findById(id)
      .populate("listings")
      .select("-password")
      .exec();

    if (!user) {
      throw createHttpError(400, "No account with that id");
    }
    res.status(200).json({ user });
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

export const addListingToWishlist: RequestHandler = async (req, res, next) => {
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
      $push: { wishlists: listingID },
    });

    res
      .status(201)
      .json({ message: "Success", listingName: listing.serviceDescription });
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

    res.status(201).json({ updateUser });
  } catch (error) {
    next(error);
  }
};

export const searchUsername: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { username } = req.params;
  let searchOptions = {
    username: new RegExp("", "gi"),
  };
  if (username != null) {
    searchOptions.username = new RegExp(`^${username}`, "gi");
  }
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const userDetails = await Users.find(searchOptions)
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
      throw createHttpError(400, "No data to be processed.");
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
  console.log(req.cookies);
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

// declare module "express-serve-static-core" {
//   interface Request {
//     ipinfo?: {};
//     user?: {};
//     token: { decodedToken: DecodedIdToken };
//   }
// }
