import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Async function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // Connection string from .env
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

// Define login schema
const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Create the model from the schema
const Login = mongoose.model("Login", loginSchema);

export { connectDB, Login };
