import { Error } from "mongoose";
import { v4 as uuidv4 } from "uuid";

class FileService {
  async saveFile(file) {
    try {
      if (!file) {
        throw new Error("Файл не был передан");
      }

      const MAX_SIZE = 5 * 1024 * 1024;

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

      if (!typesImage.includes(file.mimetype)) {
        throw new Error(
          "Неверный формат файла (разрешены только JPEG, JPG, PNG, GIF, WEBP)"
        );
      }

      const fileType = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileType}`;
      const filePath = `./uploads/${fileName}`;

      await file.mv(filePath);

      return filePath;
    } catch (err) {
      throw new Error(`Ошибка при добавлении файла: ${err}`);
    }
  }
}

export default new FileService();
