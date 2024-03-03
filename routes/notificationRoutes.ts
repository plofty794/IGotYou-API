import { Router } from "express";
import {
  getGuestNotifications,
  getHostNotifications,
  readGuestBookingRequestNotification,
  readHostBookingRequestNotification,
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
  "/users/current-user/notifications/read-guest-booking-request-notification/:notificationID",
  readGuestBookingRequestNotification
);
router.patch(
  "/users/current-user/notifications/read-host-booking-request-notification/:notificationID",
  readHostBookingRequestNotification
);

export { router as notificationRoutes };
