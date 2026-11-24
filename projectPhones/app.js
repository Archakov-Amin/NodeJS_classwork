import express from "express";
import path from "path";
import fileUpload from "express-fileupload";
import userRoutes from "./src/routes/userRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";

import connectDB from "./src/config/db.js"
connectDB()

const PORT = 5000;
const app = express();
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);

app.listen(PORT, () => {
    console.log("Сервер успешно запущен на порту: " + PORT);
});