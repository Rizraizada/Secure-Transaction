const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const mysql = require('mysql');
const router = express.Router();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'secret-key', // Change this to a random secret key
  resave: false,
  saveUninitialized: true
}));

// Serve static files from the public folder
app.use(express.static('public'));

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'secure_transaction'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.message);
    return;
  }
  console.log('Connected to MySQL database');
});

// Register a new user
app.post('/auth/register', (req, res) => {
  const { username, password, role } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err.message);
      res.status(500).send('Internal Server Error');
      return;
    }

    const newUser = { username, password: hash, role };
    connection.query('INSERT INTO users SET ?', newUser, (err, result) => {
      if (err) {
        console.error('Error registering user:', err.message);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.sendStatus(201);
    });
  });
});

// Define route for serving admin dashboard
app.get('/admin', authenticateToken, (req, res) => {
  if (req.session.user && req.session.user.role === 'admin') {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
  } else {
    res.redirect('/auth/login');
  }
});

// Define route for serving user dashboard
app.get('/user', authenticateToken, (req, res) => {
  if (req.session.user && req.session.user.role === 'user') {
    res.sendFile(path.join(__dirname, 'public', 'user', 'index2.html'));
  } else {
    res.redirect('/auth/login');
  }
});

// Middleware to verify JWT token and set user data in session
function authenticateToken(req, res, next) {
  const token = req.session.token;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.session.user = user;
    next();
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = router;
