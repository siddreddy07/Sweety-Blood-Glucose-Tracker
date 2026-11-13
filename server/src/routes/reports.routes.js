import { Router } from "express";
import { dailyReport, monthToDateReport, monthlyReport } from "../controllers/reports.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/daily", dailyReport);
router.get("/month-to-date", monthToDateReport);
router.get("/monthly", monthlyReport);

export default router;
