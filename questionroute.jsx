const express = require("express");
const Quiz = require("./models/Quiz");
const router = express.Router();

// Fetch all questions
router.get("/questions", async (req, res) => {
  try {
    const questions = await Quiz.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Add a question (admin only)
router.post("/add", async (req, res) => {
  const { question, options, correctAnswer } = req.body;

  try {
    const newQuiz = new Quiz({ question, options, correctAnswer });
    await newQuiz.save();
    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
