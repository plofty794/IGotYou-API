import { Router } from "express";
import {
  getGuestNotifications,
  getHostNotifications,
  readBookingRequestNotification,
  updateGuestNotification,
} from "../controllers/notificationControllers";
const router = Router();

router.get("/users/current-user/guest-notifications", getGuestNotifications);
router.get("/users/current-user/host-notifications", getHostNotifications);
router.patch(
  "/users/current-user/guest-notifications",
  updateGuestNotification
);
router.patch(
  "/users/current-user/notifications/read-booking-request-notification/:notificationID",
  readBookingRequestNotification
);

export { router as notificationRoutes };
