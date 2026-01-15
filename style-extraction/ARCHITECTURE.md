# Style Extraction System Architecture

## High-Level Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER (Joe Newman)                             │
│                  Microsoft 365 Account                               │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                │ OAuth 2.0 Authentication
                                │ (Delegated Permissions)
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   MICROSOFT GRAPH API                                │
│                 https://graph.microsoft.com                          │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  /me/mailFolders/SentItems/messages                       │      │
│  │                                                            │      │
│  │  Permissions: Mail.Read, User.Read                        │      │
│  └──────────────────────────────────────────────────────────┘      │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                │ HTTPS REST API
                                │ JSON Response
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│              LOCAL EXTRACTION SYSTEM                                 │
│              (Node.js + Python)                                      │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   auth.js    │  │extract-emails│  │process-emails│             │
│  │              │→ │     .js      │→ │    .py       │             │
│  │ OAuth Flow   │  │ Graph API    │  │ Anonymize    │             │
│  │ Token Mgmt   │  │ Pagination   │  │ Clean HTML   │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                             │                         │
│                                             │                         │
│                                             ▼                         │
│                                    ┌──────────────┐                 │
│                                    │analyze-style │                 │
│                                    │    .py       │                 │
│                                    │ Pattern      │                 │
│                                    │ Detection    │                 │
│                                    └──────────────┘                 │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                │ File Output (JSON)
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       OUTPUT FILES                                   │
│                                                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
│  │ raw-emails.json │  │cleaned-emails   │  │ style-profile   │   │
│  │                 │  │    .json        │  │    .json        │   │
│  │ Original Data   │  │ Anonymized      │  │ Final Analysis  │   │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                │ Integration
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│              EMAIL ASSISTANT ADD-IN                                  │
│                                                                       │
│  Uses style-profile.json for:                                       │
│  - Personalized greetings                                           │
│  - Matching sign-offs                                               │
│  - Tone consistency                                                 │
│  - Common phrase usage                                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Detail

### Phase 1: Authentication

```
auth.js
  │
  ├─> Generate authorization URL
  │   (with scopes: Mail.Read, User.Read)
  │
  ├─> Start local callback server (port 3000)
  │
  ├─> Open browser → Azure AD login
  │
  ├─> User signs in and grants permissions
  │
  ├─> Receive authorization code
  │
  ├─> Exchange code for access token
  │
  └─> Save token to .token.json
      (expires in 1 hour)
```

### Phase 2: Extraction

```
extract-emails.js
  │
  ├─> Load access token from .token.json
  │
  ├─> Calculate date range (--months parameter)
  │
  ├─> Query Graph API:
  │   GET /me/mailFolders/SentItems/messages
  │   Filter: sentDateTime ge [start] and sentDateTime le [end]
  │   Select: subject, body, from, sentDateTime
  │   OrderBy: sentDateTime desc
  │   Top: 100 (per request)
  │
  ├─> Pagination loop:
  │   - Fetch batch (100 emails)
  │   - Append to results
  │   - Check for @odata.nextLink
  │   - Repeat until limit reached or no more data
  │
  └─> Save to output/raw-emails.json
      Format: {
        extractedAt, totalEmails, dateRange,
        emails: [
          {id, subject, sentDate, body, bodyType, from, wordCount}
        ]
      }
```

### Phase 3: Processing

```
process-emails.py
  │
  ├─> Load output/raw-emails.json
  │
  ├─> For each email:
  │   │
  │   ├─> Remove HTML tags (if bodyType=html)
  │   │   - Strip <style>, <script>
  │   │   - Remove all HTML elements
  │   │   - Decode entities (&nbsp;, &amp;, etc.)
  │   │
  │   ├─> Remove quoted text
  │   │   - Detect quote patterns (On...wrote:, From:, >)
  │   │   - Split on quote indicators
  │   │   - Keep only original text
  │   │
  │   ├─> Extract customer names
  │   │   - Find "Hi [Name]," patterns
  │   │   - Build list of names to anonymize
  │   │
  │   ├─> Anonymize names
  │   │   - Replace customer names with [Customer]
  │   │   - Preserve Joe/Newman
  │   │
  │   ├─> Anonymize sensitive data
  │   │   - Email addresses → [email removed]
  │   │   - Phone numbers → [phone removed]
  │   │   - Addresses → [address removed]
  │   │   - Account numbers → [account removed]
  │   │   - Currency → $[amount]
  │   │   - Credit cards → [card number removed]
  │   │
  │   ├─> Clean formatting
  │   │   - Normalize whitespace
  │   │   - Remove excessive newlines
  │   │   - Trim
  │   │
  │   └─> Skip if too short (<20 chars)
  │
  └─> Save to output/cleaned-emails.json
      Format: {
        processedAt, totalEmails, processingStats,
        emails: [
          {id, subject, sentDate, body, wordCount}
        ]
      }
```

