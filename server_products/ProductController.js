import Product from "./models/Product.js";

class ProductController {
  async getProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);

      res.json(product);
    } catch (error) {
      console.error(`Ошибка при получении товара: ${error}`);
      res.send("Ошибка при получении товара!");
    }
  }

  async getProducts(req, res) {
    try {
      const products = await Product.find();

      res.json(products);
    } catch (error) {
      res.send(`Ошибка при получении товаров: ${error}`);
    }
  }

  async addProduct(req, res) {
    const { title, description, price } = req.body;
    try {
      const newProduct = await Product.create({
        title,
        description,
        price,
      });

      await newProduct.save();

      res.send("Товар добавлен успешно!");
    } catch (error) {
      console.error(`Ошибка при добавлении товара: ${error}`);
      res.send("Ошибка при добавлении товара!");
    }
  }

  async editProduct(req, res) {
    try {
      const { id } = req.params;

      const updateProduct = await Product.findByIdAndUpdate(id, {
        $set: req.body,
      });

      if (!updateProduct) {
        res.send("Такого товара не существует!");
      }

      res.send("Товар успешно обновлён!");
    } catch (error) {
      console.error(`Ошибка при обновлении товара: ${error}`);
      res.send("Ошибка при обновлении товара!");
    }
  }

  async updateProduct(req, res) {
    const { id } = req.params;
    const { title, description, price } = req.body;
    try {
      const updateProduct = await Product.findByIdAndUpdate(id, {
        title,
        description,
        price,
      });

      if (!updateProduct) {
        res.send("Такого товара не существует!");
      }

      res.send("Товар успешно обновлён!");
    } catch (error) {
      console.error(`Ошибка при обновлении товара: ${error}`);
      res.send("Ошибка при обновлении товара!");
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        res.send("Такого товара не существует!");
      }

      res.send("Товар успешно удалён!");
    } catch (error) {
      res.send("Ошибка при удалении товара!");
    }
  }
}

export default new ProductController();