import { Router } from "express";
import ProductController from "./ProductController.js";

const router = new Router();

router.get("/product/:id", ProductController.getProduct)
router.get("/product", ProductController.getProducts)
router.post("/product", ProductController.addProduct)
router.patch("/product/:id", ProductController.editProduct)
router.put("/product/:id", ProductController.updateProduct)
router.delete("/product/:id", ProductController.deleteProduct)

export default router;