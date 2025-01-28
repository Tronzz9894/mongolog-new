const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/quizapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// User model for authentication
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
}));

// Quiz model
const Quiz = mongoose.model('Quiz', new mongoose.Schema({
  question: { type: String, required: true },
  options: [String],
  correctAnswer: String
}));

// Score model to store the user's score
const Score = mongoose.model('Score', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: { type: Number, required: true }
}));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).send('Access denied');

  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
};

// Routes

// Login route to authenticate users
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).send('Invalid credentials');
  }

  const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
  res.json({ token });
});

// Quiz route
app.get('/api/quiz', authenticateToken, async (req, res) => {
  const quiz = await Quiz.find();
  res.json({ data: quiz });
});

// Route to save score after completing the quiz
app.post('/api/score', authenticateToken, async (req, res) => {
  const { score } = req.body;

  const newScore = new Score({
    userId: req.user.userId,
    score: score
  });

  await newScore.save();
  res.json({ message: 'Score saved successfully!' });
});

// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
