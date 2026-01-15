# Detailed Installation Guide
## Joe Newman's Outlook Email Assistant

This guide provides step-by-step instructions for installing and configuring the Outlook Email Assistant.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Initial Setup](#initial-setup)
3. [Sideloading Instructions](#sideloading-instructions)
4. [Configuration](#configuration)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10+, macOS 10.14+, or modern web browser
- **Outlook Version**: 
  - Outlook 2016 or later (Windows/Mac)
  - Outlook on the web (any browser)
  - Outlook mobile app (iOS/Android)
- **Node.js**: Version 14.0 or higher
- **Internet Connection**: Required for initial setup

### Recommended Requirements
- Node.js version 16 or higher
- Outlook 365 subscription
- Modern browser (Chrome, Edge, Firefox, Safari)

---

## Initial Setup

### Step 1: Install Node.js

If you don't have Node.js installed:

**Windows/Mac:**
1. Visit https://nodejs.org
2. Download the LTS (Long Term Support) version
3. Run the installer
4. Verify installation:
```bash
node --version
npm --version
```

### Step 2: Download the Add-in Files

1. Navigate to the project folder
2. Ensure all files are present:
   - manifest.xml
   - taskpane.html
   - taskpane.css
   - taskpane.js
   - commands.html
   - package.json

### Step 3: Install Dependencies

Open a terminal/command prompt in the project folder:

```bash
# Install required packages
npm install

# Install Office development certificates
npx office-addin-dev-certs install
```

**Note:** You may need to accept security prompts to install the SSL certificate.

### Step 4: Start the Development Server

```bash
# Option 1: Using http-server (recommended for testing)
npm run serve

# Option 2: Using Office add-in debugging tools
npm start
```

The server will start at `https://localhost:3000`

**Important:** Keep this terminal window open while using the add-in.

---

## Sideloading Instructions

### For Outlook Desktop (Windows)

#### Method 1: Via Add-ins Store
1. Open Outlook Desktop
2. Click **Home** tab in the ribbon
3. Click **Get Add-ins** (or **Store**)
4. Select **My add-ins** from the left sidebar
5. Under **Custom add-ins**, click **+ Add a custom add-in**
6. Select **Add from File...**
7. Browse to your `manifest.xml` file
8. Click **OK** to install
9. Read the warning message and click **Install**

#### Method 2: Via File System (Alternative)
1. Close Outlook completely
2. Create folder: `%APPDATA%\Microsoft\Outlook\Addins`
3. Copy `manifest.xml` to this folder
4. Restart Outlook
5. Check **File** → **Options** → **Add-ins** to verify

### For Outlook Desktop (Mac)

1. Open Outlook for Mac
2. Click **Get Add-ins** in the ribbon
3. Select **My add-ins** tab
4. Click **+ Add a custom add-in** at the bottom
5. Select **Add from File...**
6. Browse to your `manifest.xml` file
7. Click **Install**

### For Outlook on the Web

1. Go to https://outlook.office.com
2. Open any email
3. Click the **three dots (...)** menu → **Get Add-ins**
4. Click **My add-ins** in the left panel
5. Under **Custom add-ins**, click **+ Add a custom add-in**
6. Select **Add from file**
7. Click **Browse** and select your `manifest.xml`
8. Click **Upload** and then **Install**

### For Outlook Mobile (iOS/Android)

**Note:** Sideloading custom add-ins is not supported on mobile. The add-in must be deployed through your organization's admin center or published to AppSource.

---

## Configuration

### Updating Server URLs

If you host the add-in on a different server, update the URLs in `manifest.xml`:

```xml
<!-- Find and replace localhost:3000 with your server URL -->
<SourceLocation DefaultValue="https://YOUR_SERVER/taskpane.html"/>
```

### Customizing Settings

Edit `taskpane.js` to customize:

**Default Tone:**
```javascript
// Change the default selected tone
<select id="tone-selector">
    <option value="professional" selected>Professional</option>
    ...
</select>
```

**Signature:**
```javascript
// Update signature in response generation
response += 'Best regards,\nJoe Newman';
// Change to your preferred signature
```

### Adding AI Integration

To connect to an AI service (OpenAI, Azure, etc.):

1. Add API credentials to a config file
2. Update the placeholder functions:

```javascript
async function analyzeAndGenerateResponse(emailContent, subject, type) {
    // Replace with actual AI API call
    const apiResponse = await callYourAIService(emailContent, subject);
    return apiResponse.generatedText;
}
```

---

## Verification

### Step 1: Check Add-in Appears

1. Open Outlook
2. Open any email
3. Look for **Joe's Assistant** section in the ribbon
4. Click **Email Assistant** button

### Step 2: Test Core Features

**Test Responses:**
1. Open the task pane
2. Click **Responses** tab
3. Click **Quick Reply**
4. Verify a response is generated

**Test Tasks:**
1. Open an email with action items (create a test email if needed)
2. Click **Tasks** tab
3. Click **Analyze Email for Tasks**
4. Check that tasks are extracted

**Test Summary:**
1. Click **Summary** tab
2. Click **Summarize This Email**
3. Verify summary appears

**Test Meetings:**
1. Open an email mentioning a meeting
2. Click **Meetings** tab
3. Click **Detect Meeting Request**
4. Check if meeting details are extracted

### Step 3: Verify Insert Functionality

1. Generate a response
2. Click **Insert to Email**
3. Verify that Outlook opens a reply window with your text

---

## Troubleshooting

### Issue: Add-in Button Not Appearing

**Solution:**
1. Verify the add-in is installed: **File** → **Manage Add-ins**
2. Check if it's enabled
3. Restart Outlook
4. Clear Outlook cache:
   - Windows: Delete `%LOCALAPPDATA%\Microsoft\Outlook`
   - Mac: `~/Library/Caches/com.microsoft.Outlook`

### Issue: Task Pane Shows "Cannot Load"

**Solution:**
1. Verify development server is running at https://localhost:3000
2. Check for HTTPS certificate errors
3. Reinstall certificates:
   ```bash
   npx office-addin-dev-certs install --force
   ```
4. Allow the certificate in your browser
5. Restart the server and Outlook

### Issue: SSL/Certificate Errors

**Solution:**
```bash
# Remove old certificates
npx office-addin-dev-certs uninstall

# Install fresh certificates
npx office-addin-dev-certs install

# Restart server
npm run serve
```

### Issue: Features Not Working

**Possible Causes:**
1. **Office.js not loading**: Check browser console (F12)
2. **Permissions issue**: Verify manifest.xml has `ReadWriteMailbox` permission
3. **API version mismatch**: Ensure you have the required Office.js version

**Solution:**
```javascript
// Add to taskpane.js to check Office.js version
Office.onReady((info) => {
    console.log('Office.js version:', Office.context.diagnostics.version);
    console.log('Host:', info.host);
    console.log('Platform:', info.platform);
});
```

### Issue: "This add-in is not available"

**Solution:**
1. Check manifest.xml `<Requirements>` section
2. Verify your Outlook version supports the required API set
3. Update manifest to lower requirements if needed:
```xml
<Set Name="Mailbox" MinVersion="1.1"/>
```

### Issue: Changes Not Reflecting

**Solution:**
1. Stop the server (Ctrl+C)
2. Clear browser cache
3. Restart server: `npm run serve`
4. Remove and re-add the add-in
5. Hard refresh in browser (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Port 3000 Already in Use

**Solution:**
```bash
# Find process using port 3000
# Windows:
netstat -ano | findstr :3000

# Mac/Linux:
lsof -i :3000

# Kill the process or change port in package.json
"serve": "http-server -p 3001 --ssl --cert localhost.crt --key localhost.key"
```

### Getting Help

1. Check browser console (F12) for JavaScript errors
2. Review Outlook add-in logs:
   - Windows: Event Viewer → Application logs
   - Mac: Console app → System logs
3. Validate manifest: `npm run validate`
4. Test in Outlook on the web first (easier debugging)

---

## Next Steps

After successful installation:
1. Read the [README.md](README.md) for usage instructions
2. Customize response templates to match your style
3. Consider integrating AI services for smarter responses
4. Test with various email scenarios
5. Provide feedback for improvements

---

## Production Deployment

For deploying to production (organization-wide):

1. **Host Files**: Upload files to secure HTTPS server
2. **Update Manifest**: Change all localhost URLs to production URLs
3. **Admin Deployment**: 
   - Access Microsoft 365 admin center
   - Go to Settings → Integrated apps
   - Upload manifest.xml
   - Assign to users/groups
4. **AppSource (Optional)**: Submit to Microsoft AppSource for public distribution

---

**Installation Support:** Contact Joe Newman for assistance
**Version:** 1.0.0
