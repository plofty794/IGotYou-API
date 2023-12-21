import { Router } from "express";
import {
  getGuestNotifications,
  getHostNotifications,
  updateGuestNotification,
} from "../controllers/notificationControllers";
const router = Router();

router.get("/users/current-user/guest-notifications", getGuestNotifications);
router.get("/users/current-user/host-notifications", getHostNotifications);
router.patch(
  "/users/current-user/guest-notifications",
  updateGuestNotification
);

export { router as notificationRoutes };
