import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define the User schema with diagrams field, which you might want to use later
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  diagrams: [{ name: String, dots: [mongoose.Schema.Types.Mixed] }], // No direct TypeScript use here
});

const User = mongoose.model("User", UserSchema);

app.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: "User successfully registered!" });
  } catch (error) {
    res.status(400).json({ error: "Error encountered with registering user" });
    console.error("Error with the server", error);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
