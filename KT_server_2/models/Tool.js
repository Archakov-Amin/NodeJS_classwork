import mongoose from "mongoose";

const toolSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Укажите название инструмента!"],
    trim: true,
  },
  model: {
    type: String,
    required: [true, "Укажите модель инструмента!"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Укажите описание инструмента!"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Укажите цену инструмента!"],
    min: 0,
  },
  tool_image: {
    type: String,
  },
});

export default mongoose.model("Tool", toolSchema);
