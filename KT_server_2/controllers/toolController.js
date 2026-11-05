import fileService from "../middleware/fileService.js";
import Tool from "../models/Tool.js";

class ToolController {
  async getTools(req, res) {
    try {
      const tools = await Tool.find();
      res.status(200).json(tools);
    } catch (err) {
      res.status(401).json(`Ошибка при получении инструментов: ${err}`);
    }
  }

  async getTool(req, res) {
    try {
      const { id } = req.params;
      const tool = await Tool.findById(id);

      if (!tool) {
        res.status(404).json("Инструмент с таким ID отсутствует в БД!");
      }
      res.status(200).json(tool);
    } catch (err) {
      res.status(500).json(`Ошибка при получении инструмента: ${err}`);
    }
  }

  async addTool(req, res) {
    try {
      let fileName = null;

      if (req.files && req.files.tool_image) {
        fileName = await fileService.saveFile(req.files.tool_image);
      }

      const { title, model, description, price } = req.body;
      const newTool = await Tool.create({
        title,
        model,
        description,
        price,
        tool_image: fileName,
      });

      res.status(200).json(newTool);
      newTool.save();
    } catch (err) {
      res.status(500).json(`Ошибка при добавлении инструмента: ${err}`);
      console.error(`Ошибка при добавлении инструмента: ${err}`);
    }
  }

  async editTool(req, res) {
    try {
      const { id } = req.params;

      const editTool = await Tool.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );

      if (!editTool) {
        res.status(404).json("Инструмент с таким ID отсутствует в БД!");
      }

      res.status(200).json(editTool);
    } catch (err) {
      res.status(500).json(`Ошибка при удалении инструмента: ${err}`);
    }
  }

  async updateTool(req, res) {
    try {
      const { id } = req.params;
      const { title, model, description, price } = req.body;
      const updateTool = await Tool.findByIdAndUpdate(
        id,
        {
          title,
          model,
          description,
          price,
        },
        { new: true }
      );

      if (!updateTool) {
        res.status(404).json("Инструмент с таким ID отсутствует в БД!");
      }

      res.status(200).json(updateTool);
    } catch (err) {
      res.status(500).json(`Ошибка при обновлении инструмента: ${err}`);
    }
  }

  async deleteTool(req, res) {
    try {
      const { id } = req.params;
      const deleteTool = await Tool.findByIdAndDelete(id);

      if (!deleteTool) {
        res.status(404).json("Инструмент с таким ID отсутствует в БД!");
      }
      res.status(200).json("Инструмент успешно удалён!");
    } catch (err) {
      res.status(500).json(`Ошибка при удалении инструмента: ${err}`);
    }
  }
}

export default new ToolController();
