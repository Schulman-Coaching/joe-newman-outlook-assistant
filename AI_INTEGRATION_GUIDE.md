# AI Integration Guide
## Enhancing Joe Newman's Outlook Assistant with AI

This guide explains how to integrate AI services to make the assistant truly intelligent.

## Overview

The current implementation uses rule-based logic. This guide shows how to integrate:
- OpenAI GPT models
- Azure OpenAI Service
- Claude (Anthropic)
- Custom AI models

## Integration Options

### Option 1: OpenAI API (Recommended for Quick Start)

#### Setup

1. **Get API Key**
   - Sign up at https://platform.openai.com
   - Navigate to API Keys
   - Create new secret key
   - Copy and save securely

2. **Install OpenAI SDK**
```bash
npm install openai
```

3. **Update taskpane.js**

Add at the top:
```javascript
// NOTE: For production, use a backend service to protect API keys
// Never expose API keys in client-side code

const OPENAI_API_KEY = 'YOUR_API_KEY_HERE'; // Move to secure backend in production

async function callOpenAI(prompt, systemMessage = '') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 500
        })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
}
```

4. **Update Response Generation**

Replace the `analyzeAndGenerateResponse` function:

```javascript
async function analyzeAndGenerateResponse(emailContent, subject, type) {
    const tone = document.getElementById('tone-selector').value;
    
    let systemMessage = `You are an email assistant for Joe Newman. Generate professional email responses in a ${tone} tone.`;
    
    let prompt = '';
    
    if (type === 'quick') {
        prompt = `Generate a brief acknowledgment reply to this email:
        
Subject: ${subject}
From: ${currentSender}
Content: ${emailContent}

Create a short, ${tone} reply that acknowledges receipt and indicates you'll respond with details soon. Sign as "Joe Newman".`;
    } else if (type === 'detailed') {
        prompt = `Generate a detailed, thoughtful reply to this email:
        
Subject: ${subject}
From: ${currentSender}
Content: ${emailContent}

Create a comprehensive ${tone} response that:
1. Thanks the sender
2. Addresses key points from their message
3. Provides helpful information
4. Suggests next steps
Sign as "Joe Newman".`;
    } else if (type === 'meeting') {
        prompt = `Generate a meeting proposal reply to this email:
        
Subject: ${subject}
From: ${currentSender}
Content: ${emailContent}

Create a ${tone} response that:
1. Acknowledges the meeting need
2. Suggests 2-3 time slots (use generic placeholders)
3. Asks for their preference
Sign as "Joe Newman".`;
    }
    
    return await callOpenAI(prompt, systemMessage);
}
```

### Option 2: Azure OpenAI Service

Azure OpenAI provides enterprise-grade security and compliance.

#### Setup

1. **Create Azure Resource**
   - Sign in to Azure Portal
   - Create "Azure OpenAI" resource
   - Deploy a model (e.g., gpt-4)
   - Get endpoint and API key

2. **Install Azure SDK**
```bash
npm install @azure/openai
```

3. **Implementation**

```javascript
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const endpoint = "https://YOUR_RESOURCE.openai.azure.com/";
const azureApiKey = "YOUR_AZURE_KEY";
const deploymentName = "YOUR_DEPLOYMENT_NAME";

const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));

async function generateWithAzure(prompt, systemMessage) {
    const messages = [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
    ];
    
    const result = await client.getChatCompletions(deploymentName, messages);
    return result.choices[0].message.content;
}
```

### Option 3: Claude (Anthropic)

#### Setup

1. **Get API Key**
   - Sign up at https://console.anthropic.com
   - Get API key from account settings

2. **Install Anthropic SDK**
```bash
npm install @anthropic-ai/sdk
```

3. **Implementation**

```javascript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: 'YOUR_ANTHROPIC_API_KEY'
});

async function generateWithClaude(prompt, systemMessage) {
    const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemMessage,
        messages: [{
            role: 'user',
            content: prompt
        }]
    });
    
    return message.content[0].text;
}
```

## Enhanced Features with AI

### 1. Smart Task Extraction

Replace `analyzeEmailForTasks`:

```javascript
async function analyzeEmailForTasks(content, subject) {
    const prompt = `Analyze this email and extract actionable tasks:

Subject: ${subject}
Content: ${content}

For each task, provide:
1. Task description (clear and concise)
2. Priority (high/medium/low)
3. Due date (if mentioned, or "none")

Format as JSON array: [{"text": "...", "priority": "...", "dueDate": "..."}]`;

    const systemMessage = "You are a task extraction expert. Identify clear, specific action items from emails. Be precise and avoid vague tasks.";
    
    const response = await callOpenAI(prompt, systemMessage);
    
    // Parse JSON response
    try {
        return JSON.parse(response);
    } catch (e) {
        // Fallback to existing logic if JSON parsing fails
        return [];
    }
}
```

### 2. Intelligent Summarization

Replace `generateSummary`:

```javascript
async function generateSummary(content, subject, isThread) {
    const prompt = `Summarize this email${isThread ? ' thread' : ''}:

Subject: ${subject}
From: ${currentSender}
Content: ${content}

Provide:
1. Brief overview (1-2 sentences)
2. Key points (3-5 bullet points)
3. Action items required (if any)
4. Sentiment/tone of the message

Format as HTML with proper tags.`;

    const systemMessage = "You are an expert at analyzing and summarizing business emails. Focus on what's important for the recipient to know and act on.";
    
    const htmlSummary = await callOpenAI(prompt, systemMessage);
    
    return `<div class="ai-summary">${htmlSummary}</div>`;
}
```

### 3. Advanced Meeting Detection

Replace `analyzeMeetingRequest`:

```javascript
async function analyzeMeetingRequest(content, subject) {
    const prompt = `Analyze if this email contains a meeting request and extract details:

Subject: ${subject}
Content: ${content}

Return JSON with:
{
    "isMeetingRequest": true/false,
    "title": "meeting title",
    "dateTime": "proposed date/time or 'TBD'",
    "duration": "duration or '30 minutes'",
    "attendees": "list of attendees",
    "location": "location/platform or 'TBD'",
    "agenda": "brief agenda or main topics"
}`;

    const systemMessage = "You are an expert at identifying meeting requests in emails and extracting structured information.";
    
    const response = await callOpenAI(prompt, systemMessage);
    
    try {
        return JSON.parse(response);
    } catch (e) {
        return { isMeetingRequest: false };
    }
}
```

## Security Best Practices

### 1. Never Expose API Keys in Client Code

**Wrong:**
```javascript
const API_KEY = 'sk-abc123...'; // NEVER DO THIS
```

**Right - Use Backend Proxy:**

Create a backend service (Node.js example):

```javascript
// server.js
const express = require('express');
const app = express();

