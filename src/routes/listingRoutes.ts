import { Router } from "express";
import {
  addListing,
  getHostListings,
  getListings,
  getListingsPerCategory,
  getUserListing,
} from "../controllers/listingsControllers";
import { authToken } from "../middlewares/authToken";
const router = Router();

router.get("/listings/:page", authToken, getListings);
router.get("/listings/listing/:id", authToken, getUserListing);
router.get("/listings/host-listings/:page", authToken, getHostListings);
router.get("/listings/:category/:page", authToken, getListingsPerCategory);
router.post("/listings/make-a-listing", authToken, addListing);

export { router as listingRoutes };
