import jwt from "jsonwebtoken";

const JWT_SECRET = "super_secret_key_123";
const JWT_EXPIRES_IN = "24h";

class TokenService {
    generateToken(userID) {
        return jwt.sign({ id: userID }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }

    verifyToken(token) {
        return jwt.verify(token, JWT_SECRET);
    }

    extractToken(req) {
        // Достаём токен из заголовка, а именно из headers => authorization
        const header = req.headers.authorization || ""
        return header.startsWith("Bearer ") ? header.slice(7) : null
    }
}

export default new TokenService();