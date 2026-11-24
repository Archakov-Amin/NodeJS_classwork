import User from "../models/User.js";
import passwordService from "../services/passwordService.js";
import tokenService from "../services/tokenService.js";


class UserController {
    async register(req, res) {
        try {
            const { firstName, lastName, email, password } = req.body
            const user = await User.findOne({ email })
            if (user) {
                res.status(400).json({ message: "Пользователь с такой почтой уже существует" })
            }

            const hash = await passwordService.hashPassword(password)
            console.log(hash);


            const newUser = await User.create({ firstName, lastName, email, password: hash });

            const token = tokenService.generateToken(newUser._id);

            return res.status(200).json({
                token, 
                user: {
                    id: newUser._id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    avatar: newUser.avatar,
                    role: newUser.role
                }
            });
        } catch (err) {
            res.status(500).json({ message: "Ошибка при регистрации" }, err)
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Email и пароль обязательны для заполнения!" })
            }

            const user = await User.findOne({ email }).select("+password")

            const isPassword = await passwordService.comparePassword(password, user.password);

            if (!isPassword) {
                return res.status(400).json({ message: "Неверные данные" });
            }

            const token = tokenService.generateToken(user._id);
            console.log(token);

            return res.status(200).json({
                token, 
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role
                }
            });
        } catch (err) {
            res.status(500).json({ message: "Ошибка при авторизации" }, err);
        }
    }

    async getMe(req, res) {
        const {_id, firstName, lastName, email, avatar, role} = req.user;

        res.json({id: _id, firstName, lastName, email, avatar, role});
    }
}

export default new UserController();