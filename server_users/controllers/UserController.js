import User from "../models/User.js";

class UserController {
  async registration(req, res) {
    try {
      const { name, lastName, age } = req.body;
      const newUser = await User.create({ name, lastName, age });
      res.json(newUser);
      newUser.save();
    } catch (err) {
      res.status(500).json(`Ошибка при регестрации: ${err}`);
      console.error(`Ошибка при регестрации: ${err}`);
    }
  }
}

export default new UserController();