import { Router } from "express";
import {
  getBookingRequests,
  sendBookingRequest,
} from "../controllers/bookingRequestsControllers";
import { authToken } from "../middlewares/authToken";
const router = Router();

router.get("/booking-requests/:page", authToken, getBookingRequests);
router.post("/booking-requests/:listingID", authToken, sendBookingRequest);

export { router as bookingRequestRoutes };
