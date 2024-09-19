import express from "express";
import bodyParser from "body-parser";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { connectDB, Login } from "./mongoose.js"; // Importing the Mongoose connection and model
import dotenv from "dotenv";
import bcrypt from "bcrypt"; // Import bcrypt for hashing passwords

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

// Connect to MongoDB
connectDB()
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Middleware to check password for login
async function passwordCheck(req, res, next) {
  const { name, password } = req.body;
  try {
    const user = await Login.findOne({ name });
    if (user && (await bcrypt.compare(password, user.password))) {
      req.user = user; // Store the user information in the request object to use in the route handler
      return next(); // Credentials are correct, proceed to the next handler
    } else {
      res.status(401).sendFile(join(__dirname, "templates", "login.html")); // Unauthorized, send back to login
    }
  } catch (err) {
    console.error("Error during password check:", err);
    return res.status(500).send("Internal server error");
  }
}

// Routes
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "templates", "login.html"));
});

app.post("/login", passwordCheck, (req, res) => {
  // User credentials are checked in the middleware
  res.sendFile(join(__dirname, "templates", "texttranslator.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(join(__dirname, "templates", "signup.html"));
});

app.post("/signup", async (req, res) => {
  const { name, password } = req.body;
  try {
    const existingUser = await Login.findOne({ name });
    if (existingUser) {
      return res.status(400).send("User already exists. Please choose another name.");
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving
    const newUser = new Login({ name, password: hashedPassword });
    await newUser.save();

    res.redirect("/"); // Redirect to login page after successful signup
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).send("Internal server error");
  }
});

app.get("/forget", (req, res) => {
  res.sendFile(join(__dirname, "templates", "forget.html"));
});

app.post("/forget", async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await Login.findOne({ name });
    if (!user) {
      return res.status(404).send("User not found.");
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
    user.password = hashedPassword;
    await user.save();

    res.redirect("/");
  } catch (err) {
    console.error("Error during password reset:", err);
    res.status(500).send("Internal server error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
