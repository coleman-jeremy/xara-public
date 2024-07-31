const express = require('express');
const fetch = require('node-fetch');
const {Storage} = require('@google-cloud/storage');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const storage = new Storage();
const bucket = storage.bucket('xara-public-memories');

async function saveMemory(sessionId, memory) {
  const filename = `memories/${sessionId}.json`;
  const file = bucket.file(filename);
  try {
    await file.save(JSON.stringify(memory));
    console.log(`Memory saved for session ${sessionId}`);
  } catch (error) {
    console.error(`Error saving memory for session ${sessionId}:`, error);
  }
}

async function getMemory(sessionId) {
  const filename = `memories/${sessionId}.json`;
  const file = bucket.file(filename);
  try {
    const [contents] = await file.download();
    console.log(`Memory retrieved for session ${sessionId}`);
    return JSON.parse(contents.toString());
  } catch (error) {
    if (error.code === 404) {
      console.log(`No existing memory for session ${sessionId}`);
      return [];
    }
    console.error(`Error retrieving memory for session ${sessionId}:`, error);
    throw error;
  }
}

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const sessionId = req.body.sessionId;
    
    console.log(`Processing chat for session ${sessionId}`);
    
    let sessionHistory = await getMemory(sessionId);
    sessionHistory.push({ role: 'user', content: userMessage });

    console.log('Current session history:', JSON.stringify(sessionHistory, null, 2));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        messages: sessionHistory,
        max_tokens: 1000,
      }),
    });

    console.log('API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`API responded with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));

    const botResponse = data.content[0].text;
    sessionHistory.push({ role: 'assistant', content: botResponse });

    if (sessionHistory.length > 10) {
      sessionHistory = sessionHistory.slice(-10);
    }

    await saveMemory(sessionId, sessionHistory);

    res.json({ message: botResponse, sessionId: sessionId });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});