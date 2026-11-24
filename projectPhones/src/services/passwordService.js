import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

class PasswordService {
    async hashPassword(password) {
        console.log(bcrypt.hash(password, SALT_ROUNDS));
        return bcrypt.hash(password, SALT_ROUNDS);
    }

    async comparePassword(password, hashPassword) {
        return bcrypt.compare(password, hashPassword);
    }
}

export default new PasswordService();
