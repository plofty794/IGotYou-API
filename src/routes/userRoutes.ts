import { Router } from "express";
const router = Router();
import {
  createUser,
  deleteUser,
  getCurrentUserProfile,
  getUserPhone,
  googleSignIn,
  logInUser,
  logOutUser,
  updateUser,
  visitUserProfile,
  // userSubscription,
  checkUserEmail,
  getBookingRequests,
  searchUsername,
  updateUserEmail,
  addListingToWishlist,
  getWishlists,
} from "../controllers/usersControllers";
import { verifyUserUpdates } from "../middlewares/verifyUserUpdates";
import { authToken } from "../middlewares/authToken";

router.get("/users/current-user/phone", authToken, getUserPhone);

router.get("/users/current-user/wishlists", authToken, getWishlists);
router.get("/users/search/:username", authToken, searchUsername);
router.get("/users/profile/visit/:id", authToken, visitUserProfile);
router.get("/users/booking-requests/:page", authToken, getBookingRequests);
router.get("/users/current-user/profile", authToken, getCurrentUserProfile);
router.post("/users/login", logInUser);
router.post("/users/email-check", authToken, checkUserEmail);
router.post(
  "/users/current-user/add-listing-wishlist",
  authToken,
  addListingToWishlist
);
router.post("/users/login/google", googleSignIn);
router.post("/users/register", createUser);
router.patch(
  "/users/current-user/update",
  authToken,
  verifyUserUpdates,
  updateUser
);
router.patch("/users/current-user/update-email", authToken, updateUserEmail);

router.delete("/users/current-user/logout", logOutUser);
router.delete("/users/:id", deleteUser);

export { router as userRoutes };
