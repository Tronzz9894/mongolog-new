const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect('mongodb+srv://reactassess:<password>@cluster0.kuctm.mongodb.net/myDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const User = require('./models/User');

// POST /signup
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already registered.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(200).send('Signup successful!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
