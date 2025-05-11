const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Mock database
let users = [];

// Routes

// Signup
app.post('/user/signup', (req, res) => {
    const { name, emailid, password } = req.body;

    if (users.find(user => user.emailid === emailid)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = { name, emailid, password };
    users.push(newUser);
    res.json({ message: 'Signup successful', user: newUser });
});

// Login
app.post('/user/login', (req, res) => {
    const { emailid, password } = req.body;

    const user = users.find(u => u.emailid === emailid && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.cookie('sessionid', `${emailid}-${Date.now()}`, {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({ message: 'Login successful', user });
});

// Forgot Password
app.post('/user/forgotpassword', (req, res) => {
    const { emailid } = req.body;

    const user = users.find(u => u.emailid === emailid);
    if (!user) {
        return res.status(404).json({ message: 'Email not found' });
    }

    // Mock sending reset link
    res.json({ message: `Password reset link sent to ${emailid}` });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
