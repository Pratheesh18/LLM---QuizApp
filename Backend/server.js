const express = require('express');
const {GoogleGenerativeAI} = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
if(!apiKey){
    console.error('Error in api key');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({model:'gemini-2.0-flash'});

app.post('/generate-subquestions', async (req, res) => {
  try {
    // Get the main question from the request body
    const { mainQuestion } = req.body;
    if (!mainQuestion) {
      return res.status(400).json({ error: 'Main question is required' });
    }

    // Define the prompt for Gemini
    const prompt = `
      Given the following A-Level exam question: "${mainQuestion}"
      Generate 3 multiple-choice subquestions that cover the fundamental concepts needed to solve it.
      Each subquestion must have 4 options (A, B, C, D) with one correct answer.
      Return the response as valid JSON only, with no additional text or explanations, in this exact format:
      {
        "subquestions": [
          {
            "question": "Subquestion text",
            "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
            "correctAnswer": "A"
          },
          {
            "question": "Subquestion text",
            "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
            "correctAnswer": "B"
          },
          {
            "question": "Subquestion text",
            "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
            "correctAnswer": "C"
          }
        ]
      }
      Do not include any text outside the JSON structure. Ensure the JSON is syntactically correct and can be parsed directly.
    `;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // Log the raw response for debugging
    console.log('Raw Gemini Response:', responseText);

    // Clean the response: Remove markdown code fences and extra newlines
    responseText = responseText
      .replace(/```json\n?/, '') // Remove opening ```json and optional newline
      .replace(/\n?```/, '')     // Remove closing ``` and optional newline
      .trim();                   // Remove any remaining whitespace

    // Log the cleaned response
    console.log('Cleaned Response:', responseText);

    // Parse the response
    let subquestions;
    try {
      subquestions = JSON.parse(responseText);
    } catch (parseError) {
      return res.status(500).json({
        error: 'Failed to parse Gemini response',
        rawResponse: responseText,
      });
    }

    // Validate the response structure
    if (!subquestions.subquestions || !Array.isArray(subquestions.subquestions) || subquestions.subquestions.length !== 3) {
      return res.status(500).json({
        error: 'Invalid response format from Gemini',
        rawResponse: responseText,
      });
    }

    // Send the subquestions back to the client
    res.json(subquestions);
  } catch (error) {
    console.error('Error generating subquestions:', error.message);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });