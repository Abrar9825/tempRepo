const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON and serve static files
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/newfortemp')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
    name: String,
    password: String,
});

const User = mongoose.model('User', userSchema);
console.log("hello");

// public folder


// Serve Login Page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// Signup Route
app.post('/signup', async (req, res) => {
    const { name, password } = req.body;

    try {
        // Save new user to the database
        const user = new User({ name, password });
        await user.save();
        res.redirect('/login');
        
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        // Find user with matching credentials
        const user = await User.findOne({ name, password });

        if (!user) {
            return res.status(401).json({ message: 'Invalid name or password' });
        }

        res.status(200).json({ message: 'Login successful', userId: user.name });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});