# Integration Architecture: Zendesk & Fishbowl

## How Strategy 1 Connects to Your Real Systems

The prototype demonstrates the workflow. The **actual implementation** connects to your Zendesk and Fishbowl systems through secure APIs.

---

## System Architecture Overview

```
┌─────────────────┐
│   PO PDF File   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│           MBA PO Automation System (FastAPI)            │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Extract   │→ │   Classify  │→ │    Match    │   │
│  │   PO Data   │  │   PO Type   │  │   Products  │   │
│  └─────────────┘  └─────────────┘  └─────────────┘   │
│         │                 │                 │          │
│         └─────────────────┴─────────────────┘          │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │
            ┌──────────────┴──────────────┐
            │                              │
            ▼                              ▼
  ┌──────────────────┐          ┌──────────────────┐
  │   ZENDESK API    │          │  FISHBOWL API    │
  │                  │          │                  │
  │ • Create Ticket  │          │ • Part Lookup    │
  │ • Add Comments   │          │ • Inventory      │
  │ • Update Fields  │          │   Check          │
  │ • Set Tags       │          │ • (Future: SO)   │
  └──────────────────┘          └──────────────────┘
            │                              │
            │        Human Staff           │
            │           ▼                  │
            │  ┌──────────────────┐       │
            └──┤  Zendesk Portal  │◄──────┘
               │                  │
               │ • Review Quote   │
               │ • Edit if Needed │
               │ • Send to        │
               │   Customer       │
               └──────────────────┘
```

---

## Part 1: Zendesk Integration

### What Gets Created in Zendesk

When a PO is uploaded, the system automatically:

1. **Creates Internal Ticket**
   - Requester: `orders@mbasupply.com` (internal)
   - Subject: `PO #JCM284251 - ABC Construction Co.`
   - Status: `new`
   - Priority: Based on PO value

2. **Adds Private Comments** (staff only)
   ```
   Private Comment #1: "PO data extracted successfully"
   - PO Number: JCM284251
   - Customer: ABC Construction Co.
   - Ship To: 123 Main St, Denver, CO
   - Total Value: $1,875.00

   Private Comment #2: "Product matching completed"
   - Line 1: BRK SA350B → EXACT MATCH → In Stock (500)
   - Line 2: BRK CO250B → EXACT MATCH → In Stock (150)
   - Line 3: CAB VSW2121 → CROSSWALK MATCH → In Stock (2000)

   Private Comment #3: "Generated Quote (READY FOR REVIEW)"
   [Full quote table]
   ```

3. **Sets Custom Fields**
   ```yaml
   cf_po_number: "JCM284251"
   cf_intake_id: "intake_20260115_abc123"
   cf_po_type: "STOCK_ITEMS"
   cf_pipeline_state: "READY_TO_DRAFT"
   cf_match_status: "ALL_MATCHED"
   cf_inventory_status: "ALL_IN_STOCK"
   cf_fishbowl_so_create_status: "pending_status_enum"
   ```

4. **Applies Tags**
   ```
   #po-automation
   #stock-items
   #all-matched
   #ready-for-review
   ```

### API Calls Made to Zendesk

#### 1. Create Ticket
```python
POST https://{subdomain}.zendesk.com/api/v2/tickets.json

Headers:
  Authorization: Basic {base64(email:api_token)}
  Content-Type: application/json

Body:
{
  "ticket": {
    "requester": {"email": "orders@mbasupply.com"},
    "subject": "PO #JCM284251 - ABC Construction Co.",
    "comment": {
      "body": "PO intake initiated via automation",
      "public": false
    },
    "custom_fields": [
      {"id": 123456, "value": "JCM284251"},
      {"id": 123457, "value": "STOCK_ITEMS"}
    ],
    "tags": ["po-automation", "stock-items"]
  }
}
```

#### 2. Add Private Comment
```python
PUT https://{subdomain}.zendesk.com/api/v2/tickets/{ticket_id}.json

Body:
{
  "ticket": {
    "comment": {
      "body": "Product matching completed:\n- Line 1: BRK SA350B...",
      "public": false
    }
  }
}
```

#### 3. Update Custom Fields
```python
PUT https://{subdomain}.zendesk.com/api/v2/tickets/{ticket_id}.json

Body:
{
  "ticket": {
    "custom_fields": [
      {"id": 123458, "value": "READY_TO_DRAFT"},
      {"id": 123459, "value": "ALL_MATCHED"}
    ]
  }
}
```

### Configuration Required

You'll need from MBA Supply:

```env
# Zendesk API Credentials
ZENDESK_SUBDOMAIN=mbasupply          # Your Zendesk subdomain
ZENDESK_EMAIL=elie@mbasupply.com     # API user email
ZENDESK_API_TOKEN=xxxxxxxxxxxxx      # API token from Admin → API

# Custom Field IDs (get these from Zendesk admin)
CF_PO_NUMBER=360012345678
CF_INTAKE_ID=360012345679
CF_PO_TYPE=360012345680
CF_PIPELINE_STATE=360012345681
CF_MATCH_STATUS=360012345682
CF_INVENTORY_STATUS=360012345683
CF_FISHBOWL_SO_CREATE_STATUS=360012345684
CF_PO_JSON=360012345685
CF_EXCEPTION_REASONS=360012345686
CF_EXCEPTION_DETAILS=360012345687
```

