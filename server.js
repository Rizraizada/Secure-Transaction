const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash'); // Import express-flash
const path = require('path');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { handleError } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Set up view engine and static files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 app.use(express.static(path.join(__dirname, 'public')));



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Add express-flash middleware
app.use(flash());

// Login route handler
app.get('/login', function(req, res) {
    res.render('auth/login'); // Corrected path to match the directory structure
});
app.get('/register', function(req, res) {
    res.render('auth/register'); // Corrected path to match the directory structure
});
app.post('/register', function(req, res) {
    res.render('auth/register'); // Corrected path to match the directory structure
});

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

// Error handling middleware
app.use(handleError);

// Start server
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
