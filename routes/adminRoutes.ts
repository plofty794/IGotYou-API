import { Router } from "express";
import {
  getAdminInfo,
  getActiveUsers,
  loginAdmin,
  getUsers,
  getAdminOverview,
} from "../controllers/adminControllers";
const router = Router();

router.get("/admin", getAdminInfo);
router.get("/admin/overview", getAdminOverview);
router.get("/admin/active-users/:page", getActiveUsers);
router.get("/admin/users/:page", getUsers);
router.post("/admin/login", loginAdmin);

export { router as adminRoutes };
