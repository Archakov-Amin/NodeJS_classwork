import { Router } from "express";
import UserController from "../controllers/UserController.js";
import auth from "../middleware/auth.js";

const router = Router()

router.post("/registration", UserController.register)
router.post("/login", UserController.login)

router.get("/getmy", auth.authUser, UserController.getMe)

export default router