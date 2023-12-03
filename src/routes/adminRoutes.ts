import { Router } from "express";
import {
  getAdminInfo,
  getActiveUsers,
  loginAdmin,
  getUsers,
} from "../controllers/adminControllers";
const router = Router();

router.get("/admin", getAdminInfo);
router.get("/admin/active-users/:page", getActiveUsers);
router.get("/admin/users/:page", getUsers);
router.post("/admin/login", loginAdmin);

export { router as adminRoutes };
