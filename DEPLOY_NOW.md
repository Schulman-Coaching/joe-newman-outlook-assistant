# Quick Deployment to Vercel

## The Vercel Command Issue - SOLVED ✅

The `vercel` command wasn't found because npm global packages aren't in your PATH. 

**Solution**: Use `npx vercel` instead of just `vercel`. This runs it directly without needing PATH configuration.

## Deploy Right Now (2 minutes)

### Step 1: Login to Vercel
```bash
npx vercel login
```
- This will open your browser
- Login with GitHub, GitLab, or email
- Return to terminal when done

### Step 2: Deploy
```bash
npx vercel --prod
```
- Press Enter to accept default settings
- You'll get a production URL like: `https://joe-newman-outlook-assistant.vercel.app`

### Step 3: Copy Your Production URL
The deployment will show:
```
✅ Production: https://joe-newman-outlook-assistant-xxxxx.vercel.app
```

**SAVE THIS URL** - you'll need it for the next step!

## What Happens Next

After you have your Vercel URL, we need to:

1. **Update manifest.xml** - Replace `https://localhost:3000` with your Vercel URL
2. **Update README.md** - Add the live URL
3. **Commit and push to GitHub** - Save the updated files
4. **Submit to Microsoft AppSource** - Enable one-click installation

## Troubleshooting

**If login times out**: 
- Kill the process (Ctrl+C)
- Run again: `npx vercel login`

**If you need to logout**:
```bash
npx vercel logout
```

**If deployment fails**:
- Check that you're in the project directory
- Ensure vercel.json exists
- Try: `npx vercel --debug`

## Alternative: Add to PATH (Optional)

If you want to use `vercel` directly without `npx`, add this to `~/.zshrc`:

```bash
export PATH="/usr/local/lib/node_modules_global/bin:$PATH"
```

Then reload: `source ~/.zshrc`

---

**Ready to deploy?** Run these two commands:
```bash
npx vercel login
npx vercel --prod
```
