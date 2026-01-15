# Quick AI Setup (3 Steps)

## Step 1: Get Your API Key (1 minute)

**Choose ONE:**

### OpenAI (GPT-4)
1. Visit: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)

### Anthropic (Claude)
1. Visit: https://console.anthropic.com/
2. Go to "API Keys"
3. Click "Create Key"
4. Copy the key (starts with `sk-ant-`)

## Step 2: Run Setup Script (2 minutes)

```bash
./setup-ai.sh
```

This will:
- Ask which AI provider you chose
- Prompt for your API key
- Configure Vercel environment
- Deploy AI-enabled version

**OR** do it manually:

```bash
# For OpenAI:
npx vercel env add OPENAI_API_KEY
# Paste your API key when prompted
# Choose: Production

npx vercel env add AI_PROVIDER
# Type: openai
# Choose: Production

# For Anthropic:
npx vercel env add ANTHROPIC_API_KEY
# Paste your API key when prompted
# Choose: Production

npx vercel env add AI_PROVIDER
# Type: anthropic
# Choose: Production

# Deploy:
npx vercel --prod
```

## Step 3: Test It! (30 seconds)

1. Open Outlook
2. Open any email
3. Click "Joe's Email Assistant"
4. Click "Quick Reply"
5. ✨ Watch AI generate a personalized response!

## Done! 🎉

Your add-in now uses AI to:
- Understand email context
- Write in Joe's voice
- Address specific questions
- Suggest relevant follow-ups
- Adapt to different tones

## Cost

- ~$0.01-0.03 per email
- ~$1-3/month for typical usage (100 emails)

## Monitor Usage

- **OpenAI**: https://platform.openai.com/usage
- **Anthropic**: https://console.anthropic.com/settings/usage

---

**Full Documentation**: See [AI_SETUP_GUIDE.md](AI_SETUP_GUIDE.md)
