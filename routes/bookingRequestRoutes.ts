import { Router } from "express";
import {
  acceptBookingRequest,
  cancelBookingRequest,
  declineBookingRequest,
  getBookingRequestDetails,
  getGuestApprovedBookingRequests,
  getGuestBookingRequests,
  getGuestCancelledBookingRequests,
  getGuestDeclinedBookingRequests,
  getGuestPendingBookingRequests,
  getHostBookingRequests,
  reAttemptBookingRequest,
  searchGuestBookingRequest,
  searchGuestName,
  sendBookingRequest,
} from "../controllers/bookingRequestsControllers";
import { authToken } from "../middlewares/authToken";
import {
  reAttemptBookingRequestLimiter,
  sendBookingRequestLimiter,
} from "../utils/limiters";
const router = Router();

router.get("/guest-booking-requests", authToken, searchGuestBookingRequest);
router.get(
  "/booking-requests/:bookingRequestID",
  authToken,
  getBookingRequestDetails
);
router.get("/guest-booking-requests/:page", authToken, getGuestBookingRequests);
router.get("/host-booking-requests/:page", authToken, getHostBookingRequests);
router.get(
  "/guest-approved-booking-requests/:page",
  authToken,
  getGuestApprovedBookingRequests
);
router.get(
  "/guest-pending-booking-requests/:page",
  authToken,
  getGuestPendingBookingRequests
);
router.get(
  "/guest-declined-booking-requests/:page",
  authToken,
  getGuestDeclinedBookingRequests
);
router.get(
  "/guest-cancelled-booking-requests/:page",
  authToken,
  getGuestCancelledBookingRequests
);
router.get("/search-guest/:username", authToken, searchGuestName);
router.post(
  "/guest-send-booking-request/:listingID",
  authToken,
  sendBookingRequestLimiter,
  sendBookingRequest
);
router.post(
  "/host-send-booking-request-update/:bookingRequestID",
  authToken,
  acceptBookingRequest
);
router.patch(
  "/guest-cancel-booking-request/:bookingRequestID",
  authToken,
  cancelBookingRequest
);
router.patch(
  "/host-decline-booking-request/:bookingRequestID",
  authToken,
  declineBookingRequest
);
router.patch(
  "/guest-reAttempt-booking-request/:bookingRequestID",
  authToken,
  reAttemptBookingRequestLimiter,
  reAttemptBookingRequest
);

export { router as bookingRequestRoutes };
