// server.js

const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/auth', authRoutes); // Mounting auth routes

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
