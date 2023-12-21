import { Router } from "express";
import {
  getPendingPayments,
  getVerifiedPayments,
  sendSubscriptionPayment,
  updateSubscriptionPhotosStatus,
} from "../controllers/paymentControllers";
import { authToken } from "../middlewares/authToken";
const router = Router();

router.get("/payments/pending/:page", getPendingPayments);
router.get("/payments/verified/:page", getVerifiedPayments);
router.post(
  "/payments/send-subscription-photos",
  authToken,
  sendSubscriptionPayment
);
router.patch("/payments/update-payment-status", updateSubscriptionPhotosStatus);

export { router as paymentRoutes };
