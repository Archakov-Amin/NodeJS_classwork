import { Router } from "express";
import UserController from "../controllers/UserController.js";

const router = new Router();

router.get("/users", UserController.getUsers);
router.get("/user/:id", UserController.getUser);
router.post("/registration", UserController.registration);
router.patch("/user/:id", UserController.updateUser);
router.delete("/user/:id", UserController.deleteUser);

export default router;
