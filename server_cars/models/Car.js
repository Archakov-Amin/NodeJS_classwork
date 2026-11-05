import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  mark: {
    type: String,
    required: [true, "Марка автомобиля не указана!"],
    trim: true,
  },
  model: {
    type: String,
    required: [true, "Модель автомобиля не указана!"],
    trim: true,
  },
  color: {
    type: String,
    required: [true, "Цвет автомобиля не указан!"],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, "Год выпуска автомобиля не указан!"],
    min: 1990,
  },
});

export default mongoose.model("Car", carSchema);
