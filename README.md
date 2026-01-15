# Joe Newman's Outlook Email Assistant

An AI-powered Microsoft Outlook add-in that helps Joe Newman manage emails more efficiently by drafting responses, extracting tasks, summarizing email threads, and detecting meeting requests.

## Features

### 1. **Smart Response Generation** ✍️
- **Quick Reply**: Generate concise acknowledgment emails
- **Detailed Reply**: Create comprehensive, thoughtful responses
- **Meeting Response**: Suggest meeting times and availability
- **Tone Adjustment**: Switch between Professional, Friendly, Formal, and Casual tones
- **One-Click Insert**: Insert generated responses directly into Outlook

### 2. **Task Extraction** ✅
- Automatically identify action items from email content
- Prioritize tasks (High, Medium, Low) based on urgency keywords
- Extract due dates when mentioned
- Export tasks to a text file for import into task management systems
- Visual task list with checkboxes

### 3. **Email Summarization** 📝
- **Single Email Summary**: Get key points from lengthy emails
- **Thread Summary**: Summarize entire email conversations
- Extract sender, subject, word count, and attachments info
- Identify and highlight the 3 most important points
- Copy summaries to clipboard

### 4. **Meeting Detection** 📅
- Automatically detect meeting requests in emails
- Extract meeting details:
  - Title
  - Date and time
  - Duration
  - Attendees
  - Location (physical or virtual platform)
- Create Outlook calendar events directly from detected meetings

## Installation

### Prerequisites
- Microsoft Outlook (Desktop, Web, or Mobile)
- Node.js (version 14 or higher)
- npm or yarn package manager

### Step 1: Setup Development Environment

```bash
# Install dependencies
npm install

# Generate self-signed SSL certificate for local development
npx office-addin-dev-certs install
```

### Step 2: Start the Development Server

```bash
# Start local HTTPS server on port 3000
npm run serve

# Or use the built-in Office debugging tools
npm start
```

### Step 3: Sideload the Add-in

#### For Outlook Desktop (Windows/Mac):

1. Open Outlook
2. Go to **Home** tab → **Get Add-ins**
3. Select **My add-ins** from the left menu
4. At the bottom, select **Add a custom add-in** → **Add from File**
5. Browse to your `manifest.xml` file and select it
6. Click **Install**

#### For Outlook Web:

1. Open Outlook on the web (outlook.office.com)
2. Click the **Settings** gear icon → **View all Outlook settings**
3. Navigate to **General** → **Manage add-ins**
4. Click **+ Add from file**
5. Browse to your `manifest.xml` and upload it
6. Click **Install**

### Step 4: Use the Assistant

1. Open any email in Outlook
2. Look for the **Joe's Assistant** button in the ribbon
3. Click **Email Assistant** to open the task pane
4. Choose from the four tabs: Responses, Tasks, Summary, or Meetings

## Usage Guide

### Drafting Responses

1. Open an email you want to reply to
2. Click the **Responses** tab
3. Choose your response type:
   - **Quick Reply**: Fast acknowledgment
   - **Detailed Reply**: Thorough response with structured points
   - **Suggest Meeting**: Propose meeting times
4. Select your preferred tone from the dropdown
5. Review and edit the generated response
6. Click **Insert to Email** to add it to a new reply

### Extracting Tasks

1. Open an email containing action items
2. Click the **Tasks** tab
3. Click **Analyze Email for Tasks**
4. Review the detected tasks with their priorities
5. Uncheck any tasks you don't want to export
6. Click **Export to Tasks/Todo** to download as text file

### Summarizing Emails

1. Open an email or email thread
2. Click the **Summary** tab
3. Choose:
   - **Summarize This Email**: Single email analysis
   - **Summarize Thread**: Full conversation summary
4. Review the key points extracted
5. Click **Copy Summary** to copy to clipboard

### Scheduling Meetings

