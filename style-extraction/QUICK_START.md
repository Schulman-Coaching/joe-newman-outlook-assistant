# Quick Start Guide - 5 Minutes

Get Joe's writing style extracted in 5 simple commands!

## Prerequisites

- [ ] Node.js installed (v16+)
- [ ] Python installed (3.8+)
- [ ] Azure app registered (see SETUP_GUIDE.md Part 1)
- [ ] Credentials in `.env` file

## Installation (One-Time Setup)

```bash
# 1. Navigate to directory
cd style-extraction

# 2. Install dependencies
npm install && pip3 install -r requirements.txt

# 3. Configure credentials
cp .env.example .env
# Edit .env with your Azure credentials
```

## Extract Writing Style (5 Steps)

### Step 1: Authenticate (30 seconds)
```bash
node auth.js
```
Opens browser → Sign in → Grants permissions → ✅ Done

### Step 2: Extract Emails (2 minutes)
```bash
# Test with 1 month first
node extract-emails.js --months 1

# Or full 6 months
node extract-emails.js --months 6
```

### Step 3: Process & Anonymize (30 seconds)
```bash
python3 process-emails.py
```
Removes customer info, cleans formatting

### Step 4: Analyze Style (30 seconds)
```bash
python3 analyze-style.py
```
Generates style profile

### Step 5: Copy to Add-in (10 seconds)
```bash
cp output/style-profile.json ../src/config/joe-newman-style.json
```

## That's It! 🎉

Your style profile is ready to use in the Email Assistant.

## Troubleshooting

**"No authentication token found"**
→ Run: `node auth.js` first

**"Input file not found"**
→ Run steps in order (extract → process → analyze)

**"Permission denied"**
→ Check Azure portal API permissions

**"Module not found"**
→ Run: `npm install` and `pip3 install -r requirements.txt`

## Output Files

After completion, you'll have:

```
output/
├── raw-emails.json           # Extracted from Outlook
├── cleaned-emails.json       # Processed and anonymized
├── style-profile.json        # ⭐ Main output
└── training-data.txt         # Sample emails for reference
```

## Next Steps

1. Review `output/style-profile.json`
2. Verify greetings and sign-offs match Joe's style
3. Integrate with Email Assistant
4. Test personalized responses

## Re-running (Future Updates)

Extract new emails quarterly:

```bash
# Quick refresh (last 3 months)
node extract-emails.js --months 3
python3 process-emails.py
python3 analyze-style.py
```

---

**Questions?** See SETUP_GUIDE.md for detailed instructions
