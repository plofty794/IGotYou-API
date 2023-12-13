import { Schema, model, Types, InferSchemaType } from "mongoose";

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
  },
  { timestamps: true }
);

export type TMessages = InferSchemaType<typeof messagesSchema>;
const Messages = model("Messages", messagesSchema);
export default Messages;
