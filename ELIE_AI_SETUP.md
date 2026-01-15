# AI Setup Instructions for Elie

## Quick Setup (2 minutes)

You'll add your API key to Vercel so Joe can use AI-powered responses.

### Step 1: Get Your API Key

**Choose ONE:**

**Option A: OpenAI (GPT-4)** - Recommended
- Go to: https://platform.openai.com/api-keys
- Click "Create new secret key"
- Copy the key (starts with `sk-`)
- Cost: ~$1-3/month for Joe's usage

**Option B: Anthropic (Claude)**
- Go to: https://console.anthropic.com/
- Go to "API Keys" → "Create Key"
- Copy the key (starts with `sk-ant-`)
- Cost: ~$1-2/month for Joe's usage

### Step 2: Add API Key to Vercel

Open your terminal and run:

```bash
cd ~/Projects/joe-newman-outlook-assistant

# For OpenAI:
npx vercel env add OPENAI_API_KEY production
# When prompted, paste your API key

npx vercel env add AI_PROVIDER production
# When prompted, type: openai

# For Anthropic:
npx vercel env add ANTHROPIC_API_KEY production
# When prompted, paste your API key

npx vercel env add AI_PROVIDER production
# When prompted, type: anthropic
```

### Step 3: Deploy

```bash
npx vercel --prod
```

That's it! The AI is now live.

## Alternative: Use the Setup Script

```bash
./setup-ai.sh
```

This script will:
1. Ask which AI provider you chose
2. Prompt for your API key
3. Configure everything automatically
4. Deploy the AI-enabled version

## Test It

1. Open Outlook
2. Open any email
3. Click "Joe's Email Assistant"
4. Click "Quick Reply"
5. You should see an AI-generated personalized response!

If it still shows template responses, check:
- Did the deployment succeed?
- Is the API key correct?
- Do you have credits in your OpenAI/Anthropic account?

## Monitor Usage & Costs

**OpenAI Dashboard:**
https://platform.openai.com/usage
- View daily costs
- Set spending limits
- Track API calls

**Anthropic Console:**
https://console.anthropic.com/settings/usage
- Monitor token usage
- View cost breakdown
- Set alerts

## Recommended Settings

### Set a Monthly Spending Limit

**OpenAI:**
1. Go to https://platform.openai.com/account/limits
2. Set "Soft limit" to $10/month
3. Set "Hard limit" to $15/month
4. Enable email notifications

**Anthropic:**
1. Go to https://console.anthropic.com/settings/limits
2. Set usage alerts
3. Monitor weekly

### Expected Costs

For Joe's typical usage (estimated 100 emails/month):
- OpenAI: $1-3/month
- Anthropic: $1-2/month

Very affordable! Even heavy usage (500 emails) is only $5-15/month.

## Troubleshooting

### "AI API key not configured" error

Run:
```bash
npx vercel env ls
```

Check if your API key is listed. If not, add it again:
```bash
npx vercel env add OPENAI_API_KEY production
npx vercel --prod
```

### Still showing template responses

1. Check Vercel deployment logs:
   ```bash
   npx vercel logs joe-newman-outlook-assistant --prod
   ```

2. Open browser console in Outlook add-in (F12)
3. Look for error messages when clicking "Quick Reply"

### API key invalid

- Check you copied the full key (no spaces)
- Check key hasn't expired
- Verify you have credits/payment method set up

## Security Notes

✅ **Your API key is secure:**
- Stored in Vercel environment variables (encrypted)
- Never exposed to frontend code
- Never visible in browser network requests
- Never committed to Git
- Only accessible by your backend API

✅ **Joe's emails are private:**
- Sent to OpenAI/Anthropic only for processing
- Not used to train models (per API terms)
- You can review provider privacy policies
- You control all data

## Customize Joe's Voice (Optional)

Edit `api/generate-response.js` line 65 to customize:

```javascript
content: 'You are Joe Newman, an executive coach specializing in [AREA]. Your writing style is [STYLE DESCRIPTION].'
```

Then redeploy:
```bash
npx vercel --prod
```

## Quick Reference

**Add API key:**
```bash
npx vercel env add OPENAI_API_KEY production
npx vercel env add AI_PROVIDER production
```

**Deploy:**
```bash
npx vercel --prod
```

**Check logs:**
```bash
npx vercel logs joe-newman-outlook-assistant --prod
```

**Remove API key (if needed):**
```bash
npx vercel env rm OPENAI_API_KEY production
```

---

**Questions?** Check AI_SETUP_GUIDE.md for comprehensive documentation.
