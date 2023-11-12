// app.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes'); // Import authRoutes
const homeController = require('./controllers/homeController'); // Import homeController
const { redirectHome, redirectLogin } = require('./middlewares/authMiddleware'); // Import authMiddlewares

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
    PORT = 3000,
    NODE_ENV = 'development',
    SESS_NAME = 'sid',
    SESS_SECRET = 'hd.thanhtri',
    SESS_LIFETIME = TWO_HOURS
} = process.env;

const IN_PROD = NODE_ENV === 'production';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD
    }
}));

// Set the views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/auth', authRoutes); // Sử dụng authRoutes tại /auth

app.get('/', redirectHome, homeController.index);

// ... Other routes and middleware

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
