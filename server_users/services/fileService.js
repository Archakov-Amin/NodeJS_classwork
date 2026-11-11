import { Error } from "mongoose";
import { v4 as uuidv4 } from "uuid";

class FileService {
  async saveFile(file) {
    try {
      // Проверка: передан ли файл вообще
      if (!file) {
        throw new Error("Файл не был передан");
      }

      const MAX_SIZE = 5 * 1024 * 1024;

      // Проверка: не слишком ли большой файл (лимит 5 МБ)
      if (file.size > MAX_SIZE) {
        throw new Error("Файл превышает допустимый размер (5 МБ)");
      }

      const typesImage = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      // Проверка: является ли файл картинкой нужного формата
      if (!typesImage.includes(file.mimetype)) {
        throw new Error(
          "Неверный формат файла (разрешены только JPEG, JPG, PNG, GIF, WEBP)"
        );
      }

      // Получаем расширение (например: png, jpg)
      const fileType = file.name.split(".").pop();
      // Создаем случайное уникальное имя для файла
      const fileName = `${uuidv4()}.${fileType}`;
      // Задаем путь, куда сохранять файл
      const filePath = `./uploads/${fileName}`;

      // Физически сохраняем файл на сервере
      await file.mv(filePath);

      // Возвращаем путь к готовому файлу
      return filePath;
    } catch (err) {
      // Отлавливаем и выводим ошибку, если что-то пошло не так
      throw new Error(`Ошибка при добавлении файла: ${err}`);
    }
  }
}

// Экспортируем готовый сервис для работы в других файлах
export default new FileService();
