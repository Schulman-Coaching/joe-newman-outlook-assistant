# Quick Start Guide
## Get Joe Newman's Outlook Assistant Running in 10 Minutes

This is the fastest path to get the assistant working in Outlook.

## Prerequisites Checklist
- [ ] Node.js installed (check: `node --version`)
- [ ] Outlook Desktop, Web, or Mobile
- [ ] 10 minutes of time

## 5-Step Installation

### Step 1: Install Dependencies (2 minutes)
```bash
cd joe-newman-outlook-assistant
npm install
npx office-addin-dev-certs install
```

When prompted about installing certificates, click **Yes**.

### Step 2: Start the Server (1 minute)
```bash
npm run serve
```

**Important:** Keep this terminal window open!

You should see: `Server running at https://localhost:3000`

### Step 3: Sideload in Outlook (3 minutes)

**For Outlook Desktop:**
1. Open Outlook
2. Click **Get Add-ins** in the ribbon
3. Click **My add-ins** → **+ Add a custom add-in** → **Add from File**
4. Select the `manifest.xml` file from this folder
5. Click **Install**

**For Outlook Web:**
1. Go to https://outlook.office.com
2. Click Settings ⚙️ → **View all Outlook settings**
3. Go to **General** → **Manage add-ins**
4. Click **+ Add from file**
5. Upload `manifest.xml`
6. Click **Install**

### Step 4: Test It (2 minutes)
1. Open any email in Outlook
2. Look for **Joe's Assistant** in the ribbon
3. Click **Email Assistant**
4. The task pane should appear on the right

### Step 5: Try Features (2 minutes)

**Generate a Response:**
1. Click the **Responses** tab
2. Click **Quick Reply**
3. Review the generated response
4. Click **Insert to Email** to use it

**Extract Tasks:**
1. Open an email with action items
2. Click the **Tasks** tab
3. Click **Analyze Email for Tasks**
4. See your tasks appear!

## Common Quick Fixes

### Certificate Error?
```bash
npx office-addin-dev-certs install --force
```

### Port 3000 In Use?
```bash
# Edit package.json, change 3000 to 3001
"serve": "http-server -p 3001 --ssl --cert localhost.crt --key localhost.key"
```

### Add-in Not Showing?
1. Restart Outlook
2. Check **File** → **Manage Add-ins**
3. Make sure it's enabled

### Task Pane Blank?
1. Check that server is running
2. Visit https://localhost:3000 in your browser
3. Accept the certificate warning
4. Restart Outlook

## What's Next?

✅ **Working?** Great! Now:
- Read [README.md](README.md) for detailed feature usage
- Customize response templates in `taskpane.js`
- Check [AI_INTEGRATION_GUIDE.md](AI_INTEGRATION_GUIDE.md) to add real AI

❌ **Not Working?** See [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) for detailed troubleshooting

## Testing Checklist

Try these features to verify everything works:

- [ ] Generate quick reply
- [ ] Generate detailed reply
- [ ] Extract tasks from email
- [ ] Summarize an email
- [ ] Detect meeting request
- [ ] Change tone (professional → friendly)
- [ ] Insert response into Outlook
- [ ] Export tasks to file

## Daily Usage

### Starting Work
```bash
# Navigate to project folder
cd joe-newman-outlook-assistant

# Start server
npm run serve

# Open Outlook and click "Email Assistant" on any email
```

### Stopping
```bash
# In the terminal, press Ctrl+C to stop server
```

## Pro Tips

1. **Keep Server Running**: Start it in the morning, keep it open all day
2. **Keyboard Shortcut**: Create an Outlook quick access toolbar button
3. **Templates**: Customize common responses in the code
4. **Feedback**: Note what works/doesn't work for future AI integration

## Getting Help

1. **Error in Task Pane**: Press F12 to open browser console
2. **Features Not Working**: Check [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) troubleshooting
3. **Want AI Features**: See [AI_INTEGRATION_GUIDE.md](AI_INTEGRATION_GUIDE.md)

## Security Note

⚠️ The current version runs locally on your machine. No emails are sent to external servers.

When you add AI integration, make sure to use a backend proxy for API keys (see AI guide).

---

**You're Ready!** Start using your email assistant. Happy emailing! 📧✨

Questions? Check the detailed guides or contact Joe Newman.
