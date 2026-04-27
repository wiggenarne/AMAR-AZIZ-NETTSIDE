// claude-api.js - Integration for Claude API

const axios = require('axios');

// Function to generate code using the Claude API
async function generateCode(prompt) {
    const response = await axios.post('https://api.claude.ai/v1/generate', { prompt });
    return response.data;
}

// Function to assist with code suggestions
async function assistCode(prompt) {
    const response = await axios.post('https://api.claude.ai/v1/assist', { prompt });
    return response.data;
}

// Export functions for external use
module.exports = { generateCode, assistCode };