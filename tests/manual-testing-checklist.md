# Manual Testing Checklist
Quick reference guide for manual testing of the Email Assistant

## Pre-Testing Setup

### Environment Preparation
- [ ] Outlook Desktop installed and running
- [ ] Add-in loaded via manifest
- [ ] Test email account configured
- [ ] Browser console open (F12) for debugging
- [ ] Test email samples prepared

### Test Data Preparation
Create test emails in your inbox with the following subjects:
- [ ] "Question about lumber delivery" (simple question)
- [ ] "Building Supply Partnership Questions" (multi-point inquiry)
- [ ] "Need to discuss Q1 strategy" (meeting request)
- [ ] "Contract Review Needed" (task with deadline)
- [ ] "Action Items from Today's Meeting" (multiple tasks)

---

## Feature 1: Response Generation

### Test 1A: Quick Reply Generation
**Steps:**
1. Open email: "Question about lumber delivery"
2. Open Email Assistant task pane
3. Click "Responses" tab
4. Select "Professional" tone
5. Click "Quick Reply" button

**Expected Results:**
- [ ] Response generates in < 2 seconds
- [ ] Response is 40-100 words
- [ ] Mentions rescheduling
- [ ] Professional greeting
- [ ] Signed "Joe Newman"

**Actual Result:** _______________

---

### Test 1B: Detailed Reply Generation
**Steps:**
1. Open email: "Building Supply Partnership Questions"
2. Select "Friendly" tone
3. Click "Detailed Reply" button

**Expected Results:**
- [ ] Response generates in < 5 seconds
- [ ] Response is 150-300 words
- [ ] Addresses multiple questions
- [ ] Warm, friendly tone
- [ ] Structured with paragraphs

**Actual Result:** _______________

---

### Test 1C: Meeting Response
**Steps:**
1. Open email: "Need to discuss Q1 strategy"
2. Select "Formal" tone
3. Click "Suggest Meeting" button

**Expected Results:**
- [ ] Suggests scheduling meeting
- [ ] Includes time slot placeholders
- [ ] Formal tone maintained
- [ ] Professional closing

**Actual Result:** _______________

---

### Test 1D: Tone Variations
**Steps:**
1. Open any email
2. Generate response with "Professional" tone → Note results
3. Click "Regenerate"
4. Change to "Friendly" tone → Note results
5. Change to "Formal" tone → Note results
6. Change to "Casual" tone → Note results

**Expected Results:**
- [ ] Each tone produces different greeting style
- [ ] Sign-offs change appropriately
- [ ] Overall tone matches selection

**Actual Result:** _______________

---

### Test 1E: Edit and Insert Response
**Steps:**
1. Generate any response
2. Edit the response text manually
3. Click "Insert into Reply" button

**Expected Results:**
- [ ] New reply window opens
- [ ] Response text appears in body
- [ ] Formatting preserved
- [ ] Original email quoted below

**Actual Result:** _______________

---

## Feature 2: Task Extraction

### Test 2A: Single Task Detection
**Steps:**
1. Open email: "Contract Review Needed"
2. Click "Tasks" tab
3. Click "Extract Action Items" button

**Expected Results:**
- [ ] Extracts at least 1 task
- [ ] Task mentions "review contract"
- [ ] Priority marked as HIGH or MEDIUM
- [ ] Due date shows "January 20"
- [ ] Task checkbox present

**Actual Result:** _______________

---

### Test 2B: Multiple Tasks with Priorities
**Steps:**
1. Open email: "Action Items from Today's Meeting"
2. Click "Extract Action Items" button

**Expected Results:**
- [ ] Extracts 4-5 tasks
- [ ] "Sign vendor agreement" → HIGH priority
- [ ] "Review marketing materials" → MEDIUM priority
- [ ] "Update bio" → LOW priority
- [ ] Due dates extracted where mentioned

**Actual Result:** _______________

