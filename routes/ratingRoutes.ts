import { Router } from "express";
import { authToken } from "../middlewares/authToken";
import {
  getGuestReviews,
  getHostReviews,
} from "../controllers/usersControllers";
const router = Router();

router.get("/ratings/host-reviews/:page", authToken, getHostReviews);
router.get("/ratings/guest-reviews/:page", authToken, getGuestReviews);

export { router as ratingRoutes };
