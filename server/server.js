"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jwtUtils_1 = require("./jwtUtils");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));
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
//client requests to register user to MongoDB
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password });
        await newUser.save();
        const token = (0, jwtUtils_1.generateToken)(username);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        res.status(201).json({
            message: "User successfully registered!",
            user: newUser.username,
        });
    }
    catch (error) {
        res.status(400).json({ error: "Error encountered with registering user" });
        console.error("Error with the server", error);
    }
});
//Handle client requests to fetch user from MongoDB
app.post("/login", async (req, res) => {
    const { username, password } = req.body; //Destructure client data
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: "Incorrect password" });
        }
        const token = (0, jwtUtils_1.generateToken)(username);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
        console.error("Error fetching user data:", error);
    }
});
//process cookie data to send back to client
app.get("/secure", jwtUtils_1.authenticateToken, (req, res) => {
    res.status(200).json({ message: "Protected data", user: req.user?.username });
});
// Receive fretboard diagrams to post to the database
app.post("/save", jwtUtils_1.authenticateToken, async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: "Error saving diagram" });
        console.log("Error:", error);
    }
});
//receieve request from client to send the saved diagram back to the user
app.get("/load", jwtUtils_1.authenticateToken, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(400).json({ error: "User not authenticated" });
    }
    try {
        const diagrams = await Diagram.find({ userId });
        res.status(200).json(diagrams);
        console.log("Here is the diagram");
    }
    catch (error) {
        res.status(500).json({ error: "Error loading diagram" });
        console.log(error);
    }
});
// Delete diagram by ID
app.delete("/delete", jwtUtils_1.authenticateToken, async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: "Error deleting diagram" });
        console.error("Error:", error);
    }
});
app.get("/test-token", jwtUtils_1.authenticateToken, (req, res) => {
    res.status(200).json({ message: "Token is valid", user: req.user });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
const SECRET_KEY = process.env.SECRET_KEY;
