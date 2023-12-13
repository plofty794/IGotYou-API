import { Router } from "express";
import {
  createConversation,
  deleteConversation,
  getCurrentUserConversation,
  getCurrentUserConversations,
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
router.delete(
  "/users/current-user/conversations/delete/:conversationId",
  authToken,
  deleteConversation
);

export { router as conversationRoutes };