---

### Test 2C: Task Completion Tracking
**Steps:**
1. Extract tasks from any email
2. Check off 2-3 tasks
3. Click "Export Tasks" button

**Expected Results:**
- [ ] Only unchecked tasks exported
- [ ] Creates tasks.txt file
- [ ] Downloads automatically
- [ ] File contains task text only

**Actual Result:** _______________

---

### Test 2D: No Clear Tasks
**Steps:**
1. Open thank-you or informational email
2. Click "Extract Action Items"

**Expected Results:**
- [ ] Creates 0-1 generic follow-up task
- [ ] No false positive tasks
- [ ] Message explains result

**Actual Result:** _______________

---

## Feature 3: Email Summarization

### Test 3A: Single Email Summary
**Steps:**
1. Open any email (medium length)
2. Click "Summary" tab
3. Click "Summarize Email" button

**Expected Results:**
- [ ] Summary generates in < 1 second
- [ ] Shows subject line
- [ ] Shows sender name
- [ ] Shows word count
- [ ] Lists attachments (if any)
- [ ] Extracts 2-4 key points

**Actual Result:** _______________

---

### Test 3B: Thread Summary
**Steps:**
1. Open email that's part of a conversation thread
2. Click "Summarize Thread" button

**Expected Results:**
- [ ] Acknowledges thread context
- [ ] Summarizes conversation flow
- [ ] Note about including previous messages
- [ ] Key points from main email

**Actual Result:** _______________

---

### Test 3C: Copy Summary
**Steps:**
1. Generate any summary
2. Click "Copy Summary" button
3. Paste into notepad

**Expected Results:**
- [ ] Success message appears
- [ ] Text copied to clipboard
- [ ] Formatting preserved
- [ ] All content included

**Actual Result:** _______________

---

## Feature 4: Meeting Detection

### Test 4A: Explicit Meeting Request
**Steps:**
1. Open email: "Let's Schedule a Strategy Session"
2. Click "Meetings" tab
3. Click "Detect Meeting Request" button

**Expected Results:**
- [ ] Meeting detected successfully
- [ ] Title field filled in
- [ ] Date/time extracted
- [ ] Duration shown
- [ ] Location/platform identified
- [ ] All fields editable

**Actual Result:** _______________

---

### Test 4B: Create Calendar Event
**Steps:**
1. Detect meeting from test 4A
2. Verify/edit meeting details
3. Click "Create Calendar Event" button

**Expected Results:**
- [ ] Outlook calendar opens
- [ ] New appointment form shown
- [ ] Title pre-filled
- [ ] Attendee added
- [ ] Location filled
- [ ] Default 30-min duration

**Actual Result:** _______________

---

### Test 4C: No Meeting Request
**Steps:**
1. Open informational/thank-you email
2. Click "Detect Meeting Request"

**Expected Results:**
- [ ] Shows "No meeting request detected"
- [ ] No meeting form displayed
- [ ] Appropriate info message

**Actual Result:** _______________

---

### Test 4D: Virtual Meeting Platform Detection
**Steps:**
1. Create test email with Zoom link
2. Detect meeting request

**Expected Results:**
- [ ] Identifies Zoom as location
- [ ] Extracts meeting link
- [ ] Handles Zoom correctly

**Repeat for:**
- [ ] Microsoft Teams link
- [ ] Google Meet link
- [ ] Physical location (e.g., "Room 302")

**Actual Result:** _______________

---

## Edge Cases & Error Handling

### Test 5A: Empty Email
**Steps:**
1. Open email with blank body
2. Try each feature (Response, Tasks, Summary, Meeting)

**Expected Results:**
- [ ] No crashes or errors
- [ ] Appropriate "no content" messages
- [ ] UI remains functional

**Actual Result:** _______________

---

### Test 5B: Very Long Email (500+ words)
**Steps:**
1. Open long email
2. Test all features