### How to Get Custom Field IDs

```bash
# List all custom fields in your Zendesk
curl https://mbasupply.zendesk.com/api/v2/ticket_fields.json \
  -u elie@mbasupply.com/token:{api_token}
```

---

## Part 2: Fishbowl Integration

### What Gets Queried from Fishbowl

The system makes **READ-ONLY** calls to Fishbowl for:

1. **Part Number Lookup**
   - Match vendor codes to internal Fishbowl part numbers
   - Uses exact match first, then crosswalk table

2. **Inventory Check**
   - Get current quantity on hand
   - Get quantity available
   - Get expected restock dates (if out of stock)

### API Calls Made to Fishbowl

#### 1. Inventory Lookup
```python
GET {FISHBOWL_BASE_URL}/api/parts/inventory?number={part_number}

Headers:
  Authorization: Bearer {access_token}
  Content-Type: application/json

Response:
{
  "part_number": "BRK SA350B",
  "description": "Smoke Alarm, Battery Operated",
  "qty_on_hand": 500,
  "qty_available": 500,
  "qty_committed": 0,
  "unit_cost": 8.25,
  "location": "Warehouse A",
  "status": "Active"
}
```

#### 2. Authentication (if Fishbowl requires)
```python
POST {FISHBOWL_BASE_URL}/api/auth/login

Body:
{
  "username": "{username}",
  "password": "{password}"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Configuration Required

You'll need from MBA Supply:

```env
# Fishbowl API Credentials
FISHBOWL_BASE_URL=https://api.fishbowlinventory.com
FISHBOWL_USERNAME=automation_user
FISHBOWL_PASSWORD=xxxxxxxxxxxxx

# Or if using API key:
FISHBOWL_API_KEY=xxxxxxxxxxxxx
```

### Fishbowl Integration Notes

**Phase 0 (Current):**
- ✅ Read-only inventory lookups
- ✅ Part number matching
- ❌ NO Sales Order creation

**Phase 1 (Future):**
- ✅ Create Sales Orders (after human approval)
- ✅ Update order status
- ✅ Generate packing slips

### Crosswalk Table for Vendor Codes

Your system includes a crosswalk for mapping vendor codes to Fishbowl parts:

```json
{
  "external_system": "JCM",
  "customer_key": null,
  "vendor_code": "BRK SA350B",
  "fishbowl_part_number": "BRK SA350B",
  "active": true
}
```

This lives in `crosswalk.json` and can be extended as you add new products.

---

## Part 3: Strategy 1 Workflow with Real Systems

### Step-by-Step Integration Flow

```
1. PO PDF Uploaded
   └→ System extracts data (pypdf)

2. Create Zendesk Ticket
   └→ POST /api/v2/tickets
   └→ Set requester: orders@mbasupply.com
   └→ Add initial comment (private)
   └→ Get ticket ID: #12345

3. Product Matching
   └→ For each line item:
      ├→ Check exact vendor code match
      ├→ Check crosswalk table
      └→ Update Zendesk with match results (private comment)

4. Inventory Check (for each matched product)
   └→ GET /api/parts/inventory?number=BRK%20SA350B
   └→ Parse response: qty=500, available=500
   └→ Update Zendesk with inventory status (private comment)

5. Generate Quote
   └→ Calculate pricing (from inventory + margins)
   └→ Format as table
   └→ Add to Zendesk as private comment
   └→ Update custom field: cf_pipeline_state = "READY_TO_DRAFT"

6. Human Review (Staff in Zendesk)
   └→ Staff opens ticket #12345
   └→ Reviews all private comments
   └→ Sees generated quote
   └→ Options:
      ├→ Approve → Copy quote, send email to customer
      ├→ Edit → Modify quote, send to customer
      └→ Reject → Add comment, assign to specialist

7. After Human Sends Quote
   └→ Staff updates ticket status: "waiting_on_customer"
   └→ Staff adds public comment (visible to customer if needed)
   └→ Customer receives quote via normal email

8. Customer Responds
   └→ If approved: Staff creates Sales Order manually
   └→ If questions: Handle in Zendesk as normal
   └→ If rejected: Close ticket
```

---

## Part 4: Error Handling & Dry-Run Mode

### Dry-Run Mode (Development)

The system can run WITHOUT real API credentials:

```python
# In .env
ZENDESK_DRY_RUN=1

