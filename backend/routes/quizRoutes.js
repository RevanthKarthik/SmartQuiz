const express = require('express'); 
const router = express.Router();    
const Groq = require('groq-sdk');

// Initialize Groq (Make sure your .env has GROQ_API_KEY)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/generate', async (req, res) => {
  const { topic, level, count, type } = req.body;

  // FIX: Use backticks (`) instead of single quotes (') for string interpolation
  const typeInstructions = {
    mcq: `Generate exactly ${count} Single Choice Questions (MCQs). Each must have 4 options and 1 'correctAnswer' string.`,
    msq: `Generate exactly ${count} Multiple Select Questions (MSQs). Each must have 4 options and 'correctAnswer' MUST be an ARRAY of multiple correct strings.`,
    boolean: `Generate exactly ${count} True/False questions. options must be ['True', 'False'] and 'correctAnswer' is a string.`,
    short: `Generate exactly ${count} Short Answer questions. No options array. Provide a 'correctAnswer' string.`
  };

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert exam generator for GATE DA 2026 students. 
          Return ONLY a JSON object with a 'questions' array.
          STRICT RULES:
          1. Topic: ${topic}
          2. Difficulty: ${level}
          3. Total Questions: ${count} 
          4. Format: ${typeInstructions[type]}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const quizData = JSON.parse(chatCompletion.choices[0].message.content);
    
    // Log for debugging in your VS Code terminal
    console.log(`>>> AI Request: ${topic} | ${type} | Count: ${count}`);
    console.log(`>>> AI Response: Received ${quizData.questions.length} questions`);
    
    res.json(quizData.questions);
  } catch (error) {
    console.error("Backend Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// CRITICAL: Export the router so server.js can use it
module.exports = router;