import { Router } from "express";
import ProductController from "../controllers/ProductController.js";

const router = Router();

router.get("/", ProductController.GetAll);
router.get("/:id", ProductController.GetOne);
router.post("/create", ProductController.Create);
router.put("/update/:id", ProductController.Update);
router.delete("/delete/:id", ProductController.Delete);

export default router;