app.post('/api/generate-response', async (req, res) => {
    const { emailContent, subject, type } = req.body;
    
    // API key is safely stored on server
    const response = await callOpenAI(emailContent, subject);
    
    res.json({ response });
});

app.listen(3001);
```

Update taskpane.js:

```javascript
async function analyzeAndGenerateResponse(emailContent, subject, type) {
    const response = await fetch('https://your-backend.com/api/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailContent, subject, type })
    });
    
    const data = await response.json();
    return data.response;
}
```

### 2. Use Environment Variables

```javascript
// .env file (never commit to git)
OPENAI_API_KEY=sk-...
AZURE_ENDPOINT=https://...
AZURE_API_KEY=...

// In your backend
require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;
```

### 3. Implement Rate Limiting

```javascript
let requestCount = 0;
const MAX_REQUESTS_PER_HOUR = 100;

async function rateLimitedAICall(prompt) {
    if (requestCount >= MAX_REQUESTS_PER_HOUR) {
        throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    requestCount++;
    setTimeout(() => requestCount--, 3600000); // Reset after 1 hour
    
    return await callOpenAI(prompt);
}
```

## Cost Optimization

### 1. Cache Common Responses

```javascript
const responseCache = new Map();

async function getCachedResponse(cacheKey, generator) {
    if (responseCache.has(cacheKey)) {
        return responseCache.get(cacheKey);
    }
    
    const response = await generator();
    responseCache.set(cacheKey, response);
    
    // Clear cache after 1 hour
    setTimeout(() => responseCache.delete(cacheKey), 3600000);
    
    return response;
}

// Usage
const response = await getCachedResponse(
    `response_${subject}_${type}`,
    () => analyzeAndGenerateResponse(content, subject, type)
);
```

### 2. Use Appropriate Models

```javascript
// For simple tasks, use cheaper models
const MODEL_CONFIG = {
    'quick': 'gpt-3.5-turbo',      // Fast and cheap
    'detailed': 'gpt-4',            // Better quality
    'tasks': 'gpt-3.5-turbo',       // Structured output
    'summary': 'gpt-3.5-turbo',     // Good enough for summaries
    'meeting': 'gpt-4'              // Complex extraction
};

async function callOpenAI(prompt, systemMessage, taskType = 'quick') {
    const model = MODEL_CONFIG[taskType];
    // ... rest of implementation
}
```

### 3. Limit Token Usage

```javascript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
    // ...
    body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 300,  // Limit response length
        temperature: 0.7
    })
});
```

## Testing AI Integration

### 1. Test with Sample Emails

```javascript
const testEmails = [
    {
        subject: 'Quick Question',
        content: 'Can you review the Q4 budget report by Friday?',
        expectedTasks: ['Review Q4 budget report'],
        expectedPriority: 'high'
    },
    // Add more test cases
];

async function runTests() {
    for (const test of testEmails) {
        const tasks = await analyzeEmailForTasks(test.content, test.subject);
        console.log('Test:', test.subject);
        console.log('Extracted:', tasks);
        console.log('Expected:', test.expectedTasks);
    }
}
```

### 2. Monitor Quality

```javascript
// Add feedback mechanism
function recordFeedback(feature, wasHelpful) {
    fetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({
            feature: feature,
            helpful: wasHelpful,
            timestamp: new Date()
        })
    });
}

// Add thumbs up/down buttons in UI
```

## Troubleshooting

### Issue: API Errors

```javascript
async function callOpenAIWithRetry(prompt, systemMessage, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await callOpenAI(prompt, systemMessage);
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}
```

### Issue: Slow Responses

```javascript
// Add loading states and timeouts
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

try {
    const response = await fetch(url, {
        signal: controller.signal,
        // ... other options
    });
} finally {
    clearTimeout(timeout);
}
```

## Next Steps

1. Choose your AI provider
2. Set up backend proxy for API key security
3. Implement one feature at a time
4. Test thoroughly with real emails
5. Monitor costs and usage
6. Collect user feedback
7. Iterate and improve prompts

---

**Security Warning:** Always use a backend service to protect API keys in production. Never commit API keys to version control.
