import { Router } from "express";
import {
  getCurrentReservation,
  getCurrentReservationDetails,
  getPendingServicePayments,
  getPreviousReservations,
  getReservations,
  getUpcomingReservations,
  requestServiceCancellation,
  sendReservationPaymentToAdmin,
  updatePendingServicePayment,
} from "../controllers/reservationControllers";
import { authToken } from "../middlewares/authToken";

const router = Router();

router.get(
  "/reservation-details/:reservationID",
  authToken,
  getCurrentReservationDetails
);
router.get("/reservations/current", authToken, getCurrentReservation);
router.get("/reservations/all/:page", authToken, getReservations);
router.get("/reservations/upcoming/:page", authToken, getUpcomingReservations);
router.get("/reservations/previous/:page", authToken, getPreviousReservations);
router.get("/service-payments/pending/:page", getPendingServicePayments);
router.post(
  "/reservations/send-payment/:reservationID",
  authToken,
  sendReservationPaymentToAdmin
);
router.post(
  "/reservations/request-service-cancellation/:reservationID",
  authToken,
  requestServiceCancellation
);
router.patch(
  "/reservations/update-payment/:reservationID",
  updatePendingServicePayment
);

export { router as reservationRoutes };
