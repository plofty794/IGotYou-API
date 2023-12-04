import { RequestHandler } from "express";
import Messages from "../models/Messages";
import Users from "../models/Users";
import { clearCookieAndThrowError } from "../utils/clearCookieAndThrowError";

export const getUserMessages: RequestHandler = async (req, res, next) => {
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
    const messages = await Messages.find({ _id: user?.messages })
      .sort({ "replies.createdAt": "desc" })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate([
        {
          path: "senderID",
          select: "username photoUrl",
        },
        { path: "receiverID", select: "username photoUrl" },
      ]);

    res.status(200).json({ messages, currentUserID: id });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (data: any) => {
  try {
    const receiverID = await Users.findOne({ username: data.receiverName });
    const senderID = await Users.findOne({ username: data.senderName });

    const messageExist = await Messages.findOne({
      $expr: {
        $eq: ["$receiverID.messages", "$senderID.messages"],
      },
    });

    if (messageExist) {
      return await messageExist.updateOne({
        $push: {
          replies: {
            content: data.message,
            senderID: senderID?._id,
          },
        },
      });
    }
    const newMessage = await Messages.create({
      senderID: senderID?._id,
      receiverID: receiverID?._id,
      content: data.message,
    });

    await senderID?.updateOne({
      $push: {
        messages: newMessage._id,
      },
    });

    await receiverID?.updateOne({
      $push: {
        messages: newMessage._id,
      },
    });

    return newMessage;
  } catch (error) {
    console.error(error);
  }
};
