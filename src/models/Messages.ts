import { Schema, model, Types, InferSchemaType } from "mongoose";

const repliesSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    senderID: {
      type: Types.ObjectId,
      ref: "Users",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const messagesSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    senderID: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    receiverID: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    replies: [repliesSchema],
  },
  { timestamps: true }
);

export type TMessages = InferSchemaType<typeof messagesSchema>;
const Messages = model("Messages", messagesSchema);
export default Messages;
