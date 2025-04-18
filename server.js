// server.js
// A simple Express.js backend for a Todo list API
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database("todo.db", async (err) => {
  if (err) console.error("Error opening database:", err.message);
  else console.log("Connected to the todo database.");
});

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to include static content from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// serve index.html from 'public' at the '/' path
app.get('/', (req, res) => res.sendFile('./public/index.html'));

// GET all todo items at the '/todos' path
app.get('/todos/', (req, res) => {
  db.all("SELECT * FROM Todos", (err, todos) => {
    if (err) return res.status(400).json({'message': err});
    else return res.json(todos);
  });
});

// GET a specific todo item by ID
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.get('SELECT * FROM todos WHERE id = ?', [id], (err, todo) => {
    if (err) res.status(400).json({ message: err });
    else if (todo) return res.json(todo);
    else return res.status(404).json({ message: 'Todo item not found'});
  });
});

// POST a new todo item
const insertQuery = `INSERT INTO Todos (name, priority, is_fun) VALUES (?, ?, ?) RETURNING *`;
app.post('/todos', (req, res) => {
  const { name, priority = 'low', isFun } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });
  db.get(insertQuery, [name, priority, isFun], (err, todo) => {
    if (err) return console.error("Error inserting todo:", err.message);
    else return res.status(201).json(todo);
  });
});

// DELETE a todo item by ID
const deleteQuery = `DELETE FROM Todos WHERE id = ?`;
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.get(deleteQuery, [id], (err) => {
    if (err) return res.status(400).json({ message: err });
    else return res.status(200).json({ message: `Deleted task ${id}`});
  })
});

// Start the server by listening on the specified PORT
app.listen(PORT, () => {
  console.log(`Started the server on port ${PORT}`);
});