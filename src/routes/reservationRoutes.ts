import { Router } from "express";
import {
  getCurrentReservations,
  getPreviousReservations,
  getUpcomingReservations,
} from "../controllers/reservationControllers";
import { authToken } from "../middlewares/authToken";

const router = Router();

router.get("/reservations/current/:page", authToken, getCurrentReservations);
router.get("/reservations/upcoming/:page", authToken, getUpcomingReservations);
router.get("/reservations/previous/:page", authToken, getPreviousReservations);

export { router as reservationRoutes };
