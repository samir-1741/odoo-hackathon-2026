const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phoneNumber, city, country, additionalInfo, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    // Check if user exists efficiently
    const [users] = await db.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);

    if (users.length > 0) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const [result] = await db.execute(
        'INSERT INTO users (firstName, lastName, email, phoneNumber, city, country, additionalInfo, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, phoneNumber || null, city || null, country || null, additionalInfo || null, hashedPassword]
    );

    res.status(201).json({
        id: result.insertId,
        firstName,
        lastName,
        email,
        token: generateToken(result.insertId)
    });
});

exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Check for user email
    const [users] = await db.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    const user = users[0];

    if (user && (await bcrypt.compare(password, user.password_hash))) {
        res.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profile_image: user.profile_image,
            token: generateToken(user.id)
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

exports.getMe = asyncHandler(async (req, res) => {
    const [users] = await db.execute('SELECT id, firstName, lastName, email, phoneNumber, city, country, additionalInfo, profile_image, created_at FROM users WHERE id = ? LIMIT 1', [req.user.id]);
    
    if (users.length === 0) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json(users[0]);
});
