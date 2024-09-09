import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { generateToken, authenticateToken } from "./jwtUtils";

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

// Schemas
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  diagrams: [{ name: String, dots: [mongoose.Schema.Types.Mixed] }],
});

const User = mongoose.model("User", UserSchema);

const DiagramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dots: [{ x: Number, y: Number }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Diagram = mongoose.model("Diagram", DiagramSchema);

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

//Handle client requests to fetch user from MongoDB
app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body; //Destructure client data
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

//process cookie data to send back to client
app.get("/secure", authenticateToken, (req: Request, res: Response) => {
  res.status(200).json({ message: "Protected data", user: req.user?.username });
});

// Receive fretboard diagrams to post to the database

app.post("/save", authenticateToken, async (req, res) => {
  console.log("test");
  const { name, dots } = req.body;
  const userId = req.user?.id;

  if (!name || !dots || !userId) {
    return res.status(400).json({ error: "Invalid data" });
  }
  try {
    const newDiagram = new Diagram({ name, dots, userId });
    await newDiagram.save();
    res.status(201).json(newDiagram);
    console.log("Diagram saved successfully");
  } catch (error) {
    res.status(500).json({ error: "Error saving diagram" });
    console.log("Error:", error);
  }
});

//receieve request from client to send the saved diagram back to the user
app.get("/load", authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ error: "User not authenticated" });
  }

  try {
    const diagrams = await Diagram.find({ userId });
    res.status(200).json(diagrams);
    console.log("Here is the diagram");
  } catch (error) {
    res.status(500).json({ error: "Error loading diagram" });
    console.log(error);
  }
});

// Delete diagram by ID
app.delete(
  "/delete",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "User not authenticated" });
    }

    try {
      const result = await Diagram.deleteOne({ _id: id, userId });
      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({ error: "Diagram not found or unauthorized" });
      }
      res.status(200).json({ message: "Diagram deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting diagram" });
      console.error("Error:", error);
    }
  }
);

app.get("/test-token", authenticateToken, (req: Request, res: Response) => {
  res.status(200).json({ message: "Token is valid", user: req.user });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

const SECRET_KEY = process.env.SECRET_KEY as string;
