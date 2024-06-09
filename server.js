// server.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Create or open the database
let db = new sqlite3.Database('./buttons.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the buttons database.');
});

// Create the buttons table
db.run(`CREATE TABLE IF NOT EXISTS buttons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    state TEXT,
    comment TEXT
)`);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get all buttons data
app.get('/api/buttons', (req, res) => {
    db.all(`SELECT * FROM buttons`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

// Update button state and comment
app.post('/api/button', (req, res) => {
    const { id, state, comment } = req.body;
    db.run(`UPDATE buttons SET state = ?, comment = ? WHERE id = ?`, [state, comment, id], function (err) {
        if (err) {
            return console.error(err.message);
        }
        res.json({ updated: this.changes });
    });
});

// Initialize buttons in the database (only run once, then comment out or remove)
const initializeButtons = () => {
    const buttons = Array.from({ length: 20 }, (v, i) => ({
        name: `Button ${i + 1}`,
        state: 'stopped',
        comment: ''
    }));
    buttons.forEach(button => {
        db.run(`INSERT INTO buttons (name, state, comment) VALUES (?, ?, ?)`, [button.name, button.state, button.comment]);
    });
};

// Uncomment the following line to initialize the database then comment it back after first run
// initializeButtons();

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
