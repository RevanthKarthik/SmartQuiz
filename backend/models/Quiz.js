const mongoose = require('mongoose');
const QuizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
  topic: String
});
module.exports = mongoose.model('Quiz', QuizSchema);