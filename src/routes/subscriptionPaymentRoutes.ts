import { Router } from "express";
import {
  getPendingPayments,
  getVerifiedPayments,
  sendSubscriptionPayment,
  updateSubscriptionPhotosStatus,
  searchUsernameVerifiedPayment,
} from "../controllers/subscriptionPaymentControllers";
import { authToken } from "../middlewares/authToken";
const router = Router();

router.get("/subscriptions/pending/:page", getPendingPayments);
router.get("/subscriptions/verified/:page", getVerifiedPayments);
router.get(
  "/subscriptions/verified/search/:username",
  searchUsernameVerifiedPayment
);
router.post(
  "/subscriptions/send-subscription-photos",
  authToken,
  sendSubscriptionPayment
);
router.patch(
  "/subscriptions/update-payment-status",
  updateSubscriptionPhotosStatus
);

export { router as subscriptionPaymentRoutes };
