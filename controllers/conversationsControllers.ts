import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Conversations from "../models/Conversations";
import Users from "../models/Users";
import Messages from "../models/Messages";
import GuestNotifications from "../models/GuestNotifications";
import BlockedUsers from "../models/BlockedUsers";

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
        { path: "participants", select: "username _id photoUrl uid" },
      ])
      .sort({ updatedAt: "desc" })
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
        { path: "participants", select: "username _id photoUrl uid" },
      ])
      .exec();

    if (!conversation) {
      throw createHttpError(400, { conversation: [] });
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
      return res
        .status(400)
        .json({ error: "This user is already in a conversation with you." });
    }

    const newConversation = await Conversations.create({
      participants: [id, receiver?._id],
    });

    res.status(201).json({ newConversation: [newConversation] });
  } catch (error) {
    next(error);
  }
};

export const readMessage: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { messageId } = req.params;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    await Messages.findByIdAndUpdate(messageId, {
      ...req.body,
    });

    await GuestNotifications.findOneAndUpdate(
      { data: messageId },
      {
        read: true,
      }
    );

    res.status(200).json({ message: "Success" });
  } catch (error) {
    next(error);
  }
};

export const sendMessage: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { content, receiverName } = req.body;
  const { conversationID } = req.params;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    if (content == null || receiverName == null) {
      throw createHttpError(400, "Missing field(s): Content or Receiver name");
    }

    const conversationExist = await Conversations.findById(conversationID);

    if (!conversationExist) {
      throw createHttpError(400, "Invalid conversation ID");
    }

    const recipientID = await Users.findOne({ username: receiverName });

    const isBlocked = await BlockedUsers.findOne({
      blockedID: id,
      blockerID: recipientID?._id,
    });

    if (isBlocked) {
      throw createHttpError(
        400,
        "This user is unable to receive messages from you at this time."
      );
    }

    const isBlocker = await BlockedUsers.findOne({
      blockedID: recipientID?._id,
      blockerID: id,
    });

    if (isBlocker) {
      throw createHttpError(
        400,
        "Unblock this user if you want to send a message."
      );
    }

    const lastMessage = await Messages.create({
      content,
      senderID: id,
    });

    await lastMessage.populate({
      path: "senderID",
      select: "username photoUrl",
    });

    await Conversations.findByIdAndUpdate(
      conversationID,
      {
        lastMessage: lastMessage?._id,
        $push: {
          messages: [lastMessage._id],
        },
      },
      { new: true }
    );

    const guestNotificationExist = await GuestNotifications.findOne({
      senderID: id,
      recipientID: recipientID?._id,
      notificationType: "New-Message",
    });

    if (guestNotificationExist) {
      await GuestNotifications.findByIdAndUpdate(guestNotificationExist?._id, {
        data: lastMessage?._id,
        read: false,
      });

      return res.status(200).json({ conversation: lastMessage, receiverName });
    }

    const messageNotification = await GuestNotifications.create({
      recipientID: recipientID?._id,
      senderID: id,
      notificationType: "New-Message",
      data: lastMessage?._id,
    });

    await Users.findByIdAndUpdate(recipientID?._id, {
      $push: {
        guestNotifications: messageNotification._id,
      },
    });

    return res.status(200).json({ receiverName, conversationID });
  } catch (error) {
    next(error);
  }
};

export const sendMessageToHost: RequestHandler = async (req, res, next) => {
  const id = req.cookies["_&!d"];
  const { hostID, content } = req.body;
  try {
    if (!id) {
      res.clearCookie("_&!d");
      throw createHttpError(
        400,
        "A _id cookie is required to access this resource."
      );
    }

    if (content == null || hostID == null) {
      throw createHttpError(400, "Missing field(s): Content or Host id");
    }

    const host = await Users.findById(hostID).select("username");

    const isBlocked = await BlockedUsers.findOne({
      blockedID: id,
      blockerID: host?._id,
    });

    if (isBlocked) {
      throw createHttpError(
        400,
        "This user is unable to receive messages from you at this time."
      );
    }

    const isBlocker = await BlockedUsers.findOne({
      blockedID: host?._id,
      blockerID: id,
    });

    if (isBlocker) {
      throw createHttpError(
        400,
        "Unblock this user if you want to send a message."
      );
    }

    const conversationExist = await Conversations.findOne({
      participants: {
        $all: [id, hostID],
      },
    });

    const lastMessage = await Messages.create({
      content,
      senderID: id,
    });

    if (!conversationExist) {
      const newConversation = await Conversations.create({
        participants: [id, hostID],
        lastMessage: lastMessage?._id,
        messages: [lastMessage?._id],
      });

      const messageNotification = await GuestNotifications.create({
        senderID: id,
        recipientID: hostID,
        notificationType: "New-Message",
        data: lastMessage?._id,
      });

      await Users.findByIdAndUpdate(hostID, {
        $push: {
          guestNotifications: messageNotification._id,
        },
      });

      return res.status(201).json({
        conversation: lastMessage,
        receiverName: host?.username,
        conversationID: newConversation?._id,
      });
    }

    await Conversations.findByIdAndUpdate(
      conversationExist?._id,
      {
        lastMessage: lastMessage?._id,
        $push: {
          messages: lastMessage._id,
        },
      },
      { new: true }
    );

    await GuestNotifications.findOneAndUpdate(
      { senderID: id, recipientID: hostID },
      {
        data: lastMessage?._id,
        read: false,
      }
    );

    return res.status(200).json({
      conversation: lastMessage,
      receiverName: host?.username,
      conversationID: conversationExist?._id,
    });
  } catch (error) {
    next(error);
  }
};
