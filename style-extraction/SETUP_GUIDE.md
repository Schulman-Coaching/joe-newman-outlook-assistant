# Microsoft Graph API Setup Guide

## Complete Step-by-Step Instructions

This guide walks you through setting up Microsoft Graph API access to extract Joe's writing style from his Outlook sent emails.

---

## Part 1: Azure App Registration (15 minutes)

### Step 1: Access Azure Portal

1. Go to **https://portal.azure.com**
2. Sign in with Joe's Microsoft 365 account (or admin account)
3. Search for "Azure Active Directory" or "Microsoft Entra ID"

### Step 2: Create App Registration

1. In Azure Active Directory, click **"App registrations"** (left sidebar)
2. Click **"+ New registration"**
3. Fill in the form:
   ```
   Name: Joe Newman Email Style Extractor
   Supported account types: Accounts in this organizational directory only
   Redirect URI:
     - Platform: Web
     - URL: http://localhost:3000/auth/callback
   ```
4. Click **"Register"**

### Step 3: Note Application Credentials

After registration, you'll see the Overview page. Copy these values:

```
Application (client) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Directory (tenant) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Save these!** You'll need them for configuration.

### Step 4: Create Client Secret

1. In your app registration, go to **"Certificates & secrets"** (left sidebar)
2. Click **"+ New client secret"**
3. Description: `Email extraction secret`
4. Expires: Select "6 months" or "12 months"
5. Click **"Add"**
6. **IMMEDIATELY COPY THE VALUE** - you can't see it again!
   ```
   Secret Value: abc123...xyz789
   ```

### Step 5: Configure API Permissions

1. Go to **"API permissions"** (left sidebar)
2. Click **"+ Add a permission"**
3. Select **"Microsoft Graph"**
4. Select **"Delegated permissions"**
5. Add these permissions:
   - ✅ `Mail.Read` - Read user mail
   - ✅ `User.Read` - Read user profile
6. Click **"Add permissions"**
7. Click **"Grant admin consent for [Your Organization]"**
   - This requires admin privileges
   - If you're not admin, ask your IT department
8. Verify: Green checkmarks should appear next to permissions

---

## Part 2: Local Environment Setup (10 minutes)

### Step 1: Install Prerequisites

**Node.js:**
```bash
# Check if installed
node --version  # Should be v16 or higher

# If not installed, download from https://nodejs.org/
```

**Python:**
```bash
# Check if installed
python3 --version  # Should be 3.8 or higher

# If not installed, download from https://python.org/
```

### Step 2: Navigate to Project

```bash
cd joe-newman-outlook-assistant/style-extraction
```

### Step 3: Install Dependencies

**Node.js packages:**
```bash
npm install
```

This installs:
- `@microsoft/microsoft-graph-client` - Graph API client
- `@azure/msal-node` - Microsoft authentication
- `dotenv` - Environment variable management
- `axios` - HTTP requests

**Python packages:**
```bash
pip install -r requirements.txt
```

This installs:
- `python-dotenv` - Environment variables
- `regex` - Text processing
- `langdetect` - Language detection
- `nltk` - Natural language processing

### Step 4: Configure Environment

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file:**
   ```bash
   # Open in your editor
   nano .env
   # or
   code .env
   ```

3. **Add your Azure credentials:**
   ```
   # Azure App Registration
   CLIENT_ID=your-client-id-from-step-3
   CLIENT_SECRET=your-client-secret-from-step-4
   TENANT_ID=your-tenant-id-from-step-3

   # Redirect URI (should match Azure portal)
   REDIRECT_URI=http://localhost:3000/auth/callback

   # User email (Joe's email address)
   USER_EMAIL=joe.newman@yourdomain.com
   ```

4. **Save and close**

### Step 5: Create Output Directory

```bash
mkdir -p output
```

---

## Part 3: Running the Extraction (20 minutes)

### Step 1: Authenticate

```bash
node auth.js
```

**What happens:**
1. Opens browser window
2. Asks you to sign in with Joe's Microsoft 365 account
3. Requests permission to read mail
4. Shows success message
5. Saves access token locally

**Expected Output:**
```
🔐 Starting Microsoft Graph authentication...
🌐 Opening browser for sign-in...
✅ Authentication successful!
✅ Access token saved to .token.json
```

**If authentication fails:**
- Check CLIENT_ID and TENANT_ID are correct
- Verify redirect URI matches Azure portal
- Ensure API permissions granted in Azure

### Step 2: Extract Emails

**Test with small sample first:**
```bash
# Extract last 1 month only
node extract-emails.js --months 1 --limit 20
```

**Expected Output:**
```
📧 Extracting emails from Microsoft Graph API...
🔍 Searching Sent Items folder...
📨 Found 47 sent emails in last 1 month
📥 Fetching email details...
   [1/47] Subject: Quote Request - Lumber Order
   [2/47] Subject: Re: Delivery Schedule Change
   ...
