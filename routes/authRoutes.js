// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');

const router = express.Router();

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'secure_transaction'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database');
    return;
  }
  console.log('Connected to MySQL database');
});

router.post('/register', (req, res) => {
  const { username, password, role } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password');
      res.sendStatus(500);
      return;
    }

    const newUser = { username, password: hash, role };
    connection.query('INSERT INTO users SET ?', newUser, (err, result) => {
      if (err) {
        console.error('Error registering user');
        res.sendStatus(500);
        return;
      }
      res.sendStatus(201);
    });
  });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, rows) => {
      if (err) {
        console.error('Error fetching user');
        res.sendStatus(500);
        return;
      }
  
      if (rows.length === 0) {
        res.status(401).send('Invalid username or password');
        return;
      }
  
      const user = rows[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error('Error comparing passwords');
          res.sendStatus(500);
          return;
        }
        if (result) {
          // Check if the user is an admin
          if (user.role === 'admin') {
            // Redirect to admin dashboard
            res.redirect('/admin/index.html');
          } else {
            // Redirect to user dashboard
            res.redirect('/admin/index2.html');
          }
        } else {
          res.status(401).send('Invalid username or password');
        }
      });
    });
});

  

module.exports = router;
