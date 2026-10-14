import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Заголовок не заполнен!"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Описание не заполнено!"],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Цена не указана!"],
    min: 0
  }
});

const Product = mongoose.model("Product", productSchema);
export default Product;