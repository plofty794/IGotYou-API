import cloudinary from "cloudinary";
import env from "../utils/envalid";
import { RequestHandler } from "express";
import Listings from "../models/Listings";
import Users from "../models/Users";
import createHttpError from "http-errors";
import { clearCookieAndThrowError } from "../utils/clearCookieAndThrowError";
import { add } from "date-fns";

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

type TListing = {
  serviceType: string;
  serviceDescription?: string;
  listingPhotos: TFileType[];
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
    const listing = await Listings.findById(id).populate("host");
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
      endsAt: add(new Date(req.body.date.to), {
        hours: new Date(req.body.date.from).getHours(),
        minutes: new Date(req.body.date.from).getMinutes(),
        seconds: new Date(req.body.date.from).getSeconds(),
      }),
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
    res.status(200).json({ newListing });
  } catch (error) {
    next(error);
  }
};
