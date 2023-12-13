import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Conversations from "../models/Conversations";
import Users from "../models/Users";
import Messages from "../models/Messages";
import { clearCookieAndThrowError } from "../utils/clearCookieAndThrowError";

export const getCurrentUserConversations: RequestHandler = async (
  req,
  res,
  next
) => {
  const id = req.cookies["_&!d"];
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const userConversations = await Conversations.find({
      participants: {
        $all: id,
      },
    })
      .populate([
        {
          path: "lastMessage",
          populate: { path: "senderID", select: "username" },
        },
        {
          path: "messages",
          populate: {
            path: "senderID",
            select: ["username", "photoUrl"],
          },
        },
        { path: "participants", select: ["username", "_id", "photoUrl"] },
      ])
      .exec();

    res.status(200).json({ userConversations, currentUserID: id });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUserConversation: RequestHandler = async (
  req,
  res,
  next
) => {
  const id = req.cookies["_&!d"];
  const { conversationId } = req.params;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const conversation = await Conversations.findById(conversationId)
      .populate([
        { path: "lastMessage" },
        {
          path: "messages",
          populate: {
            path: "senderID",
            select: ["username", "photoUrl"],
          },
        },
        { path: "participants", select: ["username", "_id", "photoUrl"] },
      ])
      .exec();

    if (!conversation) {
      return res.status(200).json({ conversation: [] });
    }

    res.status(200).json({ conversation: [conversation], currentUserID: id });
  } catch (error) {
    next(error);
  }
};

export const deleteConversation: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { conversationId } = req.params;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const conversation = await Conversations.findById(conversationId);

    const messages = conversation?.messages;

    console.log(messages);

    await Messages.deleteMany({
      _id: {
        $in: messages,
      },
    });
    await Conversations.findByIdAndDelete(conversationId);
    await Users.findByIdAndUpdate(id, {
      $pull: {
        conversation: [conversationId],
      },
    });

    res.status(200);
  } catch (error) {
    next(error);
  }
};

export const createConversation: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { receiverName } = req.body;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    const receiver = await Users.findOne({ username: receiverName });

    const conversationExist = await Conversations.findOne({
      participants: {
        $all: [id, receiver?._id],
      },
    })
      .populate({
        path: "participants",
        select: ["username", "photoUrl"],
      })
      .exec();

    if (conversationExist) {
      return res.status(400).json({ conversationExist: [conversationExist] });
    }

    const newConversation = await Conversations.create({
      participants: [id, receiver?._id],
    });

    res.status(201).json({ newConversation: [newConversation] });
  } catch (error) {
    next(error);
  }
};

export const getUserMessages: RequestHandler = async (req, res, next) => {
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
    res.status(200).json({ user, currentUserID: id });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (data: any) => {
  try {
    const lastMessage = await Messages.create({
      content: data.content,
      senderID: data.senderID,
    });

    await lastMessage.populate({
      path: "senderID",
      select: "username photoUrl",
    });

    await Conversations.findByIdAndUpdate(data.conversationID, {
      lastMessage: lastMessage?._id,
      $push: {
        messages: [lastMessage._id],
      },
    });

    return { conversation: lastMessage };
  } catch (error) {
    console.error(error);
  }
};
