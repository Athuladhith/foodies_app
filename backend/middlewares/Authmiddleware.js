"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'You are not able to view this page' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Bearer token missing' });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        const decoded = decodedToken;
        req.user = {
            _id: decoded.userId,
            email: decoded.email,
            isAdmin: decoded.isAdmin,
        };
        next();
    });
};
exports.default = authenticateJWT;
