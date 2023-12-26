import { Router } from "express";
import {
  sendIdentityVerificationRequest,
  getIdentityVerificationRequests,
  updatePendingIdentityVerificationRequest,
} from "../controllers/identityPhotoControllers";
const router = Router();

router.get("/identity-photo/pending", getIdentityVerificationRequests);
router.post("/identity-photo/verification", sendIdentityVerificationRequest);
router.patch(
  "/identity-photo/verification/:identityPhotoId",
  updatePendingIdentityVerificationRequest
);

export { router as identityRoutes };
