import cloudinary from "cloudinary";
import env from "../utils/envalid";
import { RequestHandler } from "express";
import Listings from "../models/Listings";
import Users from "../models/Users";
import createHttpError from "http-errors";
import { clearCookieAndThrowError } from "../utils/clearCookieAndThrowError";
import { addDays } from "date-fns";

cloudinary.v2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

type TFileType = {
  public_id: string;
  secure_url: string;
  original_filename: string;
};

export const getHostListings: RequestHandler = async (req, res, next) => {
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

    await Listings.updateMany(
      {
        endsAt: {
          $lte: new Date(),
        },
      },
      { status: "Ended" }
    );

    const hostListings = await Listings.find({
      host: id,
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: "desc" })
      .exec();

    const totalPages = Math.ceil(hostListings.length / limit);

    if (!hostListings.length) {
      return res.status(200).json({ hostListings: [], totalPages: 0 });
    }

    res.status(200).json({ hostListings, totalPages });
  } catch (error) {
    next(error);
  }
};

export const getListings: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const limit = 12;
  const page = parseInt(req.params.page ?? "1") ?? 1;
  try {
    if (!id) {
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
    }

    const listings = await Listings.find({
      availableAt: { $lte: new Date() },
      endsAt: { $gte: new Date() },
      status: "Active",
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "host",
        match: {
          subscriptionExpiresAt: {
            $gte: new Date(),
          },
        },
      })
      .sort({ createdAt: "desc" })
      .exec();

    const totalPages = Math.ceil(listings.length / limit);

    if (!listings.length) {
      return res.status(200).json({ listings: [], totalPages: 0 });
    }

    res.status(200).json({ listings, totalPages });
  } catch (error) {
    next(error);
  }
};

export const getListingsPerCategory: RequestHandler = async (
  req,
  res,
  next
) => {
  const id = req.cookies["_&!d"];
  const limit = 12;
  const page = parseInt(req.params.page ?? "1") ?? 1;
  const category = req.params.category;

  try {
    if (!id) {
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
    }

    const categorizedListings = await Listings.find({
      serviceType: category,
      availableAt: { $lte: new Date() },
      endsAt: { $gte: new Date() },
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "host",
        match: {
          subscriptionExpiresAt: {
            $gte: new Date(),
          },
        },
      })
      .sort({ created_At: "desc" })
      .exec();

    if (!categorizedListings.length) {
      return res.status(200).json({ categorizedListings: [], totalPages: 0 });
    }
    const totalPages = Math.ceil(categorizedListings.length / limit);
    res.status(200).json({ categorizedListings, totalPages });
  } catch (error) {
    next(error);
  }
};

export const getUserListing: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw createHttpError(400, "Invalid listing id");
    }
    const listing = await Listings.findById(id).populate({
      path: "host",
      select: "username photoUrl rating subscriptionExpiresAt",
    });
    res.status(200).json({ listing });
  } catch (error) {
    next(error);
  }
};

export const addListing: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  try {
    if (!id) {
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
    }

    const newListing = await Listings.create({
      ...req.body,
      availableAt: new Date(req.body.date.from),
      endsAt: new Date(req.body.date.to),
      host: id,
    });

    await newListing.populate({ path: "host", select: "email" });

    if (!newListing) {
      throw createHttpError(400, "Error creating a listing");
    }

    await Users.findByIdAndUpdate(
      id,
      {
        $push: {
          listings: newListing._id,
        },
      },
      { new: true }
    );
    res.status(200).json({ newListingID: newListing._id });
  } catch (error) {
    next(error);
  }
};

export const renewListing: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { listingID } = req.params;
  const { listingDuration } = req.body;
  try {
    if (!id) {
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
    }

    await Listings.findByIdAndUpdate(listingID, {
      availableAt: new Date().setHours(0, 0, 0, 0),
      endsAt: addDays(new Date().setHours(0, 0, 0, 0), listingDuration),
      status: "Active",
    });

    res.status(201).json({ message: "Listing has been renewed" });
  } catch (error) {
    next(error);
  }
};

export const disableListing: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { listingID } = req.params;
  try {
    if (!id) {
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
    }

    await Listings.findByIdAndUpdate(listingID, {
      status: "Inactive",
    });

    res.status(201).json({ message: "Listing has been disabled." });
  } catch (error) {
    next(error);
  }
};

export const enableListing: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { listingID } = req.params;
  try {
    if (!id) {
      clearCookieAndThrowError(
        res,
        "A _id cookie is required to access this resource."
      );
    }

    await Listings.findByIdAndUpdate(listingID, {
      status: "Active",
    });

    res.status(201).json({ message: "Listing has been enabled." });
  } catch (error) {
    next(error);
  }
};
