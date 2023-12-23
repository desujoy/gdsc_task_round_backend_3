const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    throw new Error("MongoDB connection failed");
  }
};

const ToDoSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
});

const ToDo = mongoose.model("ToDo", ToDoSchema);

module.exports = { connectDB, ToDo, PORT };
