"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = isAuthenticated;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_KEY;
// Middleware to ensure the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        // If session and user data exist, the user is authenticated
        next();
    }
    else {
        return res.status(401).json({ message: "Unauthorized access" });
    }
}