### Phase 4: Analysis

```
analyze-style.py
  │
  ├─> Load output/cleaned-emails.json
  │
  ├─> Analyze greetings
  │   - Regex patterns: Hi, Hello, Hey, Dear, [Name]
  │   - Count occurrences (first 100 chars)
  │   - Calculate usage percentages
  │   - Identify most common
  │
  ├─> Analyze sign-offs
  │   - Regex patterns: Thanks, Best, Regards, etc. + Joe/Joe Newman
  │   - Count occurrences (last 150 chars)
  │   - Calculate usage percentages
  │   - Identify most common
  │
  ├─> Analyze tone
  │   - Count formal indicators (dear, sincerely, etc.)
  │   - Count friendly indicators (hey, thanks, great, etc.)
  │   - Count professional indicators (please, appreciate, etc.)
  │   - Calculate scores (0-10 scale)
  │   - Determine overall tone category
  │
  ├─> Analyze writing characteristics
  │   - Average email length (word count)
  │   - Average sentence length (split on [.!?])
  │   - Average paragraph count (split on \n\n)
  │
  ├─> Extract common phrases
  │   - Generate n-grams (3-8 words)
  │   - Count occurrences
  │   - Filter (min 3 occurrences)
  │   - Return top 15
  │
  ├─> Categorize emails
  │   - Quote requests (keywords: quote, price, cost)
  │   - Delivery scheduling (keywords: delivery, schedule, ship)
  │   - Orders (keywords: order, purchase, buy)
  │   - Questions (keywords: question, wondering, ask)
  │   - General (everything else)
  │
  ├─> Analyze response patterns
  │   - For each category:
  │     - Count emails
  │     - Calculate average length
  │     - Extract sample
  │
  ├─> Save style profile → output/style-profile.json
  │
  └─> Save training samples → output/training-data.txt
      (Up to 5 samples per category)
```

---

## Component Dependencies

### Node.js Modules

```
extract-emails.js
    ├── @microsoft/microsoft-graph-client (Graph API client)
    ├── @azure/msal-node (OAuth authentication)
    ├── dotenv (environment variables)
    ├── yargs (command-line arguments)
    └── fs, path (Node.js built-in)

auth.js
    ├── @azure/msal-node (OAuth flow)
    ├── dotenv (environment variables)
    ├── http (callback server)
    ├── url (URL parsing)
    └── child_process (open browser)
```

### Python Modules

```
process-emails.py
    ├── json (JSON handling)
    ├── re (regex patterns)
    ├── os (file operations)
    └── datetime (timestamps)

analyze-style.py
    ├── json (JSON handling)
    ├── re (regex patterns)
    ├── collections.Counter (frequency counting)
    ├── collections.defaultdict (categorization)
    └── datetime (timestamps)
```

---

## Security Architecture

### Authentication Flow

```
1. User initiates: node auth.js
   ↓
2. Generate auth URL with:
   - client_id
   - redirect_uri
   - scope (Mail.Read, User.Read)
   - response_type=code
   ↓
3. Start local server on :3000
   ↓
4. Open browser → Azure AD
   ↓
5. User signs in
   ↓
6. User grants permissions
   ↓
7. Azure redirects to: http://localhost:3000/auth/callback?code=...
   ↓
8. Local server receives code
   ↓
9. Exchange code for token:
   POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
   Body: {
     client_id, client_secret, code,
     redirect_uri, grant_type=authorization_code
   }
   ↓
10. Receive access token (JWT)
    ↓
11. Save token to .token.json (gitignored)
    ↓
12. Token valid for 1 hour
    ↓
13. Refresh token valid for 90 days (optional)
```

### Data Protection

```
┌───────────────────────────────────────────────────┐
│                    LAYERS                          │
├───────────────────────────────────────────────────┤
│ Layer 1: Network Security                         │
│   - HTTPS only (TLS 1.2+)                        │
│   - Azure AD authentication                       │
│   - OAuth 2.0 tokens                             │
├───────────────────────────────────────────────────┤
│ Layer 2: Access Control                           │
│   - Delegated permissions only                    │
│   - Scope limited (Mail.Read, User.Read)         │
│   - No Mail.ReadWrite                            │
│   - No Mail.Send                                 │
├───────────────────────────────────────────────────┤
│ Layer 3: Data Handling                            │
│   - Local processing only                         │
│   - No external API calls                        │
│   - No cloud uploads                             │
│   - Memory-only sensitive data                   │
├───────────────────────────────────────────────────┤
│ Layer 4: Anonymization                            │
│   - Customer names removed                        │
│   - Email addresses removed                       │
│   - Phone numbers removed                        │
│   - Financial data removed                       │
│   - Pattern-based detection                      │
├───────────────────────────────────────────────────┤
│ Layer 5: Storage Security                         │
│   - .env in .gitignore                           │
│   - .token.json in .gitignore                    │
│   - output/ in .gitignore                        │
│   - No accidental commits                        │
├───────────────────────────────────────────────────┤
│ Layer 6: Access Restrictions                      │
│   - File permissions (0600)                       │
│   - Local user only                              │
│   - No network exposure                          │
│   - Temporary token expiration                   │
└───────────────────────────────────────────────────┘
```

