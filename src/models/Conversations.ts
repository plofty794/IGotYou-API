import { Schema, model, Types, InferSchemaType } from "mongoose";

const conversationSchema = new Schema(
  {
    participants: {
      type: [Types.ObjectId],
      ref: "Users",
    },
    lastMessage: {
      type: Types.ObjectId,
      ref: "Messages",
    },
    messages: {
      type: [Types.ObjectId],
      ref: "Messages",
    },
  },
  { timestamps: true }
);

export type TConversations = InferSchemaType<typeof conversationSchema>;
const Conversations = model("Conversations", conversationSchema);
export default Conversations;
