# Writing Style Extraction System

## Overview

This system extracts Joe's writing style from his Outlook sent emails using Microsoft Graph API, then processes and analyzes the data to create personalized AI response templates.

## What It Does

1. **Connects to Microsoft Graph API** - Authenticates with Joe's Microsoft 365 account
2. **Extracts Sent Emails** - Retrieves emails from Sent Items folder (with date filtering)
3. **Cleans & Anonymizes** - Removes customer info, keeps only Joe's writing
4. **Analyzes Style** - Identifies patterns in greetings, tone, structure, vocabulary
5. **Generates Profile** - Creates a style profile for personalizing AI responses

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│  Microsoft Graph API (Office 365)                   │
│  - Sent Items Folder                                │
│  - Email Messages & Metadata                        │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  auth.js - Authentication Module                    │
│  - OAuth 2.0 Authorization Code Flow                │
│  - Token Management                                 │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  extract-emails.js - Data Extraction                │
│  - Fetch sent emails (filtered by date)            │
│  - Extract body content                             │
│  - Remove quoted text                               │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  process-emails.py - Data Processing                │
│  - Anonymize customer information                   │
│  - Clean formatting                                 │
│  - Extract Joe's original text only                 │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  analyze-style.py - Style Analysis                  │
│  - Identify greeting patterns                       │
│  - Analyze tone and vocabulary                      │
│  - Extract common phrases                           │
│  - Measure response characteristics                 │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  style-profile.json - Output                        │
│  - Personalized style profile for AI                │
└─────────────────────────────────────────────────────┘
```

## Files in This Directory

```
style-extraction/
├── README.md                          # This file
├── SETUP_GUIDE.md                     # Step-by-step setup instructions
├── auth.js                            # Microsoft Graph authentication
├── extract-emails.js                  # Email extraction from Graph API
├── process-emails.py                  # Clean and anonymize email data
├── analyze-style.py                   # Analyze writing patterns
├── package.json                       # Node.js dependencies
├── requirements.txt                   # Python dependencies
├── config.example.json                # Configuration template
├── .env.example                       # Environment variables template
└── output/                            # Generated files
    ├── raw-emails.json                # Raw extracted emails
    ├── cleaned-emails.json            # Processed emails
    ├── style-profile.json             # Final style analysis
    └── training-data.txt              # Text samples for AI training
```

## Quick Start

### Prerequisites

1. **Microsoft 365 Account** - Joe's Outlook account
2. **Azure App Registration** - For Graph API access
3. **Node.js** (v16+) - For API integration
4. **Python** (3.8+) - For data processing

### Installation

```bash
# Navigate to style-extraction directory
cd style-extraction

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your Azure app credentials
```

### Usage

```bash
# Step 1: Authenticate with Microsoft Graph
node auth.js

# Step 2: Extract emails (last 6 months)
node extract-emails.js --months 6

# Step 3: Process and anonymize
python process-emails.py

# Step 4: Analyze style
python analyze-style.py

# Result: style-profile.json created in output/
```

## What Gets Extracted

### Email Metadata
- Subject lines
- Sent date/time
- Recipient type (customer, supplier, internal)
- Email length (word count)

### Email Content
- Body text (Joe's writing only)
- Greeting style
- Sign-off style
- Paragraph structure
- Sentence length patterns

### What Gets REMOVED (Privacy)
- Customer names → "[Customer]"
- Customer emails → Removed
- Phone numbers → Removed
- Addresses → Removed
- Financial details → Removed
- Account numbers → Removed

## Style Analysis Output

The system generates a `style-profile.json` with:

```json
{
  "greeting_patterns": {
    "most_common": "Hi [Name],",
    "variations": ["Hello [Name],", "Hey [Name],", "[Name],"],
    "usage_percentages": {
      "Hi": 65,
      "Hello": 25,
      "Hey": 8,
      "Direct": 2
    }
  },
  "sign_offs": {
    "most_common": "Thanks,\nJoe",
    "variations": ["Best,\nJoe", "Joe", "Thanks,\nJoe Newman"],
    "usage_percentages": {
      "Thanks": 55,
      "Best": 30,
      "Name only": 15
    }
  },
  "tone_analysis": {
    "overall_tone": "Professional-Friendly",
    "formality_score": 6.5,
    "warmth_score": 7.2,
    "directness_score": 8.1
  },
  "writing_characteristics": {
    "avg_email_length": 120,
    "avg_sentence_length": 15,
    "avg_paragraph_length": 3,
    "common_phrases": [
      "Let me know if you have any questions",
      "Thanks for reaching out",
      "I'd be happy to help",
      "Looking forward to working with you"
    ]
  },
  "vocabulary": {
    "technical_terms": ["lumber", "drywall", "2x4", "delivery", "bulk order"],
    "business_terms": ["quote", "pricing", "inventory", "vendor"],
    "connector_words": ["however", "additionally", "meanwhile"]
  },
  "response_patterns": {
    "quote_requests": {
      "typical_structure": [
        "Acknowledge request",
        "Provide pricing details",
        "Mention delivery options",
        "Invite follow-up questions"
      ],
      "sample_length": "150-200 words"
    },
    "delivery_scheduling": {
      "typical_structure": [
        "Confirm request",
        "Propose specific times",
        "Ask for confirmation"
      ],
      "sample_length": "80-100 words"
    }
  }
}
```

## Security & Privacy

### API Permissions Required
- `Mail.Read` - Read user's mail
- `User.Read` - Read user profile

### Data Storage
- All data stored **locally only**
- No cloud upload of email content
- Processed files saved to `output/` directory
- Can be deleted anytime

### Privacy Features
1. **Anonymization** - Customer info removed
2. **Local Processing** - No external APIs
3. **User Control** - Joe can review before use
4. **Selective Export** - Choose date ranges
5. **Secure Tokens** - OAuth tokens expire after use

## Integration with Email Assistant

Once style profile is generated:

1. **Copy to Add-in:**
   ```bash
   cp output/style-profile.json ../src/config/
   ```

2. **Update Response Templates:**
   - Templates in `taskpane.js` will reference style profile
   - AI responses personalized with Joe's patterns
   - Greetings/sign-offs match Joe's style

3. **Enable Style Mode:**
   - Add-in automatically uses style profile when available
   - Falls back to generic templates if not present

## Troubleshooting

### "Authentication Failed"
- Check Azure app credentials in `.env`
- Ensure redirect URI matches Azure portal
- Verify tenant ID is correct

### "No Emails Found"
- Check date range (might be too narrow)
- Verify Sent Items folder has emails
- Confirm API permissions granted

### "Processing Errors"
- Check Python dependencies installed
- Verify JSON format in raw-emails.json
- Review error logs in output/errors.log

## Maintenance

### Updating Style Profile
Re-run extraction quarterly to capture evolving style:
```bash
# Extract last 3 months only
node extract-emails.js --months 3 --incremental
```

### Backup
```bash
# Backup current profile
cp output/style-profile.json output/style-profile-backup-$(date +%Y%m%d).json
```

## Next Steps

1. **Follow [SETUP_GUIDE.md](./SETUP_GUIDE.md)** for detailed setup
2. Run extraction on test date range first
3. Review anonymized output before full extraction
4. Generate style profile
5. Integrate with Email Assistant add-in

## Support

- **Azure Portal:** https://portal.azure.com
- **Graph API Docs:** https://docs.microsoft.com/graph/
- **Graph Explorer:** https://developer.microsoft.com/graph/graph-explorer

---

**Created:** January 16, 2026
**Status:** Ready for Setup
**Privacy:** All processing local, no external data sharing
