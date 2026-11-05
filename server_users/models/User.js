import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Укажите имя пользователя!"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Укажите фамилию пользователя!"],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, "Укажите возраст пользователя!"],
    min: 12,
  },
  email: {
    type: String,
    required: [true, "Укажите почту пользователя!"],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Укажите пароль пользователя!"],
    minLength: [6, "Пароль должен быть не меньше 6 символов"],
    trim: true
  },
  avatar: {
    type: String,
  }
});

export default mongoose.model("User", userSchema);