# What happens:
# - No actual Zendesk API calls
# - Logs what WOULD be sent
# - Returns success response
# - Allows testing without affecting production
```

### Error Scenarios

**Zendesk API Fails:**
```python
# System behavior:
- Logs error: "Zendesk API failed: Connection timeout"
- Continues processing (doesn't stop)
- Sets exception in workflow model
- Still returns data to user
- Admin can retry later
```

**Fishbowl API Fails:**
```python
# System behavior:
- Logs error: "Fishbowl inventory lookup failed"
- Sets inventory status: "UNKNOWN"
- Adds exception_reason to line item
- Quote generated with note: "Inventory check pending"
- Human reviewer sees the issue
```

**Part Not Found:**
```python
# System behavior:
- Match status: "NO_MATCH"
- Inventory status: "N/A"
- Escalates to human for manual lookup
- Zendesk ticket tagged: #needs-product-specialist
```

---

## Part 5: Security & Compliance

### API Authentication

**Zendesk:**
- Uses API token (not password)
- Tokens can be rotated
- Scoped to specific permissions

**Fishbowl:**
- Uses OAuth2 or API key (depending on Fishbowl version)
- Tokens expire and refresh automatically
- Read-only access initially

### Data Security

**At Rest:**
- API credentials stored in environment variables
- Never committed to git (.env in .gitignore)
- Production uses secrets management (AWS Secrets Manager, etc.)

**In Transit:**
- All API calls over HTTPS
- TLS 1.2+ required
- No sensitive data in URL parameters

**Access Control:**
- Zendesk tickets are internal only
- Private comments not visible to customers
- Staff roles control who sees what

### Audit Trail

Every action logged:
```python
2026-01-15 14:23:01 | INFO | Ticket created: #12345
2026-01-15 14:23:03 | INFO | Fishbowl lookup: BRK SA350B -> 500 available
2026-01-15 14:23:05 | INFO | Quote generated: $1,875.00
2026-01-15 14:30:22 | INFO | Staff viewed ticket: elie@mbasupply.com
2026-01-15 14:32:15 | INFO | Quote sent to customer: ABC Construction Co.
```

---

## Part 6: Setup Checklist for MBA Supply

### Before Go-Live:

#### Zendesk Setup
- [ ] Create API token in Zendesk admin
- [ ] Create custom fields (10 fields needed)
- [ ] Note down all custom field IDs
- [ ] Test API connection with read-only call
- [ ] Create `orders@mbasupply.com` user (if not exists)
- [ ] Set up tags: `#po-automation`, etc.

#### Fishbowl Setup
- [ ] Create API user with read-only inventory access
- [ ] Get API credentials or OAuth setup
- [ ] Test inventory lookup API endpoint
- [ ] Verify part number format matches your system
- [ ] Document any custom fields or locations

#### Crosswalk Table
- [ ] Export list of common vendor codes
- [ ] Map to internal Fishbowl part numbers
- [ ] Add to `crosswalk.json`
- [ ] Test matching logic with sample POs

#### Testing
- [ ] Run system in dry-run mode
- [ ] Process 5-10 test POs
- [ ] Verify Zendesk tickets created correctly
- [ ] Verify inventory data accurate
- [ ] Verify quotes calculated correctly
- [ ] Test error scenarios

#### Training
- [ ] Train staff on new Zendesk workflow
- [ ] Show where to find generated quotes
- [ ] Explain review/approve process
- [ ] Document troubleshooting steps

---

## Part 7: Cost & Performance

### API Usage

**Zendesk:**
- ~3 API calls per PO processed
- Well within free/standard plan limits
- No additional cost expected

**Fishbowl:**
- 1 API call per line item (for inventory)
- Typical PO: 3-5 line items = 3-5 calls
- Depends on Fishbowl licensing

### Performance

**End-to-End Time:**
- PDF upload to Zendesk ticket ready: **8-10 seconds**
  - Extraction: 2-3 sec
  - Zendesk create: 1-2 sec
  - Product matching: 1 sec
  - Fishbowl lookups (3 items): 3-4 sec
  - Quote generation: 1 sec

**Scalability:**
- Current setup: 100+ POs/hour
- With optimization: 500+ POs/hour
- Async processing for high volume

---

## Quick Start Commands

### Test Zendesk Connection
```bash
curl https://mbasupply.zendesk.com/api/v2/tickets.json \
  -u elie@mbasupply.com/token:YOUR_API_TOKEN \
  -X GET
```

### Test Fishbowl Connection
```bash
curl https://your-fishbowl-url/api/parts/inventory?number=TEST_PART \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Run Integration Test
```bash
cd /path/to/mba-po-automation
pytest tests/test_integration.py -v
```

---

## Questions for MBA Supply

Before implementation, we need:

1. **Zendesk Access:**
   - Admin access to create custom fields
   - Or: Pre-created custom field IDs

2. **Fishbowl Access:**
   - API endpoint URL
   - Authentication method (OAuth, API key, username/password)
   - Read-only user credentials

3. **Business Rules:**
   - Pricing calculations/markup rules
   - Customer-specific pricing
   - Freight/shipping cost logic

4. **Workflow Preferences:**
   - Who reviews quotes?
   - Approval thresholds?
   - Escalation rules?

---

## Summary

**The Prototype** shows what the workflow looks like from a user perspective.

**The Real Implementation** connects to your actual Zendesk and Fishbowl systems via secure APIs, creating tickets and checking inventory in real-time.

**Strategy 1** keeps humans in control - the system prepares everything, but staff reviews and approves before any customer communication happens.
