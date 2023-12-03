import { Router } from "express";
import {
  getPendingPayments,
  getVerifiedPayments,
  sendPaymentProof,
  updatePaymentProofStatus,
} from "../controllers/paymentControllers";
import { authToken } from "../middlewares/authToken";
const router = Router();

router.get("/payments/pending/:page", getPendingPayments);
router.get("/payments/verified/:page", getVerifiedPayments);
router.post("/payments/send-payment-proof", authToken, sendPaymentProof);
router.patch("/payments/update-payment-status", updatePaymentProofStatus);

export { router as paymentRoutes };
