const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// model.generateContent('helo').then(res => console.log(res?.response?.text())).catch(err => {
//   console.log('error', err)
// })

async function analyzeTask(title, description, redisClient) {
  const cacheKey = `task_analysis:${title}:${description}`;

  if (redisClient && redisClient.isOpen) {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  }

  const prompt = `Analyze the following task and provide its difficulty, category, and a hex color code.
    
    Task Title: ${title}
    Task Description: ${description}
    
    You are a full stack senior lead and well as having mastery in cooking, gardening, finance, personal life and
    and you have to find the matching cateogry for the given description within these Coding, Personal, Finance, Gardening, Cooking, Other
    and you know task difficuties well. Read the description carefully.
    Difficulty level should be between 0 and 10.
    
    Use these specific color codes for the categories:
    - Coding: #6366f1
    - Personal: #f43f5e
    - Finance: #10b981
    - Gardening: #22c55e
    - Cooking: #f59e0b
    - Other: #64748b

    Respond ONLY with a JSON object in this format:
    {
      "difficulty": number,
      "category": "string",
      "colorCode": "string"
    }`;

  try {
    const result = await model.generateContent(prompt);

    const response = await result.response;
    let text = response.text();

    if (text.startsWith('```json')) {
      text = text.replace(/```json|```/g, '').trim();
    } else if (text.startsWith('```')) {
      text = text.replace(/```/g, '').trim();
    }

    const analysis = JSON.parse(text);

    if (redisClient && redisClient.isOpen) {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(analysis));
    }

    return analysis;
  } catch (error) {
    console.error('Gemini Analysis failed:', error.message);
    return { difficulty: 5, category: 'Other', colorCode: '#808080' };
  }
}

module.exports = { analyzeTask };
