import { Router } from "express";
import {
  addListing,
  disableListing,
  editListing,
  enableListing,
  getHostListings,
  getListings,
  getListingsPerCategory,
  getUserListing,
  renewListing,
} from "../controllers/listingsControllers";
import { authToken } from "../middlewares/authToken";
const router = Router();

router.get("/listings/:page", authToken, getListings);
router.get("/listings/visit/:listingID", authToken, getUserListing);
router.get("/listings/host-listings/:page", authToken, getHostListings);
router.get("/listings/:category/:page", authToken, getListingsPerCategory);
router.post("/listings/make-a-listing", authToken, addListing);
router.patch("/listings/renew-listing/:listingID", authToken, renewListing);
router.patch("/listings/disable-listing/:listingID", authToken, disableListing);
router.patch("/listings/enable-listing/:listingID", authToken, enableListing);
router.patch("/listings/edit/:listingID", authToken, editListing);

export { router as listingRoutes };
