// express-session.d.ts
import "express-session";
import { ObjectId } from "mongoose";

declare module "express-session" {
  interface SessionData {
    user: { id: string | ObjectId; username: string };
  }
}
