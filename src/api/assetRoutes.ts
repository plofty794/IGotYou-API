import { Router } from "express";
import { removeAssets } from "../controllers/assetsControllers";
import { authToken } from "../middlewares/authToken";

const router = Router();

router.delete("/cloudinary/delete/:folder/:assetName", authToken, removeAssets);

export { router as assetRoutes };
