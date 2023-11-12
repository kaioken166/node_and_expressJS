// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const { redirectHome, redirectLogin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Đăng nhập
router.get('/login', redirectHome, authController.login);

// Đăng ký
router.get('/register', redirectHome, authController.register);

// ... Các routes khác liên quan đến xác thực

module.exports = router;
