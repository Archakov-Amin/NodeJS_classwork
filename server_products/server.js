import express from "express";
import mongoose from "mongoose";
import router from "./routes.js";

const PORT = 5000;

const app = express();
app.use(express.json());
app.use(router);

mongoose
  .connect("mongodb://localhost:27017/products")
  .then(() => {
    console.log("Успешное подключение к БД!");
  })
  .catch((error) => {
    console.error(`Ошибка при подключении к БД: ${error}`);
  });

app.listen(PORT, () => {
  console.log(`Успешное поключение к серверу на порту ${PORT}`);
});