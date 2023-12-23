const express = require("express");
const { connectDB, ToDo, PORT } = require("./config");

const app = express();

app.use(express.json());

connectDB().catch((error) => {
  console.log(error.message);
  process.exit(1);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/todo", async (req, res) => {
  const todos = await ToDo.find();
  if (!todos) {
    return res.status(404).json({ error: "No todos found" });
  }
  const response = {
    data: todos.map((todo) => {
      return {
        id: todo._id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
      };
    }),
  };
  res.json(response);
});

app.get("/todo/:id", async (req, res) => {
  try {
    const todo = await ToDo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    const response = {
      data: {
        id: todo._id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
      },
    };
    res.json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: "Todo not found" });
  }
});

app.put("/todo/:id", async (req, res) => {
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.completed ||
    typeof req.body.completed !== "boolean"
  ) {
    return res.status(400).json({ error: "Invalid request" });
  }
  if ((await ToDo.findById(req.params.id)) === null) {
    return res.status(404);
  }
  try {
    const todo = await ToDo.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed,
      },
      { new: true }
    );

    const response = {
      data: {
        id: todo._id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
      },
    };
    res.json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: "Todo not found" });
  }
});

app.post("/todo", async (req, res) => {
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.completed ||
    typeof req.body.completed !== "boolean"
  ) {
    return res.status(400).json({ error: "Invalid request" });
  }
  const todo = new ToDo({
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed,
  });
  await todo.save();
  const response = {
    data: {
      id: todo._id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
    },
  };
  res.json(response);
});

app.delete("/todo/:id", async (req, res) => {
  try {
    const todo = await ToDo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted" });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: "Todo not found" });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