**Expected Results:**
- [ ] All features work
- [ ] No timeouts
- [ ] UI remains responsive
- [ ] Summaries condense appropriately

**Actual Result:** _______________

---

### Test 5C: Special Characters
**Steps:**
1. Open email with symbols ($, &, @, ", ')
2. Test response generation

**Expected Results:**
- [ ] Special characters preserved
- [ ] No encoding errors
- [ ] Proper text display

**Actual Result:** _______________

---

### Test 5D: Email with Only Attachments
**Steps:**
1. Open email with attachments, minimal text
2. Test all features

**Expected Results:**
- [ ] Recognizes attachments
- [ ] Mentions attachments in responses
- [ ] Creates "review attachment" tasks
- [ ] Summary shows attachment count

**Actual Result:** _______________

---

### Test 5E: Rapid Button Clicking
**Steps:**
1. Open any email
2. Rapidly click "Generate Quick Reply" 5 times
3. Switch tabs rapidly
4. Click multiple features simultaneously

**Expected Results:**
- [ ] No duplicate responses
- [ ] Loading indicators work
- [ ] No race conditions
- [ ] UI remains stable

**Actual Result:** _______________

---

## Cross-Browser Testing

### Test 6A: Outlook Desktop (Windows)
- [ ] All features work
- [ ] UI displays correctly
- [ ] Performance acceptable

### Test 6B: Outlook Desktop (Mac)
- [ ] All features work
- [ ] UI displays correctly
- [ ] Performance acceptable

### Test 6C: Outlook Web (Chrome)
- [ ] All features work
- [ ] UI displays correctly
- [ ] Performance acceptable

### Test 6D: Outlook Web (Safari)
- [ ] All features work
- [ ] UI displays correctly
- [ ] Performance acceptable

### Test 6E: Outlook Web (Firefox)
- [ ] All features work
- [ ] UI displays correctly
- [ ] Performance acceptable

---

## Performance Benchmarks

### Response Times (Record actual times)
| Feature | Target | Actual |
|---------|--------|--------|
| Quick Reply (Template) | < 1s | ___ |
| Detailed Reply (Template) | < 1s | ___ |
| Meeting Reply (Template) | < 1s | ___ |
| Task Extraction | < 0.5s | ___ |
| Email Summary | < 0.5s | ___ |
| Meeting Detection | < 0.5s | ___ |
| Calendar Event Creation | < 1s | ___ |

---

## AI Integration Testing (Future)

### Test 7A: AI Response Generation
**Steps:**
1. Ensure AI API configured
2. Generate response (should use AI)
3. Check for AI-powered insights

**Expected Results:**
- [ ] Response more context-aware
- [ ] Better tone matching
- [ ] Addresses specific points

**Actual Result:** _______________

---

### Test 7B: AI Fallback
**Steps:**
1. Disable AI API (set wrong key)
2. Generate response

**Expected Results:**
- [ ] Falls back to templates
- [ ] User notified
- [ ] Still functional

**Actual Result:** _______________

---

## Bug Tracking

### Bugs Found During Testing
| ID | Feature | Description | Severity | Status |
|----|---------|-------------|----------|--------|
| 1  |         |             |          |        |
| 2  |         |             |          |        |
| 3  |         |             |          |        |

### Critical Issues (Must Fix)
-

### High Priority Issues
-

### Medium Priority Issues
-

### Low Priority Issues / Enhancements
-

---

## Test Summary

**Date:** _______________
**Tester:** _______________
**Environment:** _______________

### Results
- **Total Tests:** ___
- **Passed:** ___
- **Failed:** ___
- **Blocked:** ___
- **Pass Rate:** ____%

### Overall Assessment
- [ ] Ready for production
- [ ] Needs minor fixes
- [ ] Needs major fixes
- [ ] Not ready

### Notes:


---

**Checklist Version:** 1.0
**Last Updated:** January 16, 2026
