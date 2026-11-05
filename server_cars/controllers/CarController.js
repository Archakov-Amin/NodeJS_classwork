import Car from "../models/Car.js";

class CarController {
  async getCars(req, res) {
    try {
      const cars = await Car.find();
      res.status(200).json(cars);
    } catch (err) {
      console.error(`Ошибка при получении автомобилей - ${err}`);
      res.status(401).json(`Ошибка при получении автомобилей - ${err}`);
    }
  }

  async getCar(req, res) {
    try {
      const { id } = req.params;
      const car = await Car.findById(id);

      if (!car) {
        res.status(404).json("Такого автомобиля не существует!");
      }
      res.status(200).json(car);
    } catch (err) {
      console.error(`Ошибка при получении автомобиля - ${err}`);
      res.status(401).json(`Ошибка при получении автомобиля - ${err}`);
    }
  }

  async addCar(req, res) {
    try {
      const { mark, model, color, year } = req.body;

      const newCar = await Car.create({ mark, model, color, year });

      res.json(newCar);
      newCar.save();
    } catch (err) {
      console.error(`Ошибка при добавлении автомобиля - ${err}`);
      res.status(500).json(`Ошибка при добавлении автомобиля - ${err}`);
    }
  }

  async updateCar(req, res) {
    try {
      const { id } = req.params;
      const { mark, model, color, year } = req.body;

      const updateCar = await Car.findByIdAndUpdate(
        id,
        {
          mark,
          model,
          color,
          year,
        },
        { new: true }
      );

      if (!updateCar) {
        res.status(404).json("Такого автомобиля не существует!");
      }
      res.status(200).json(updateCar);
    } catch (err) {
      console.error(`Ошибка при обновлении автомобиля - ${err}`);
      res.status(500).json(`Ошибка при обновлении автомобиля - ${err}`);
    }
  }

  async deleteCar(req, res) {
    try {
      const { id } = req.params;
      const deleteCar = await Car.findByIdAndDelete(id);

      if (!deleteCar) {
        res.status(404).json("Такого автомобиля не существует!");
      }
      res.status(200).json("Автомобиль успешно удалён!");
    } catch (err) {
      console.error(`Ошибка при удалении автомобиля - ${err}`);
      res.status(500).json(`Ошибка при удалении автомобиля - ${err}`);
    }
  }
}

export default new CarController();
