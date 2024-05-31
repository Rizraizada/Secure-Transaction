const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash'); // Import express-flash
const path = require('path');
const bodyParser = require('body-parser');

const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const transactionRoutes = require('./routes/transactionRoute');
const transactionController = require('./controllers/transactionController');

 
const { handleError } = require('./middleware/errorMiddleware');
 const router = express.Router();

const app = express();
const PORT = process.env.PORT || 3001;

// Set up view engine and static files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 app.use(express.static(path.join(__dirname, 'public')));


 app.use(bodyParser.json());

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

 app.use(flash());

 app.get('/login', function(req, res) {
    res.render('auth/login'); // Corrected path to match the directory structure
});
app.get('/register', function(req, res) {
    res.render('auth/register'); // Corrected path to match the directory structure
});
 app.post('/register', function(req, res) {
    console.log('Request body:', req.body); // Log the request body
    // Process the registration logic
    res.render('auth/register');
});
app.post('/deposit', transactionController.deposit);
app.post('/withdraw', transactionController.withdraw);

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/transaction', transactionRoutes);


 app.use(handleError);

 sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});