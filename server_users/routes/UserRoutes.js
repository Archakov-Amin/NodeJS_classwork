import { Router } from "express";
import UserController from "../controllers/UserController.js";

const router = new Router();

// router.get("/users");
// router.get("/user/:id");
router.post("/registration", UserController.registration);
// router.patch("/user/:id");
// router.delete("/user/:id");

export default router;