---

## Performance Characteristics

### Time Complexity

```
Phase 1: Authentication
  O(1) - Single OAuth flow
  ~30 seconds (user interaction time)

Phase 2: Extraction
  O(n/100) where n = number of emails
  Graph API pagination (100 per request)
  ~100 emails/minute

  Examples:
  - 100 emails: ~1 minute
  - 500 emails: ~5 minutes
  - 1000 emails: ~10 minutes

Phase 3: Processing
  O(n) where n = number of emails
  Linear processing per email
  ~1000 emails/minute

  Examples:
  - 100 emails: ~6 seconds
  - 500 emails: ~30 seconds
  - 1000 emails: ~1 minute

Phase 4: Analysis
  O(n*m) where n = emails, m = average email length
  Pattern matching + n-gram generation
  ~500 emails/minute

  Examples:
  - 100 emails: ~12 seconds
  - 500 emails: ~1 minute
  - 1000 emails: ~2 minutes

TOTAL: ~7-15 minutes for 500 emails
```

### Space Complexity

```
Memory Usage:
- Node.js process: ~50MB
- Python process: ~30MB
- Peak: ~100MB total

Disk Usage (per 1000 emails):
- raw-emails.json: ~5MB
- cleaned-emails.json: ~2MB
- style-profile.json: ~50KB
- training-data.txt: ~500KB
- Total: ~7.5MB per 1000 emails
```

---

## Error Handling

### Network Errors

```
try {
    const response = await graphClient.api(...).get();
} catch (error) {
    if (error.statusCode === 401) {
        → Re-authenticate required
    } else if (error.statusCode === 403) {
        → Permission denied
    } else if (error.statusCode === 429) {
        → Rate limit (retry with backoff)
    } else if (error.statusCode === 5xx) {
        → Server error (retry)
    } else {
        → Unknown error (log and exit)
    }
}
```

### Data Errors

```
- Missing .env file → Clear error message
- Invalid JSON → Parse error handling
- Empty email body → Skip with counter
- No emails found → Warning message
- Token expired → Re-auth prompt
```

---

## Extension Points

### Adding New Analyses

```python
# In analyze-style.py

def analyze_new_dimension(emails):
    """Add custom analysis."""
    # Your analysis logic
    return results

# In run():
new_analysis = self.analyze_new_dimension(self.emails)
style_profile["new_dimension"] = new_analysis
```

### Adding New Anonymization Patterns

```python
# In process-emails.py

PATTERNS = {
    # ... existing patterns ...
    'new_pattern': r'your_regex_here',
}

REPLACEMENTS = {
    # ... existing replacements ...
    'new_pattern': '[replaced]',
}
```

### Adding New Email Categories

```python
# In analyze-style.py

def categorize_emails(self):
    categories = defaultdict(list)

    new_keywords = ['keyword1', 'keyword2']

    for email in self.emails:
        if any(kw in email['body'].lower() for kw in new_keywords):
            categories['new_category'].append(email)

    return categories
```

---

## Testing Strategy

### Unit Tests (Future)

```javascript
// auth.test.js
describe('Authentication', () => {
  test('validates config correctly', () => {});
  test('generates auth URL', () => {});
  test('handles token exchange', () => {});
});

// extract-emails.test.js
describe('Email Extraction', () => {
  test('calculates date range', () => {});
  test('handles pagination', () => {});
  test('respects email limit', () => {});
});
```

```python
# test_process_emails.py
def test_remove_html_tags():
    assert remove_html_tags('<p>test</p>') == 'test'

def test_anonymize_email():
    assert anonymize_text('test@example.com') == '[email removed]'

def test_remove_quoted_text():
    assert 'wrote:' not in remove_quoted_text(sample_with_quote)
```

### Integration Tests

```bash
# Test full pipeline with sample data
node extract-emails.js --limit 10
python3 process-emails.py
python3 analyze-style.py

# Verify outputs
test -f output/raw-emails.json
test -f output/cleaned-emails.json
test -f output/style-profile.json
```

---

**Architecture Version:** 1.0
**Last Updated:** January 16, 2026
**Status:** Production Ready
