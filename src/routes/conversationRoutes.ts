import { Router } from "express";
import {
  createConversation,
  deleteConversation,
  getCurrentUserConversation,
  getCurrentUserConversations,
  readMessage,
} from "../controllers/conversationsControllers";
import { authToken } from "../middlewares/authToken";
const router = Router();

router.get(
  "/users/current-user/conversations",
  authToken,
  getCurrentUserConversations
);
router.get(
  "/users/current-user/conversations/:conversationId",
  authToken,
  getCurrentUserConversation
);
router.post(
  "/users/current-user/conversations/create",
  authToken,
  createConversation
);
router.patch(
  "/users/current-user/conversations/read-message/:messageId",
  authToken,
  readMessage
);
router.delete(
  "/users/current-user/conversations/delete/:conversationId",
  authToken,
  deleteConversation
);

export { router as conversationRoutes };
