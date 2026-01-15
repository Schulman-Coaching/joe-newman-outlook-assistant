// Vercel Serverless Function for AI-powered email responses
// This runs on the backend - API keys never exposed to client

export default async function handler(req, res) {
  // Enable CORS for your Outlook add-in
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { emailContent, subject, sender, type, tone } = req.body;

    // Get configuration from environment variables
    const provider = process.env.AI_PROVIDER || 'openai';
    
    let response;
    if (provider === 'openai') {
      response = await generateWithOpenAI(emailContent, subject, sender, type, tone);
    } else if (provider === 'anthropic') {
      response = await generateWithAnthropic(emailContent, subject, sender, type, tone);
    } else {
      throw new Error('Invalid AI provider');
    }

    return res.status(200).json({ response });

  } catch (error) {
    console.error('AI generation error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate response',
      message: error.message 
    });
  }
}

async function generateWithOpenAI(emailContent, subject, sender, type, tone) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4';

  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = buildPrompt(emailContent, subject, sender, type, tone);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are Joe Newman, an executive coach. Write professional, helpful email responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const error = await response.json();
    const errorMsg = error.error ? error.error.message : 'Unknown error';
    throw new Error('OpenAI API error: ' + errorMsg);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function generateWithAnthropic(emailContent, subject, sender, type, tone) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

  if (!apiKey) {
    throw new Error('Anthropic API key not configured');
  }

  const prompt = buildPrompt(emailContent, subject, sender, type, tone);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 500,
      system: 'You are Joe Newman, an executive coach. Write professional, helpful email responses.',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    const errorMsg = error.error ? error.error.message : 'Unknown error';
    throw new Error('Anthropic API error: ' + errorMsg);
  }

  const data = await response.json();
  return data.content[0].text;
}

function buildPrompt(emailContent, subject, sender, type, tone) {
  let instructions = '';
  
  switch (type) {
    case 'quick':
      instructions = 'Write a brief 2-3 sentence response.';
      break;
    case 'detailed':
      instructions = 'Write a comprehensive 2-3 paragraph response addressing all points.';
      break;
    case 'meeting':
      instructions = 'Write a response suggesting a meeting. Propose 2-3 time slots this week.';
      break;
    default:
      instructions = 'Write an appropriate response.';
  }

  const toneInstructions = {
    professional: 'Use a professional, business-appropriate tone.',
    friendly: 'Use a warm, friendly tone while remaining professional.',
    formal: 'Use a formal, highly professional tone.'
  };

  return `
Email Subject: ${subject}
From: ${sender}

Email Content:
${emailContent}

Instructions:
${instructions}
${toneInstructions[tone] || toneInstructions.professional}

Sign as "Joe Newman" or "Best regards, Joe Newman".

Generate the response:
`.trim();
}
