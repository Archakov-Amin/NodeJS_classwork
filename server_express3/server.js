const express = require("express");

const PORT = 4000;

const app = express();
app.use(express.json());

const students = [
  {
    id: 1,
    fio: "Иванов Иван Иванович",
    group: "ИТ-21",
  },
  {
    id: 2,
    fio: "Петрова Анна Сергеевна",
    group: "ИТ-21",
  },
  {
    id: 3,
    fio: "Сидоров Алексей Владимирович",
    group: "ЭК-12",
  },
  {
    id: 4,
    fio: "Кузнецова Мария Дмитриевна",
    group: "ИТ-21",
  },
  {
    id: 5,
    fio: "Смирнов Дмитрий Николаевич",
    group: "ЭК-12",
  },
];

const cars = [
  {
    id: 1,
    brand: "Toyota",
  },
  {
    id: 2,
    brand: "BMW",
  },
  {
    id: 3,
    brand: "Mercedes-Benz",
  },
  {
    id: 4,
    brand: "Audi",
  },
  {
    id: 5,
    brand: "Hyundai",
  },
];

app.get("/students", (req, res) => {
  // Получение всех студентов
  res.send(students);
});

app.get("/students/:id", (req, res) => {
  const student = students.find((element) => {
    return element.id == req.params.id;
  });
  if (!student) {
    res.send("Пользователь не найден!")
  }

  res.send(student);
});

app.post("/registration", (req, res) => {
    console.log(req.body);
})

app.get("/cars", (req, res) => {
  res.send(cars);
});

app.get("/cars/:id", (req, res) => {
  const car = cars.find((element) => {
    return element.id == req.params.id;
  });
  if (!car) {
    res.send("Пользователь не найден!")
  }

  res.send(car);
});

app.post("/add/car", (req, res) => {
  console.log(req.body);
})

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});