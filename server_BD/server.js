const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

const PORT = 3000;

// Подключение к БД (MongoDB)

mongoose.connect("mongodb://127.0.0.1:27017").then(() => {
    console.log("MongoDB успешно подключён!");
}).catch((error) => {
    console.log(`Ошибка при подключении БД: ${error.message}`);
    process.exit(1)
})

app.post("/registration", (req, res) => {
    const {name, age} = req.body
    
})

app.listen(PORT, () => {
    console.log(`Сервер успешно запущен на порту ${PORT}`);
})