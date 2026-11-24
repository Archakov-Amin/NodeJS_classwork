import User from "../models/User.js";
import tokenService from "../services/tokenService.js";

class Auth {
    async authUser(req, res, next) {
        try {
            // 1) Достаём токен из заголовка
            const token = tokenService.extractToken(req);

            if (!token) {
                return res.status(401).json({ message: "Токен отсутствует" })
            }

            // 2) Проверяем подпись и срок токена (далее расшиф)
            const payload = tokenService.verifyToken(token);

            // 3) Ищем пользователя по id
            const user = await User.findById(payload.id);

            if (!user) {
                return res.status(401).json({ message: "Пользователь не найден" })
            }

            // Кладём в req.user найденного пользователя и идём дальше
            req.user = user;
            next()
        } catch (err) {
            return res.status(401).json({ message: "Невалидный токен" })
        }
    }
}

export default new Auth();