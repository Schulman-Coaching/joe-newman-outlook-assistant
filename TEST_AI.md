# How to Test AI Integration

## Quick Test (30 seconds)

After running `./setup-ai.sh` and deploying, test the API directly:

```bash
curl -X POST https://joe-newman-outlook-assistant.vercel.app/api/generate-response \
  -H "Content-Type: application/json" \
  -d '{
    "emailContent": "Hi, I am interested in your executive coaching services. Can you tell me more about your programs and pricing?",
    "subject": "Coaching inquiry",
    "sender": "Sarah Mitchell",
    "type": "detailed",
    "tone": "professional"
  }'
```

### Expected Results

**✅ AI is working if you see:**
```json
{
  "response": "Dear Sarah,\n\nThank you for reaching out regarding my executive coaching services...[personalized content]...Best regards,\nJoe Newman"
}
```

**❌ AI is NOT working if you see:**
```json
{
  "error": "Failed to generate response",
  "message": "OpenAI API key not configured"
}
```

## Full Test in Outlook (2 minutes)

### 1. Install the Add-in (if not already)

Follow the steps in WHATSAPP_MESSAGE.txt to install in Outlook.

### 2. Send Yourself a Test Email

Send an email to yourself with this content:

```
Subject: Question about coaching programs

Hi Joe,

I'm interested in learning more about your executive coaching programs. 
I'm a VP at a tech company and looking to improve my leadership skills 
and team management abilities. What programs do you offer and what are 
the next steps?

Thanks,
Sarah
```

### 3. Open the Email and Use Assistant

1. Open the test email in Outlook
2. Click "Joe's Email Assistant" button in the ribbon
3. Click "Detailed Response"
4. Wait 2-3 seconds

### 4. Check the Response

**✅ AI is working if:**
- Response is personalized (mentions "VP", "tech company", "leadership skills")
- Response addresses specific questions
- Response is 2-3 paragraphs
- Sounds like a real person wrote it
- Includes specific program suggestions

Example AI response:
```
Dear Sarah,

Thank you for reaching out about my executive coaching programs. It's great 
to hear from a VP in tech who's focused on leadership development.

I offer several programs tailored for executives like yourself, including 
one-on-one coaching focused on leadership presence and team dynamics...

[Continues with relevant details]

Best regards,
Joe Newman
```

**❌ AI is NOT working if:**
- Response is generic template
- Says things like "[Point addressing main concern]"
- Doesn't mention anything from the email
- Very short (just 2-3 sentences)

Example template response (what you DON'T want):
```
Dear Sarah Mitchell,

Thank you for reaching out regarding "Question about coaching programs".

I appreciate you taking the time to share this information. Based on your message, 
here are my thoughts:

1. [Point addressing main concern]
2. [Additional relevant information]
3. [Next steps or action items]

Best regards,
Joe Newman
```

## Troubleshooting

### If AI isn't working:

**1. Check Vercel Environment Variables**

```bash
npx vercel env ls
```

You should see:
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`
- `AI_PROVIDER`

**2. Check Vercel Logs**

```bash
npx vercel logs joe-newman-outlook-assistant --prod
```

Look for errors like:
- "API key not configured"
- "Invalid authentication"
- "Insufficient credits"

**3. Verify API Key is Valid**

**For OpenAI:**
- Go to https://platform.openai.com/api-keys
- Check your key is still active
- Verify you have credits: https://platform.openai.com/usage

**For Anthropic:**
- Go to https://console.anthropic.com/
- Check key status
- Verify credits available

**4. Redeploy**

Sometimes environment variables need a fresh deployment:

```bash
npx vercel --prod
```

**5. Test API Directly (Advanced)**

Open browser console (F12) and run:

```javascript
fetch('https://joe-newman-outlook-assistant.vercel.app/api/generate-response', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    emailContent: 'Test email about coaching',
    subject: 'Test',
    sender: 'Test User',
    type: 'quick',
    tone: 'professional'
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

Check the response in the console.

## Common Issues

### Issue: "AI API returned status: 401"

**Solution:** API key is invalid or missing
```bash
npx vercel env rm OPENAI_API_KEY production
npx vercel env add OPENAI_API_KEY production
# Paste your key
npx vercel --prod
```

### Issue: "AI API returned status: 429"

**Solution:** Rate limit hit (too many requests)
- Wait 1 minute and try again
- Check if you're on free tier with low limits

### Issue: "AI API returned status: 402"

**Solution:** No credits/payment method
- OpenAI: https://platform.openai.com/account/billing
- Anthropic: https://console.anthropic.com/settings/billing
- Add payment method

### Issue: Responses are slow (>10 seconds)

**Solution:** Switch to faster model
```bash
npx vercel env add OPENAI_MODEL production
# Type: gpt-3.5-turbo (faster, cheaper)
npx vercel --prod
```

### Issue: Still seeing template responses

**Possible causes:**
1. API key not configured → Check `npx vercel env ls`
2. Deployment didn't include new code → Run `npx vercel --prod`
3. Browser cache → Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
4. Wrong environment → Make sure you added key to "Production" not "Preview"

## Quick Checklist

Before declaring AI working, verify:

- [ ] `curl` test returns personalized response (not error)
- [ ] Vercel environment variables show API key
- [ ] API provider dashboard shows API calls being made
- [ ] Outlook add-in shows personalized responses (not templates)
- [ ] Responses mention specific details from test email
- [ ] Responses are 2-3 paragraphs (not 2-3 sentences)

## Success!

If all tests pass, your AI integration is working perfectly! 🎉

Joe can now:
- Generate personalized email responses
- Get context-aware suggestions
- Save 5-10 minutes per email
- Maintain his voice and style

---

**Still having issues?** Check the full troubleshooting guide in AI_SETUP_GUIDE.md
