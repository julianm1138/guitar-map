import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY as string;

// Middleware to ensure the user is authenticated
export function isAuthenticated(
  req: Request & { session: any },
  res: Response,
  next: NextFunction
) {
  if (req.session && req.session.user) {
    // If session and user data exist, the user is authenticated
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized access" });
  }
}
