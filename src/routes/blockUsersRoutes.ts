import { Router } from "express";
import { blockUser, unblockUser } from "../controllers/blockedUsersController";
import { authToken } from "../middlewares/authToken";
const router = Router();

router.patch("/blocked-users/block-user/:blockedID", authToken, blockUser);
router.patch("/blocked-users/unblock-user/:blockedID", authToken, unblockUser);

export { router as blockedUsersRoutes };