✅ Extracted 47 emails
💾 Saved to output/raw-emails.json
```

**Full extraction (6 months):**
```bash
node extract-emails.js --months 6
```

**Options:**
```bash
--months N     # Number of months to look back (default: 6)
--limit N      # Maximum emails to extract (default: unlimited)
--output FILE  # Output file path (default: output/raw-emails.json)
```

### Step 3: Process and Anonymize

```bash
python process-emails.py
```

**What this does:**
1. Reads `output/raw-emails.json`
2. Removes quoted text (replies)
3. Anonymizes customer information
4. Cleans formatting
5. Extracts only Joe's original writing

**Expected Output:**
```
🔧 Processing and anonymizing emails...
📂 Reading output/raw-emails.json
📧 Processing 47 emails...
   [1/47] Cleaning and anonymizing...
   [2/47] Cleaning and anonymizing...
   ...
✅ Processed 47 emails
🔒 Anonymized customer information:
   - Names: 34 replaced
   - Emails: 47 removed
   - Phone numbers: 12 removed
   - Addresses: 8 removed
💾 Saved to output/cleaned-emails.json
```

### Step 4: Analyze Writing Style

```bash
python analyze-style.py
```

**What this analyzes:**
- Greeting patterns (Hi, Hello, Hey, etc.)
- Sign-off preferences (Thanks, Best, etc.)
- Average email length and structure
- Common phrases and vocabulary
- Tone and formality level
- Response patterns by email type

**Expected Output:**
```
📊 Analyzing writing style...
📂 Reading output/cleaned-emails.json
🔍 Analyzing 47 emails...

Greeting Analysis:
   "Hi [Name]," → 31 emails (65.96%)
   "Hello [Name]," → 12 emails (25.53%)
   "Hey [Name]," → 3 emails (6.38%)
   Direct address → 1 email (2.13%)

Sign-off Analysis:
   "Thanks,\nJoe" → 26 emails (55.32%)
   "Best,\nJoe" → 14 emails (29.79%)
   "Joe" → 7 emails (14.89%)

Tone Scores:
   Formality: 6.5/10 (Professional)
   Warmth: 7.2/10 (Friendly)
   Directness: 8.1/10 (Clear)

✅ Analysis complete!
💾 Saved to output/style-profile.json
💾 Saved training samples to output/training-data.txt
```

---

## Part 4: Review and Verification (10 minutes)

### Step 1: Review Raw Emails

```bash
# View first few emails
head -n 50 output/raw-emails.json
```

Check:
- ✅ Emails are from Joe's Sent Items
- ✅ Date range is correct
- ✅ Content looks reasonable

### Step 2: Review Cleaned Emails

```bash
# View anonymized version
head -n 50 output/cleaned-emails.json
```

Check:
- ✅ Customer names replaced with `[Customer]`
- ✅ Email addresses removed
- ✅ Quoted text removed
- ✅ Only Joe's original writing remains

### Step 3: Review Style Profile

```bash
# View the style profile
cat output/style-profile.json
```

Check:
- ✅ Greetings match Joe's actual style
- ✅ Sign-offs are accurate
- ✅ Common phrases sound like Joe
- ✅ Tone assessment seems correct

### Step 4: Review Training Data

```bash
# View training samples
head -n 100 output/training-data.txt
```

This file contains cleaned email samples for AI training.

---

## Part 5: Integration with Email Assistant (5 minutes)

### Step 1: Copy Style Profile

```bash
# Copy to add-in config directory
cp output/style-profile.json ../src/config/joe-newman-style.json
```

### Step 2: Update Add-in Configuration

Edit `src/config/config.js`:
```javascript
// Add style profile import
import joeStyle from './joe-newman-style.json';

