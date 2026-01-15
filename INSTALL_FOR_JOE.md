# Joe's Email Assistant - Installation Guide

## What You're Getting

An Outlook add-in that helps you:
- ✍️ **Generate email responses** (quick replies, detailed responses, meeting requests)
- ✅ **Extract tasks** from emails automatically
- 📝 **Summarize** long email threads
- 📅 **Detect meetings** and create calendar events

## Installation (5 Minutes)

### Step 1: Download the Manifest File

1. Go to: https://joe-newman-outlook-assistant.vercel.app/manifest.xml
2. Right-click anywhere on the page
3. Click "Save As..."
4. Save as `manifest.xml` to your Downloads folder

### Step 2: Install in Outlook

#### For Outlook Desktop (Windows/Mac):

1. Open Outlook
2. Click on any email
3. Go to **Home** tab → **Get Add-ins** button
4. Click **My add-ins** (left sidebar)
5. Scroll down to **Custom add-ins**
6. Click **+ Add a custom add-in** → **Add from file...**
7. Browse to your Downloads folder
8. Select `manifest.xml`
9. Click **Install** when prompted

#### For Outlook on the Web:

1. Go to https://outlook.office.com
2. Click the **Settings** gear icon (top right)
3. Click **View all Outlook settings**
4. Go to **General** → **Manage add-ins**
5. Click **+ Add from file**
6. Upload the `manifest.xml` file
7. Click **Install**

### Step 3: Start Using It

1. Open any email in Outlook
2. Look for **"Joe's Email Assistant"** button in the ribbon
3. Click it to open the assistant panel
4. Choose what you want to do:
   - **Responses** tab: Generate quick replies
   - **Tasks** tab: Extract action items
   - **Summary** tab: Get email summary
   - **Meetings** tab: Detect meeting requests

## Features Guide

### 📧 Response Generation

**Quick Reply**: Professional 2-3 sentence response
**Detailed Response**: Comprehensive 2-3 paragraph reply
**Meeting Request**: Suggests meeting times

**Tone Options**:
- Professional (default)
- Friendly
- Formal

### ✅ Task Extraction

Automatically finds action items like:
- "Need to schedule a call"
- "Please review the document"
- "Can you send the report"

### 📝 Email Summary

Creates 3-4 sentence summary of:
- Main topic
- Key points
- Action items
- Sender's request

### 📅 Meeting Detection

Identifies:
- Meeting requests
- Suggested times
- Conference links

## Customization

The assistant learns your style! You can:
- Edit generated responses before sending
- Copy responses to clipboard
- Adjust tone for each reply

## Troubleshooting

**Can't see the add-in button?**
- Restart Outlook
- Check that you're viewing an email (not calendar/contacts)
- Try clicking on the **...** (More) menu in the ribbon

**Add-in not loading?**
- Check your internet connection
- Clear browser cache (for Outlook Web)
- Reinstall the manifest file

**Responses seem generic?**
- Edit them to match your style
- The assistant provides templates you customize
- Future AI upgrade will learn your writing style

## What's Next?

This is version 1.0 using smart templates. Future updates will include:
- AI-powered response generation (OpenAI/Claude)
- Learning from your sent emails
- Custom templates for common scenarios
- Calendar integration
- CRM integration

## Support

Questions? Contact: elie@cohortlearninglabs.org

---

**Live URL**: https://joe-newman-outlook-assistant.vercel.app
**Last Updated**: January 15, 2026
