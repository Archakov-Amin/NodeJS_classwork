import fileService from "../middleware/fileService.js";
import User from "../models/User.js";
import hashService from "../middleware/hashService.js";

class UserController {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(401).json(`Ошибка при получении пользователей: ${err}`);
    }
  }

  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        res.status(404).json("Такого пользователя не существует!");
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(`Ошибка при получении пользователя: ${err}`);
    }
  }

  async registration(req, res) {
    try {
      let fileName = null;

      if (req.files && req.files.avatar) {
        fileName = await fileService.saveFile(req.files.avatar);
      }

      const { name, lastName, age, email, password } = req.body;

      const canditate = await User.findOne({email});

      if (canditate) {
        return res.status(400).json({ message: "Пользователь с таким email уже существует!" })
      }

      console.log(password);
      
      const hashPassword = await hashService.hashPassword(password);

      console.log(hashPassword);

      const newUser = await User.create({
        name,
        lastName,
        age,
        email,
        password: hashPassword,
        avatar: fileName,
      });

      res.status(200).json(newUser);
    } catch (err) {
      res.status(500).json(`Ошибка при регистрации: ${err}`);
      console.error(`Ошибка при регистрации: ${err}`);
    }
  }

  async authorization (req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      const isPassValid = await hashService.comparePassword(password, user.password);

      if (!user || !isPassValid) {
        res.status(400).json({message: "Неверный email илли пароль"});
      }

      return res.status(200).json(user);
    } catch (err) {
      res.status(500).json(`Ошибка при авторизации: ${err}`);
      console.error(`Ошибка при авторизации: ${err}`);
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, lastName, age } = req.body;
      const updateUser = await User.findByIdAndUpdate(
        id,
        {
          name,
          lastName,
          age,
        },
        { new: true }
      );

      if (!updateUser) {
        res.status(404).json("Такого пользователя не существует!");
      }

      res.status(200).json(updateUser);
    } catch (err) {
      res.status(500).json(`Ошибка при обновлении пользователя: ${err}`);
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);

      if (!user) {
        res.status(404).json("Такого пользователя не существует!");
      }
      res.status(200).json("Пользователь успешно удалён!");
    } catch (err) {
      res.status(500).json(`Ошибка при удалении пользователя: ${err}`);
    }
  }
}

export default new UserController();
