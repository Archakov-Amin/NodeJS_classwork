import mongoose from "mongoose";

export default async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/phones");
        console.log("Успешное подключение к MongoDB");
    } catch (err) {
        console.log("Ошибка при подключении к MongoDB", err.message);
        process.exit(1);
    }
}