import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { generateToken, authenticateToken } from "./jwtUtils";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  diagrams: [{ name: String, dots: [mongoose.Schema.Types.Mixed] }],
});

const User = mongoose.model("User", UserSchema);

//client requests to register user to MongoDB
app.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = generateToken(username);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(201).json({
      message: "User successfully registered!",
      user: newUser.username,
    });
  } catch (error) {
    res.status(400).json({ error: "Error encountered with registering user" });
    console.error("Error with the server", error);
  }
});

//client requests to fetch user from MongoDB
app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = generateToken(username);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.error("Error fetching user data:", error);
  }
});
app.get("/secure", authenticateToken, (req: Request, res: Response) => {
  res.status(200).json({ message: "Protected data", user: req.user?.username });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

const SECRET_KEY = process.env.SECRET_KEY as string;
console.log("SECRET_KEY:", SECRET_KEY);

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined");
}
