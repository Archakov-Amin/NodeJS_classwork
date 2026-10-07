const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 4000;

app.use(cors());
app.use(express.json());

const students = [
    { id: 1, name: "Иван", surname: "Иванов" },
    { id: 2, name: "Пётр", surname: "Петров" },
    { id: 3, name: "Анна", surname: "Смирнова" },
    { id: 4, name: "Мария", surname: "Кузнецова" },
    { id: 5, name: "Дмитрий", surname: "Соколов" }
]

app.get("/", (req, res) => {
    res.send("Главная страница")
})

app.get("/students", (req, res) => {
    res.json(students)
})

app.listen(PORT, () => {
    console.log(`Сервер успешно запущен по адресу: localhost:${PORT}`);
})