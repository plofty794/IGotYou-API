import { Router } from "express";
import { sendIdentityVerificationRequest } from "../controllers/identityPhotoControllers";
const router = Router();

router.post("/identity-photo/verification", sendIdentityVerificationRequest);

export { router as identityRoutes };
