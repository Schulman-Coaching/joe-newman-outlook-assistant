# AI Integration Setup Guide

## Overview

Your Outlook add-in now supports **AI-powered email responses** using either OpenAI (GPT-4) or Anthropic (Claude)!

The AI integration is:
- ✅ **Secure** - API keys stored on backend, never exposed to clients
- ✅ **Fast** - Serverless functions respond in 1-3 seconds
- ✅ **Cost-effective** - Pay only for API calls you use
- ✅ **Private** - Email content sent only to AI provider

## Quick Setup (5 Minutes)

### Step 1: Get an API Key

Choose ONE AI provider:

**Option A: OpenAI (GPT-4)**
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. **Cost**: ~$0.01-0.03 per email response

**Option B: Anthropic (Claude)**
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Go to "API Keys"
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-`)
6. **Cost**: ~$0.01-0.02 per email response

### Step 2: Add API Key to Vercel

You need to add your API key as an environment variable in Vercel (where your add-in is hosted).

**In your terminal:**

```bash
# For OpenAI:
npx vercel env add OPENAI_API_KEY
# When prompted, paste your OpenAI API key
# Choose: Production

npx vercel env add AI_PROVIDER
# When prompted, type: openai
# Choose: Production

# For Anthropic (Claude):
npx vercel env add ANTHROPIC_API_KEY
# When prompted, paste your Anthropic API key
# Choose: Production

npx vercel env add AI_PROVIDER
# When prompted, type: anthropic
# Choose: Production
```

### Step 3: Redeploy

```bash
npx vercel --prod
```

This deploys the AI-enabled version with your API keys configured.

### Step 4: Test It!

1. Open Outlook
2. Open any email
3. Click "Joe's Email Assistant"
4. Click "Quick Reply" or "Detailed Response"
5. Watch AI generate a response in real-time!

## How It Works

### Before (Template-based):
```
Email: "Can you send me the Q4 report?"
Response: "Thank you for your email. I will review this and get back to you soon."
```

### After (AI-powered):
```
Email: "Can you send me the Q4 report?"
AI Response: "Hi Sarah, I'll be happy to send you the Q4 report. I have the latest 
version ready and will email it to you by end of day today. Is there any specific 
section you'd like me to highlight?

Best regards,
Joe Newman"
```

The AI:
- ✅ Understands context and intent
- ✅ Writes in Joe's voice (executive coach)
- ✅ Addresses specific questions
- ✅ Suggests relevant follow-ups
- ✅ Adapts tone (Professional/Friendly/Formal)

## Cost Estimation

### OpenAI (GPT-4)
- Quick replies: ~$0.01 per email
- Detailed responses: ~$0.03 per email
- **Monthly estimate** (100 emails): $1-3/month

### Anthropic (Claude)
- Quick replies: ~$0.01 per email
- Detailed responses: ~$0.02 per email
- **Monthly estimate** (100 emails): $1-2/month

Both are very affordable for typical email usage!

## Advanced Configuration

### Choose Different AI Models

**For OpenAI:**
```bash
npx vercel env add OPENAI_MODEL
# Options: gpt-4, gpt-4-turbo, gpt-3.5-turbo
# Choose: Production
```

**For Anthropic:**
```bash
npx vercel env add ANTHROPIC_MODEL
# Options: claude-3-5-sonnet-20241022, claude-3-opus-20240229
# Choose: Production
```

### Switch AI Providers

Already deployed with OpenAI but want to try Claude?

```bash
npx vercel env rm AI_PROVIDER
npx vercel env add AI_PROVIDER
# Type: anthropic
# Add your Anthropic API key
npx vercel --prod
```

## Security & Privacy

### Your API Keys Are Safe ✅

- **Never exposed** to the Outlook add-in frontend
- **Never visible** in browser network requests
- **Stored securely** in Vercel environment variables
- **Only accessible** by your backend API

### Email Privacy

- Emails are sent to AI provider (OpenAI or Anthropic) for processing
- Both providers have strong privacy policies
- Email content is NOT used to train AI models (per API terms)
- You can review each provider's data policies

### Best Practices

1. **Never commit** API keys to GitHub
2. **Rotate keys** every 3-6 months
3. **Set spending limits** in your AI provider dashboard
4. **Monitor usage** monthly

## Troubleshooting

### Error: "OpenAI API key not configured"

**Fix:**
```bash
npx vercel env ls
# Check if OPENAI_API_KEY exists

# If not, add it:
npx vercel env add OPENAI_API_KEY
npx vercel --prod
```

### Error: "Failed to generate response"

**Possible causes:**
1. **Invalid API key** - Check key is correct
2. **Expired API key** - Generate new key
3. **No credits** - Add payment method to AI provider
4. **Rate limit** - Wait a minute and try again

**Check your API key:**
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/

### Responses are slow (>5 seconds)

- GPT-4 is slower than GPT-3.5-turbo
- Claude Sonnet is faster than Claude Opus
- Try switching to a faster model

### AI responses don't match Joe's style

You can customize the system prompt in `api/generate-response.js`:

```javascript
content: 'You are Joe Newman, an executive coach who specializes in [YOUR EXPERTISE]. Your writing style is [DESCRIBE STYLE].'
```

After editing, run: `npx vercel --prod`

## Monitoring Usage

### OpenAI Dashboard
https://platform.openai.com/usage
- View daily API costs
- Set spending limits
- Track request volume

### Anthropic Console
https://console.anthropic.com/settings/usage
- Monitor token usage
- View cost breakdown
- Set usage alerts

## Alternative: Keep Templates (Free)

Don't want to pay for AI? That's fine!

The add-in works great with free template-based responses. AI is **optional** - if no API key is configured, it falls back to the original template system.

## Next Steps

1. ✅ Add API key to Vercel
2. ✅ Deploy AI-enabled version
3. ✅ Test with real emails
4. ✅ Monitor costs for a week
5. ✅ Adjust models if needed
6. ✅ Enjoy AI-powered email assistance!

---

**Questions?** Contact: elie@cohortlearninglabs.org
