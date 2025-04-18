const sqlite3 = require('sqlite3');
const db = new sqlite3.Database("todo.db", async (err) => {
  if (err) console.error("Error opening database:", err.message);
  else console.log("Connected to the todo database.");
});

// Create the todos table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      priority TEXT NOT NULL,
      is_complete BOOLEAN,
      is_fun BOOLEAN
    )
  `);
});

module.exports = db;