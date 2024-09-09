import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY as string;

//generate JWT token
export const generateToken = (username: string) => {
  return jwt.sign({ username }, SECRET_KEY, { expiresIn: "2h" });
};

//authenticate requests middleware

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  return (
    jwt.verify(token, SECRET_KEY),
    (err: jwt.VerifyErrors | null, user: JwtPayload | undefined) => {
      if (err) {
        return res.status(403).send("Forbidden");
      }
      req.user = user;
      next();
    }
  );
};
