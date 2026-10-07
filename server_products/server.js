// Подключаем фреймворк Express для создания сервера
const express = require("express");
// Подключаем Mongoose для работы с базой данных MongoDB
const mongoose = require("mongoose");

// Импортируем модель данных Product из файла
const Product = require("./models/Product");

// Задаем номер порта, на котором будет запущен сервер
const PORT = 5000;

// Инициализируем приложение Express
const app = express();
// Включаем middleware для автоматического чтения JSON в теле запросов
app.use(express.json());

// Подключаемся к локальной базе данных MongoDB
mongoose
  .connect("mongodb://localhost:27017/products")
  .then(() => {
    // Вывод при успешном соединении с БД
    console.log("Успешное подключение к БД!");
  })
  .catch((error) => {
    // Вывод при возникновении ошибки подключения к БД
    console.error(`Ошибка при подключении к БД: ${error}`);
  });

// Обработчик GET-запроса для получения списка всех товаров
app.get("/products", async (req, res) => {
  try {
    // Асинхронно ищем все товары в базе данных
    const products = await Product.find()
    // Отправляем полученный список клиенту в формате JSON
    res.json(products)
  } catch (error) {
    // Отправляем сообщение об ошибке, если что-то пошло не так
    res.send(`Ошибка при получении товаров: ${error}`)
  }
})

// Обработчик POST-запроса для добавления нового товара
app.post("/addproduct", async (req, res) => {
  // Достаем поля title, description и price из тела запроса
  const { title, description, price } = req.body;
  try {
    // Создаем экземпляр нового товара на основе переданных данных
    const newProduct = await Product.create({
      title,
      description,
      price,
    });
    // Сохраняем созданный товар в базе данных
    await newProduct.save();
    // Отправляем подтверждение успешного добавления
    res.send("Товар добавлен успешно!");
  } catch (error) {
    // Логируем ошибку на сервере и отправляем ответ клиенту
    console.error(`Ошибка при добавлении товара: ${error}`);
    res.send("Ошибка при добавлении товара!");
  }
});

// Обработчик DELETE-запроса для удаления товара по его ID
app.delete("/product/:id", async (req, res) => {
  try {
    // Получаем id товара из параметров ссылки
    const { id } = req.params;
    // Ищем товар по ID и сразу удаляем его из базы
    const product = await Product.findByIdAndDelete(id);

    // Проверка: если товар с таким ID не был найден в базе
    if (!product) {
      res.send("Такого товара не существует!");
    }
    // Сообщение об успешном удалении
    res.send("Товар успешно удалён!");
  } catch (error) {
    // Обработка ошибок в процессе удаления
    res.send("Ошибка при удалении товара!");
  }
});

// Запускаем сервер на заданном порту и выводим сообщение в консоль
app.listen(PORT, () => {
  console.log(`Успешное поключение к серверу на порту ${PORT}`);
});
