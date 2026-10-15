import express from "express";
import mongoose from "mongoose";
import router from "./routes/UserRoutes.js";

const PORT = 5000;
const app = express();
app.use(express.json());
app.use(router);

mongoose
  .connect("mongodb://localhost:27017/usersdb")
  .then(() => {
    console.log("Успешное подключение к БД!");
  })
  .catch((err) => {
    console.log(`Ошибка при подключении к БД: ${err}`);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Успешное подключение к серверу на порту ${PORT}`);
});