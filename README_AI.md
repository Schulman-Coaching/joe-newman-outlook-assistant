# Joe's Email Assistant - AI Integration

## 🎉 AI Integration Complete!

Your Outlook add-in now supports **AI-powered email responses** using OpenAI (GPT-4) or Anthropic (Claude).

## Quick Start

### 1. Get an API Key (Choose ONE)

**OpenAI (GPT-4)** - https://platform.openai.com/api-keys
**Anthropic (Claude)** - https://console.anthropic.com/

### 2. Run Setup Script

```bash
./setup-ai.sh
```

### 3. Test It

Open Outlook → Click any email → "Joe's Email Assistant" → "Quick Reply" ✨

## How to Provide Your API Key Securely

**IMPORTANT**: Never share your API key directly or put it in this chat!

Instead, follow these steps:

### Option 1: Use the Setup Script (Easiest)

```bash
cd ~/Projects/joe-newman-outlook-assistant
./setup-ai.sh
```

The script will:
1. Ask which AI provider you chose
2. Securely prompt for your API key
3. Add it to Vercel environment variables
4. Deploy the AI-enabled version

### Option 2: Manual Setup

```bash
# For OpenAI:
npx vercel env add OPENAI_API_KEY
# When prompted, paste your API key
# Choose: Production

npx vercel env add AI_PROVIDER
# Type: openai
# Choose: Production

# For Anthropic:
npx vercel env add ANTHROPIC_API_KEY
# When prompted, paste your API key
# Choose: Production

npx vercel env add AI_PROVIDER
# Type: anthropic
# Choose: Production

# Deploy:
npx vercel --prod
```

## Security

✅ API keys stored on Vercel backend only
✅ Never exposed to frontend
✅ Never committed to Git
✅ Protected by .gitignore

## Cost

- ~$0.01-0.03 per email
- ~$1-3/month for 100 emails

Both OpenAI and Anthropic are very affordable!

## Features

- ✅ **Contextual Understanding** - AI reads and understands email content
- ✅ **Personalized Responses** - Writes in Joe's voice as executive coach
- ✅ **Smart Fallback** - Uses templates if AI unavailable
- ✅ **Tone Adaptation** - Professional, Friendly, or Formal
- ✅ **Secure** - API keys never exposed

## Documentation

- **AI_INTEGRATION_COMPLETE.md** - Full overview
- **AI_SETUP_GUIDE.md** - Detailed setup guide (18KB)
- **QUICK_AI_SETUP.md** - 3-step quick start
- **.env.example** - Configuration template

## Next Steps

1. ✅ AI code is ready and deployed
2. ⏳ Add your API key (see above)
3. ⏳ Redeploy: `npx vercel --prod`
4. ⏳ Test in Outlook
5. ⏳ Monitor usage in provider dashboard

## Questions?

See the detailed guides or contact: elie@cohortlearninglabs.org

---

**Don't want AI?** That's fine! The add-in works great with the free template-based responses. AI is completely optional.
