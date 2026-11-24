import Product from "../models/Product.js";

class ProductController {
    async GetAll(req, res) {
        try {
            const product = await Product.find();
            res.status(200).json(product);
        } catch (err) {
            res.status(400).json("Ошибка при получении товаров: " + err.message)
        }
    }

    async GetOne(req, res) {
        try {
            const { id } = req.params;
            const product = await Product.findById(id);
            res.status(200).json(product);
        } catch (err) {
            res.status(400).json("Ошибка при получении товара: " + err.message)
        }
    }

    async Create(req, res) {
        try {
            const { brand, model, title, description, price, quantity, storage, color, screen, camera, battery, os, cpu, ram } = req.body;
            const product = await Product.create({ brand, model, title, description, price, quantity, storage, color, specs: { screen, camera, battery, os, cpu, ram } });

            res.status(200).json(product);
        } catch (err) {
            res.status(400).json("Ошибка при создании товара: " + err.message)
        }
    }

    async Update(req, res) {
        try {
            const { id } = req.params;
            const { brand, model, title, description, price, quantity, storage, color, screen, camera, battery, os, cpu, ram } = req.body;
            const updatedProduct = await Product.findByIdAndUpdate(id, { brand, model, title, description, price, quantity, storage, color, specs: { screen, camera, battery, os, cpu, ram } });

            if (!updatedProduct) {
                res.status(404).json("Такого продукта не существует!");
            }

            res.status(200).json(updatedProduct);
        } catch (err) {
            res.status(400).json("Ошибка при обновлении товара: " + err.message);
        }
    }

    async Delete(req, res) {
        try {
            const { id } = req.params;
            const deletedProduct = await Product.findByIdAndDelete(id);

            if (!deletedProduct) {
                res.status(404).json("Такого продукта не существует!");
            }

            res.status(200).json("Продукт успешно удалён!");
        } catch (err) {
            res.status(400).json("Ошибка при удалении товара: " + err.message);
        }
    }
}

export default new ProductController();