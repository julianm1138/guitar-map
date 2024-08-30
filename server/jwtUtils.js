"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
    console.error("SECRET_KEY is not defined or is empty");
}
//generate JWT token
const generateToken = (username) => {
    return jsonwebtoken_1.default.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
};
exports.generateToken = generateToken;
//authenticate requests middleware
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send("Unauthorized");
    }
    return (jsonwebtoken_1.default.verify(token, SECRET_KEY),
        (err, user) => {
            if (err) {
                return res.status(403).send("Forbidden");
            }
            req.user = user;
            next();
        });
};
exports.authenticateToken = authenticateToken;
