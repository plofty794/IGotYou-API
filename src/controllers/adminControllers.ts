import { RequestHandler } from "express";
import Admin from "../models/Admin";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import Users from "../models/Users";

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
    const totalUsers = await Users.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);
    const users = await Users.find({
      $or: [
        {
          subscriptionStatus: "pending",
        },
        {
          subscriptionStatus: "active",
        },
      ],
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("listings")
      .sort({ createdAt: "desc" })
      .exec();
    if (!users.length) {
      return res.status(200).json({ users: [], totalPages: 0 });
    }
    const _users = users.map((user) => ({
      uid: user.uid,
      email: user.email,
      username: user.username,
      subscription_status: user.subscriptionStatus,
      user_status: user.userStatus,
      listings: user.listings.length,
    }));
    res.status(200).json({ users: _users, totalPages });
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
