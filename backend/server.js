const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve frontend files
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

// Load or initialize users
const USERS_FILE = path.join(__dirname, 'users.json');
let users = {};
if (fs.existsSync(USERS_FILE)) {
  users = JSON.parse(fs.readFileSync(USERS_FILE));
}

// Register
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    return res.status(400).send('User already exists');
  }
  users[username] = { password };
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.redirect('/frontend/dashboard.html');
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username]?.password === password) {
    res.redirect('/frontend/dashboard.html');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
