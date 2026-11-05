import { Router } from "express";
import CarController from "../controllers/CarController.js";

const router = new Router();

router.get("/cars", CarController.getCars);
router.get("/cars/:id", CarController.getCar);
router.post("/cars/add", CarController.addCar);
router.patch("/cars/:id", CarController.updateCar);
router.delete("/cars/:id", CarController.deleteCar);

export default router;
