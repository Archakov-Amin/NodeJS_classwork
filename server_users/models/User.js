import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Заполните имя пользователя!"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Заполните фамилию пользователя!"],
        trim: true
    },
    age: {
        type: Number,
        required: [true, "Заполните возраст пользователя!"],
        min: 12
    }
});

export default mongoose.model("User", userSchema);