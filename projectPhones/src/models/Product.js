import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: [true, "Укажите бренд товара!"],
        trim: true
    },
    model: {
        type: String,
        required: [true, "Укажите модель товара!"],
        trim: true
    },
    title: {
        type: String,
        required: [true, "Укажите название товара!"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Укажите описание товара!"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Укажите цену товара!"],
        min: [0, "Цена не может быть отрицательной!"]
    },
    quantity: {
        type: Number,
        required: [true, "Укажите количество товара!"],
        min: [0, "Количество не может быть меньше 0!"],
        default: 0
    },
    storage: {
        type: String,
        enum: ["64GB", "128GB", "256GB", "512GB", "1TB"]
    },
    color: {
        type: String,
        required: [true, "Укажите цвет товара!"]
    },
    specs: {
        screen: { type: String },
        camera: { type: String },
        battery: { type: String },
        os: { type: String },
        cpu: { type: String },
        ram: { type: String }
    },
    images: [{ type: String }]
});

export default mongoose.model("Product", productSchema);