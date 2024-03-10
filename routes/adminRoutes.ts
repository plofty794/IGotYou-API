import { Router } from "express";
import {
  getAdminInfo,
  getActiveUsers,
  loginAdmin,
  getUsers,
  getAdminOverview,
  adminLogOut,
  getUserReports,
  disableUser,
  enableUser,
} from "../controllers/adminControllers";
const router = Router();

router.get("/admin", getAdminInfo);
router.get("/admin/overview", getAdminOverview);
router.get("/admin/active-users/:page", getActiveUsers);
router.get("/admin/users/:page", getUsers);
router.get("/admin/users-reports/:page", getUserReports);
router.post("/admin/login", loginAdmin);
router.patch("/admin/disable-user/:userUID", disableUser);
router.patch("/admin/enable-user/:userUID", enableUser);
router.delete("/admin/logout", adminLogOut);

export { router as adminRoutes };
