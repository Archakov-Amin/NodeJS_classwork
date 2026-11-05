import { Router } from "express";
import toolController from "../controllers/toolController.js";

const router = new Router();

router.get("/tools", toolController.getTools);
router.get("/tools/:id", toolController.getTool);
router.post("/tools", toolController.addTool);
router.patch("/tools/:id", toolController.editTool);
router.put("/tools/:id", toolController.updateTool);
router.delete("/tools/:id", toolController.deleteTool);

export default router;
