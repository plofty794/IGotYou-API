import { RequestHandler } from "express";
import Admin from "../models/Admin";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import Users from "../models/Users";
import SubscriptionPayments from "../models/SubscriptionPayments";
import Reports from "../models/Reports";
import { auth } from "firebase-admin";

export const getActiveUsers: RequestHandler = async (req, res, next) => {
  const admin_id = req.cookies.admin_id;
  const limit = 10;
  const page = parseInt(req.params.page ?? "1") ?? 1;
  try {
    if (!admin_id) {
      throw createHttpError(401, "This action requires an identifier");
    }
    const totalActiveUsers = await Users.countDocuments();
    const totalPages = Math.ceil(totalActiveUsers / limit);
    const activeUsers = await Users.find({
      subscriptionStatus: "active",
      userStatus: "host",
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("listings")
      .sort({ createdAt: "desc" })
      .exec();
    if (!activeUsers.length) {
      return res.status(200).json({ activeUsers: [], totalPages: 0 });
    }
    res.status(200).json({ activeUsers, totalPages });
  } catch (error) {
    next(error);
  }
};

export const getUsers: RequestHandler = async (req, res, next) => {
  const admin_id = req.cookies.admin_id;
  const limit = 10;
  const page = parseInt(req.params.page ?? "1") ?? 1;
  try {
    if (!admin_id) {
      throw createHttpError(401, "This action requires an identifier");
    }

    const users = await Users.find({
      username: { $ne: null },
    })
      .select(
        "uid username email userStatus emailVerified identityVerified mobilePhone mobileVerified createdAt isDisabled"
      )
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: "desc" })
      .exec();

    const totalUsers = await Users.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    if (!users.length) {
      return res.status(200).json({ users: [], totalPages: 0, totalUsers: 0 });
    }
    res.status(200).json({ users, totalPages, totalUsers });
  } catch (error) {
    next(error);
  }
};

export const getAdminInfo: RequestHandler = async (req, res, next) => {
  const admin_id = req.cookies.admin_id;
  try {
    if (!admin_id) {
      throw createHttpError(401, "This action requires an identifier");
    }
    const admin = await Admin.findById(admin_id);
    if (!admin) {
      throw createHttpError(400, "Something went wrong");
    }
    res.status(200).json({ admin });
  } catch (error) {
    next(error);
  }
};

export const loginAdmin: RequestHandler = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const adminExist = await Admin.findOne({ username });
    if (!adminExist) {
      throw createHttpError(400, "Invalid admin credentials");
    }
    const passwordCorrect = await bcrypt.compare(password, adminExist.password);
    if (!passwordCorrect) {
      throw createHttpError(400, "Invalid admin credentials");
    }
    res.cookie("admin_id", adminExist._id.toString(), { httpOnly: true });
    res.status(200).json({ adminExist });
  } catch (error) {
    next(error);
  }
};

export const getAdminOverview: RequestHandler = async (req, res, next) => {
  const admin_id = req.cookies.admin_id;
  const { dateFrom, dateTo } = req.query;
  try {
    if (!admin_id) {
      throw createHttpError(401, "This action requires an identifier");
    }

    if (dateFrom != "" || dateTo != "") {
      const allUsers = await Users.find({
        $and: [
          {
            createdAt: {
              $lte: new Date(dateTo.toString()),
            },
          },
          {
            createdAt: {
              $gte: new Date(dateFrom.toString()),
            },
          },
        ],
      }).select("userStatus");
      const subscribedUsers = await SubscriptionPayments.find({
        $and: [
          {
            createdAt: {
              $gte: new Date(dateFrom.toString()),
            },
          },
          {
            createdAt: {
              $lte: new Date(dateTo.toString()),
            },
          },
        ],
      })
        .populate({
          path: "user",
          select: "subscriptionExpiresAt photoUrl username email",
        })
        .sort({ createdAt: "desc" })
        .limit(5);

      return res.status(200).json({ allUsers, subscribedUsers });
    }

    const allUsers = await Users.find().select("userStatus");
    const subscribedUsers = await SubscriptionPayments.find({})
      .populate({
        path: "user",
        select: "subscriptionExpiresAt photoUrl username email",
      })
      .sort({ createdAt: "desc" })
      .limit(5);

    res.status(200).json({ allUsers, subscribedUsers });
  } catch (error) {
    next(error);
  }
};

export const getUserReports: RequestHandler = async (req, res, next) => {
  const admin_id = req.cookies.admin_id;
  const limit = 10;
  const page = parseInt(req.params.page ?? "1") ?? 1;

  try {
    if (!admin_id) {
      throw createHttpError(401, "This action requires an identifier");
    }

    const userReports = await Reports.find({})
      .skip((page - 1) * limit)
      .populate([
        {
          path: "reporter",
          select:
            "username email userStatus reports emailVerified identityVerified isDisabled uid",
        },
        {
          path: "reportedUser",
          select:
            "username email userStatus reports emailVerified identityVerified isDisabled uid",
        },
      ])
      .limit(limit)
      .sort({ createdAt: "desc" })
      .exec();

    const totalReports = await Reports.countDocuments();
    const totalPages = Math.ceil(totalReports / limit);

    if (!userReports.length) {
      return res
        .status(200)
        .json({ userReports: [], totalPages: 0, totalReports: 0 });
    }
    res.status(200).json({ userReports, totalPages, totalReports });
  } catch (error) {
    next(error);
  }
};

export const adminLogOut: RequestHandler = async (req, res, next) => {
  const admin_id = req.cookies.admin_id;
  try {
    if (!admin_id) {
      throw createHttpError(401, "This action requires an identifier");
    }
    const adminExist = await Admin.findById(admin_id);
    if (!adminExist) {
      throw createHttpError(400, "Invalid Admin ID!");
    }
    res.clearCookie("admin_id", { httpOnly: true });
    res.status(200).json({ message: "Admin has been logged out" });
  } catch (error) {
    next(error);
  }
};

export const disableUser: RequestHandler = async (req, res, next) => {
  const admin_id = req.cookies.admin_id;
  const { userUID } = req.params;
  try {
    if (!admin_id) {
      throw createHttpError(401, "This action requires an identifier");
    }

    await auth().updateUser(userUID, {
      disabled: true,
    });

    await Users.findOneAndUpdate(
      { uid: userUID },
      {
        isDisabled: true,
      }
    );

    res.status(200).json({ message: "Account has been disabled." });
  } catch (error) {
    next(error);
  }
};

export const enableUser: RequestHandler = async (req, res, next) => {
  const admin_id = req.cookies.admin_id;
  const { userUID } = req.params;
  try {
    if (!admin_id) {
      throw createHttpError(401, "This action requires an identifier");
    }

    await auth().updateUser(userUID, {
      disabled: false,
    });

    await Users.findOneAndUpdate(
      { uid: userUID },
      {
        isDisabled: false,
      }
    );

    res.status(200).json({ message: "Account has been enabled." });
  } catch (error) {
    next(error);
  }
};
