"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session")); // For session management
const connect_mongo_1 = __importDefault(require("connect-mongo")); // MongoDB store for sessions
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
// Connect to MongoDB
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));
app.use((0, morgan_1.default)("tiny"));
// Session middleware configuration
app.use((0, express_session_1.default)({
    secret: process.env.SECRET_KEY || "supersecretkey", // Use a strong secret key
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({
        mongoUrl: process.env.MONGO_URI, // Use the same MongoDB URI
        ttl: 14 * 24 * 60 * 60, // 14 days session expiration
    }),
    cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 14 * 24 * 60 * 60 * 1000, // Cookie expiry time (14 days)
        sameSite: "lax",
    },
}));
// Schemas
const UserSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    friends: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    diagrams: [{ name: String, dots: [mongoose_1.default.Schema.Types.Mixed] }],
});
const User = mongoose_1.default.model("User", UserSchema);
const DiagramSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    dots: [{ x: Number, y: Number }],
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
});
const Diagram = mongoose_1.default.model("Diagram", DiagramSchema);
// Middleware to ensure user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    }
    else {
        res.status(401).json({ message: "Unauthorized access" });
    }
}
// Register User
app.post("/register", async (req, res) => {
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
    }
    catch (error) {
        res.status(400).json({ error: "Error registering user" });
        console.error("Error registering user", error);
    }
});
// Login User
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        req.session.user = { id: user._id.toString(), username: user.username }; // Store user info in session
        res.status(200).json({ message: "Logged in", user: user.username });
    }
    catch (error) {
        res.status(500).json({ error: "Error logging in user" });
        console.error("Error logging in user", error);
    }
});
app.get("/secure", isAuthenticated, (req, res) => {
    if (req.session && req.session.user) {
        res.status(200).json({ user: req.session.user });
    }
    else {
        res.status(401).json({ message: "Unauthorized" });
    }
});
// Save Diagram
app.post("/save", isAuthenticated, async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: "Error saving diagram" });
        console.log("Error:", error);
    }
});
// Load Diagrams
app.get("/load", isAuthenticated, async (req, res) => {
    const userId = req.session.user?.id;
    try {
        const diagrams = await Diagram.find({ userId });
        res.status(200).json(diagrams);
        console.log("Here are the diagrams");
    }
    catch (error) {
        res.status(500).json({ error: "Error loading diagrams" });
        console.log(error);
    }
});
// Logout
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
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
