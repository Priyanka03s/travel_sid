const AdditionalQuestion = require("../models/AdditionalQuestion");

// GET
exports.getAdditionalQuestions = async (req, res) => {
  try {
    const questions = await AdditionalQuestion.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST/UPDATE (Admin panel)
exports.updateAdditionalQuestions = async (req, res) => {
  try {
    const { questions } = req.body; // expects array of {question, type}

    // Remove all old questions (or handle smarter updates)
    await AdditionalQuestion.deleteMany({});

    // Insert new ones
    const inserted = await AdditionalQuestion.insertMany(questions);

    res.json({ message: "Questions updated", questions: inserted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
