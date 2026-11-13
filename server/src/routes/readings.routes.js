import { Router } from "express";
import {
  listReadings,
  addReading,
  editReading,
  removeReading,
} from "../controllers/readings.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", listReadings);
router.post("/", addReading);
router.put("/:id", editReading);
router.delete("/:id", removeReading);

export default router;
