import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session"; // For session management
import MongoStore from "connect-mongo"; // MongoDB store for sessions
import dotenv from "dotenv";
import morgan from "morgan";
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

app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(morgan("tiny"));

// Session middleware configuration
app.use(
  session({
    secret: process.env.SECRET_KEY || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI as string,
      ttl: 14 * 24 * 60 * 60, // 14 days session expiration
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 14 * 24 * 60 * 60 * 1000, // Cookie expiry time (14 days)
      sameSite: "lax",
    },
  })
);

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

// Middleware to ensure user is authenticated
function isAuthenticated(
  req: Request & { session: any },
  res: Response,
  next: NextFunction
) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized access" });
  }
}

// Register User
app.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const newUser = new User({ username, password });
    await newUser.save();

    req.session.user = {
      id: newUser._id.toString(),
      username: newUser.username,
    }; // Store user info in session

    res.status(201).json({
      message: "User successfully registered!",
      user: newUser.username,
    });
  } catch (error) {
    res.status(400).json({ error: "Error registering user" });
    console.error("Error registering user", error);
  }
});

// Login User
app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    req.session.user = { id: user._id.toString(), username: user.username }; // Store user info in session

    res.status(200).json({ message: "Logged in", user: user.username });
  } catch (error) {
    res.status(500).json({ error: "Error logging in user" });
    console.error("Error logging in user", error);
  }
});

app.get("/secure", isAuthenticated, (req: Request, res: Response) => {
  if (req.session && req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// Save Diagram
app.post(
  "/save",
  isAuthenticated,
  async (req: Request & { session: any }, res: Response) => {
    const { name, dots } = req.body;
    const userId = req.session.user?.id;

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
  }
);

// Load Diagrams
app.get(
  "/load",
  isAuthenticated,
  async (req: Request & { session: any }, res: Response) => {
    const userId = req.session.user?.id;

    try {
      const diagrams = await Diagram.find({ userId });
      res.status(200).json(diagrams);
      console.log("Here are the diagrams");
    } catch (error) {
      res.status(500).json({ error: "Error loading diagrams" });
      console.log(error);
    }
  }
);

// Logout
app.post("/logout", (req: Request & { session: any }, res: Response) => {
  req.session.destroy((err: any) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.status(200).json({ message: "Logged out successfully" });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