1. Open an email that mentions a meeting
2. Click the **Meetings** tab
3. Click **Detect Meeting Request**
4. Review and edit the extracted meeting details
5. Click **Create Calendar Event** to open Outlook calendar with pre-filled information

## Customization

### Modify Response Templates

Edit the `analyzeAndGenerateResponse` function in `taskpane.js` to customize response templates:

```javascript
async function analyzeAndGenerateResponse(emailContent, subject, type) {
    // Customize response templates here
    // Add your own logic for different email types
}
```

### Adjust Task Detection

Modify the `analyzeEmailForTasks` function to change how tasks are detected:

```javascript
const actionWords = ['need to', 'please', 'can you', ...];
// Add your own action indicators
```

### Integrate AI Services

The current implementation uses rule-based logic. To integrate with AI services:

1. Add your API credentials to a configuration file
2. Replace the mock functions with actual API calls:
   - `analyzeAndGenerateResponse` → Call OpenAI, Claude, or custom AI
   - `analyzeEmailForTasks` → Use NLP for task extraction
   - `generateSummary` → Use summarization AI models

Example integration point:

```javascript
async function analyzeAndGenerateResponse(emailContent, subject, type) {
    // Call your AI API here
    const response = await fetch('YOUR_AI_API_ENDPOINT', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: emailContent,
            subject: subject,
            type: type
        })
    });
    return await response.json();
}
```

## File Structure

```
joe-newman-outlook-assistant/
├── manifest.xml          # Outlook add-in configuration
├── taskpane.html        # Main UI interface
├── taskpane.css         # Styling
├── taskpane.js          # Core functionality
├── commands.html        # Command handlers
├── package.json         # Node.js dependencies
├── README.md           # This file
└── assets/             # Icons and images
    ├── icon-16.png
    ├── icon-32.png
    └── icon-80.png
```

## Troubleshooting

### Add-in Not Appearing

- Ensure the development server is running on https://localhost:3000
- Verify the manifest.xml is properly loaded
- Check Outlook's add-in management settings
- Clear Outlook cache and restart

### HTTPS Certificate Errors

```bash
# Regenerate SSL certificate
npx office-addin-dev-certs install --force
```

### Task Pane Not Loading

- Check browser console for JavaScript errors
- Verify Office.js library is loading properly
- Ensure all file paths in manifest.xml are correct

### Features Not Working

- Check that you have the required Office.js API version
- Verify permissions in manifest.xml
- Test with a simple email first

## Development

### Running in Development Mode

```bash
# Start with hot reload
npm run dev-server

# Validate manifest
npm run validate
```

### Testing

Test the add-in with various email scenarios:
- Short vs. long emails
- Emails with/without action items
- Meeting requests with different formats
- Email threads with multiple participants

## Deployment

### For Personal Use

Keep using the sideloaded version with local hosting.

### For Organization-Wide Deployment

1. Host the add-in files on a secure web server (HTTPS required)
2. Update manifest.xml URLs to point to production server
3. Deploy via Microsoft 365 admin center
4. Submit to AppSource (optional) for public distribution

## Security & Privacy

- All email processing happens locally in the browser
- No email content is sent to external servers (in current implementation)
- Modify code to integrate AI services with appropriate data handling
- Ensure compliance with your organization's data policies

## Future Enhancements

- [ ] Integration with actual AI/ML services (OpenAI, Azure Cognitive Services)
- [ ] Support for multiple languages
- [ ] Learning from user feedback to improve suggestions
- [ ] Integration with task management tools (Todoist, Asana, Microsoft To Do)
- [ ] Advanced meeting scheduling with calendar conflict detection
- [ ] Email classification and auto-filing
- [ ] Template library for common response types
- [ ] Analytics dashboard showing time saved

## License

MIT License - Free to use and modify

## Support

For issues, questions, or feature requests, please contact Joe Newman or open an issue in the project repository.

---

**Created for Joe Newman** | Version 1.0.0
