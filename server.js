const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Replace 'your_mongodb_connection_string' with your actual MongoDB connection string
const mongoURI =
  "mongodb+srv://monirullah:monirullah@cluster0.hzzupx7.mongodb.net/todoReduxApp?retryWrites=true&w=majority";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// mongoose connection

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define a sample schema and model
const SampleSchema = new mongoose.Schema({
  title: String,
  todoId: String,
  description: String,
  priority: String,
  isCompleted: Boolean,
});

const SampleModel = mongoose.model("Sample", SampleSchema);

// API endpoint to get data from MongoDB
app.get("/api/todos", async (req, res) => {
  try {
    const query = {};
    if (req.query.priority && req.query.priority !== "default") {
      query.priority = req.query.priority;
    }

    const data = await SampleModel.find(query).sort({
      isCompleted: 1,
      title: 1,
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Updating Todos

app.patch("/api/todo/:id", async (req, res) => {
  try {
    const { isCompleted, ...data } = req.body;
    const tId = req.params.id;
    console.log(tId);
    const result = await SampleModel.findOneAndUpdate({ todoId: tId }, data, {
      new: true,
    });
    res.json({
      result,
    });
  } catch (error) {
    console.log(error);
  }
});

// Add  Todos

app.post("/api/todo", async (req, res) => {
  try {
    const todoData = req.body;
    console.log({ todoData });

    const result = await SampleModel.create(todoData);

    return res.json({
      result,
    });
  } catch (error) {
    console.log(error);
  }
});
// Delete  Todos

app.delete("/api/todo/:todoId", async (req, res) => {
  try {
    const todoId = req.params.todoId;

    const result = await SampleModel.findOneAndDelete({ todoId });

    return res.json({
      result,
    });
  } catch (error) {
    console.log(error);
  }
});

// todo is Complete

app.put("/api/todo/:id", async (req, res) => {
  try {
    const { isCompleted } = req.body;
    const tId = req.params.id;

    // console.log("isComplete", { tId, isCompleted });
    const result = await SampleModel.findOneAndUpdate(
      { todoId: tId },
      { isCompleted: isCompleted },
      {
        new: true,
      }
    );

    const sortedValue = await SampleModel.find().sort({ isCompleted: 1 });
    console.log({ sortedValue });
    return res.json({
      sortedValue,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
