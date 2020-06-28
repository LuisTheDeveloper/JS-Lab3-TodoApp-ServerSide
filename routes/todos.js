const { v4: uuidv4 } = require("uuid");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

const today = Date.now();

let todos = [
  {
    id: uuidv4(),
    text: "Learn about React Ecosystems",
    createdAt: today,
    isCompleted: false,
  },
  {
    id: uuidv4(),
    text: "Get together with friends!",
    createdAt: today - 86400000 * 7,
    isCompleted: false,
  },
  {
    id: uuidv4(),
    text: "Buy groceries",
    createdAt: today - 86400000 * 14,
    isCompleted: true,
  },
];

var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

app.use(allowCrossDomain);

router.get("/", (req, res) => {
  console.log("GET /todos");
  res.status(200).json(todos);
});

router.post(
  "/",
  [check("text", "Text is required").not().isEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { text } = req.body;
      const num = Math.floor(Math.random() * Math.floor(52));
      const JsonDate = new Date().toJSON();

      const newTodo = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        isCompleted: false,
        text: text,
      };
      todos.push(newTodo);
      res.status(200).json(newTodo);
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }
);

router.post("/:id/completed", (req, res) => {
  const id = req.params.id;
  console.log(`POST /todos/${id}/completed`);
  const todoIndex = todos.findIndex((todo) => todo.id === id);
  (todos[todoIndex].isCompleted = true), res.status(200).json(todos[todoIndex]);
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  console.log(`DELETE /todos/${id}`);
  const todoIndex = todos.findIndex((todo) => todo.id === id);
  const deletedTodo = todos.splice(todoIndex, 1);
  res.status(200).json(deletedTodo[0]);
});
module.exports = router;
