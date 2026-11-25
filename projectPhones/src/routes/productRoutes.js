import { Router } from "express";
import ProductController from "../controllers/ProductController.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", ProductController.GetAll);
router.get("/:id", ProductController.GetOne);
router.post("/create", auth.authUser, ProductController.Create);
router.put("/update/:id", auth.authUser, ProductController.Update);
router.delete("/delete/:id", auth.authUser, ProductController.Delete);

export default router;