// Add to config
export const config = {
  // ... existing config ...

  styleProfile: joeStyle,
  usePersonalizedStyle: true,
};
```

### Step 3: Update Response Templates

The add-in will now:
- Use Joe's greeting style automatically
- Match his sign-off preferences
- Incorporate his common phrases
- Match his tone and formality level

---

## Security Checklist

Before running in production:

- [ ] `.env` file is in `.gitignore` (never commit credentials!)
- [ ] Client secret has appropriate expiration date
- [ ] Access tokens stored securely in `.token.json`
- [ ] Output files don't contain sensitive data
- [ ] Customer information successfully anonymized
- [ ] Only necessary API permissions granted
- [ ] Admin consent provided for delegated permissions

---

## Troubleshooting

### "AADSTS50011: Redirect URI mismatch"
**Problem:** Redirect URI in code doesn't match Azure portal
**Solution:**
1. Check `.env` file: `REDIRECT_URI`
2. Check Azure portal: App registration → Authentication
3. Must match exactly (including http vs https)

### "Insufficient privileges to complete the operation"
**Problem:** API permissions not granted or admin consent missing
**Solution:**
1. Go to Azure portal → App registration → API permissions
2. Verify Mail.Read and User.Read are listed
3. Click "Grant admin consent" button
4. Wait 5 minutes for propagation

### "Token acquisition failed"
**Problem:** Invalid credentials or expired secret
**Solution:**
1. Verify CLIENT_ID, CLIENT_SECRET, TENANT_ID in `.env`
2. Check client secret hasn't expired (Azure portal)
3. Generate new secret if needed

### "No emails found"
**Problem:** Date range too narrow or no sent emails
**Solution:**
1. Try longer date range: `--months 12`
2. Check Sent Items folder has emails in that period
3. Verify user email is correct in `.env`

### "Python module not found"
**Problem:** Missing dependencies
**Solution:**
```bash
pip install -r requirements.txt
# or
pip3 install -r requirements.txt
```

---

## Maintenance

### Refresh Style Profile (Quarterly)

```bash
# Extract last 3 months
node extract-emails.js --months 3

# Process
python process-emails.py

# Analyze
python analyze-style.py

# Merge with existing profile
python merge-profiles.py
```

### Renew Client Secret (Annually)

1. Go to Azure portal → App registration
2. Certificates & secrets → Client secrets
3. Create new secret
4. Update `.env` file
5. Re-authenticate: `node auth.js`

---

## Data Privacy Summary

**What gets stored locally:**
- ✅ Email metadata (dates, subject lines)
- ✅ Joe's writing (anonymized)
- ✅ Style analysis results

**What NEVER gets stored:**
- ❌ Customer names (replaced with placeholders)
- ❌ Customer email addresses
- ❌ Phone numbers
- ❌ Financial information
- ❌ Account numbers

**Who has access:**
- Only the local machine running this code
- No cloud services
- No external APIs
- No data sharing

---

## Next Steps

1. ✅ Complete Azure setup (Part 1)
2. ✅ Install dependencies (Part 2)
3. ✅ Run authentication (Part 3, Step 1)
4. ✅ Extract test batch (Part 3, Step 2)
5. ✅ Review output for accuracy
6. ✅ Run full extraction
7. ✅ Integrate with Email Assistant

---

**Setup Time:** ~60 minutes total
**Recurring Time:** ~15 minutes quarterly (to refresh profile)

**Questions?** Refer to:
- Microsoft Graph API Docs: https://docs.microsoft.com/graph/
- Azure AD Documentation: https://docs.microsoft.com/azure/active-directory/
- MSAL Documentation: https://docs.microsoft.com/azure/active-directory/develop/msal-overview
