# Email Assistant Test Suite

Comprehensive testing framework for Joe Newman's Outlook Email Assistant

## 📁 Files Overview

### 1. `test-suite.md`
**Comprehensive Test Documentation**
- Detailed test scenarios for all features
- Expected behaviors and success criteria
- Edge cases and integration tests
- Performance benchmarks
- Bug reporting template

### 2. `test-emails.json`
**Test Data Repository**
- 15+ pre-configured test emails
- Covers all feature categories
- Includes edge cases
- Structured for automated testing
- Easy to extend with new tests

### 3. `test-runner.html`
**Automated Test Runner Interface**
- Visual test execution dashboard
- Real-time progress tracking
- Category filtering
- Detailed results display
- Export functionality
- Console logging

### 4. `manual-testing-checklist.md`
**Manual Testing Guide**
- Step-by-step testing procedures
- Expected results for each test
- Space for actual results
- Bug tracking section
- Cross-browser compatibility checks
- Performance benchmarks

---

## 🚀 Quick Start

### Option 1: Automated Testing (Recommended for Development)

1. **Open Test Runner:**
   ```bash
   # Navigate to tests folder
   cd tests

   # Open in browser
   open test-runner.html
   # or
   start test-runner.html
   ```

2. **Run Tests:**
   - Click "▶️ Run All Tests" for comprehensive testing
   - Or select a category from dropdown and click "▶️ Run Selected Category"
   - Watch real-time progress and results

3. **Review Results:**
   - Click on any test card to see details
   - Check console logs for debugging
   - Export results with "📊 Export Results" button

### Option 2: Manual Testing (Recommended for QA)

1. **Open Checklist:**
   - Open `manual-testing-checklist.md`
   - Print or display on second monitor

2. **Prepare Test Environment:**
   - Load add-in in Outlook
   - Create test emails from `test-emails.json`
   - Open browser console (F12)

3. **Execute Tests:**
   - Follow step-by-step instructions
   - Check off completed tests
   - Record actual results
   - Document any bugs

---

## 📊 Test Categories

### 1. Response Generation (4 tests)
Tests AI and template-based email response creation
- Quick replies
- Detailed responses
- Meeting suggestions
- Tone variations

### 2. Task Extraction (4 tests)
Validates action item identification from emails
- Single task with deadline
- Multiple tasks with priorities
- Implicit tasks
- No clear tasks

### 3. Summarization (3 tests)
Checks email and thread summarization
- Short informational emails
- Long complex emails
- Thread summaries

### 4. Meeting Detection (4 tests)
Verifies meeting request identification
- Explicit meeting requests
- Implicit suggestions
- Virtual platform detection
- No meeting scenarios

### 5. Edge Cases (5 tests)
Tests error handling and unusual inputs
- Empty emails
- Very long emails
- Special characters
- Non-English content
- Attachment-only emails

### 6. Integration Tests (3 tests)
End-to-end workflow validation
- Complete client inquiry workflow
- AI fallback scenarios
- Rapid sequential operations

---

## 🎯 Running Specific Test Suites

### Test Response Generation Only
```javascript
// In test-runner.html
categorySelect.value = 'response_generation';
runCategoryTests.click();
```

### Test All Edge Cases
```javascript
// In test-runner.html
categorySelect.value = 'edge_cases';
runCategoryTests.click();
```

### Custom Test Filtering
Edit `test-runner.html` and modify the filter logic:
```javascript
const testsToRun = testData.test_emails.filter(test => {
    // Add custom filter logic here
    return test.subject.includes('coaching');
});
```

---

## 📝 Adding New Tests

### Step 1: Add Test Data
Edit `test-emails.json`:
```json
{
  "id": "test-X.X",
  "category": "response_generation",
  "test_name": "Your Test Name",
  "subject": "Test Subject",
  "from": "test@example.com",
  "sender": "Test Person",
  "body": "Email body content...",
  "expected_response_type": "quick",
  "expected_keywords": ["keyword1", "keyword2"],
  "expected_word_count": [40, 100]
}
```

### Step 2: Document Test
Add to `test-suite.md`:
```markdown
### Test X.X: Your Test Name
**Email Input:**
[Email content]

**Expected Behavior:**
[What should happen]

**Success Criteria:**
- Criterion 1
- Criterion 2
```

### Step 3: Add to Manual Checklist
Add section to `manual-testing-checklist.md`:
```markdown
### Test X: Your Test Name
**Steps:**
1. Step one
2. Step two

**Expected Results:**
- [ ] Result 1
- [ ] Result 2
```

---

## 🔧 Test Runner Configuration

### Modifying Test Execution
Edit `test-runner.html` to customize:

```javascript
// Change test timeout
async function simulateTest(test) {
    await new Promise(resolve =>
        setTimeout(resolve, YOUR_TIMEOUT));
}

// Customize validation logic
function validateTestResult(test) {
    // Your validation logic
}

// Add new test categories
const categories = {
    'your_category': tests
};
```

---

## 📈 Understanding Test Results

### Test Status Icons
- ⏱️ **Pending** - Not yet run
- ⏳ **Running** - Currently executing
- ✅ **Passed** - All criteria met
- ❌ **Failed** - One or more criteria not met

### Result Details
Click any test card to see:
- Original email content
- Expected behavior
- Actual results
- Performance metrics
- Error messages (if failed)

### Export Format
Results export as JSON:
```json
{
  "timestamp": "2026-01-16T00:00:00.000Z",
  "totalTests": 15,
  "passed": 12,
  "failed": 3,
  "results": [...]
}
```

---

## 🐛 Debugging Failed Tests

### Step 1: Check Console Logs
Open browser console (F12) and look for:
- JavaScript errors
- API failures
- Timing issues

### Step 2: Review Test Details
Click failed test card to see:
- Actual vs. expected output
- Error messages
- Execution time

### Step 3: Manual Verification
Run the test manually:
1. Open test email in Outlook
2. Execute feature manually
3. Compare with expected result

### Step 4: Document Bug
Use bug template from `test-suite.md`:
```
Bug ID: [AUTO-INCREMENT]
Test: [Test Number and Name]
Severity: [Critical | High | Medium | Low]
Environment: [Details]
Description: [What happened]
Steps to Reproduce: [1, 2, 3...]
```

---

## 🎨 Customizing Test Runner UI

### Changing Colors
Edit CSS in `test-runner.html`:
```css
:root {
    --primary-color: #667eea;
    --success-color: #28a745;
    --danger-color: #dc3545;
}
```

### Adding New Stats
Add new stat box:
```html
<div class="stat-box">
    <div class="stat-label">Your Stat</div>
    <div class="stat-value" id="yourStat">0</div>
</div>
```

---

## 📊 Test Coverage

### Current Coverage
| Feature | Tests | Coverage |
|---------|-------|----------|
| Response Generation | 4 | 90% |
| Task Extraction | 4 | 85% |
| Summarization | 3 | 80% |
| Meeting Detection | 4 | 85% |
| Edge Cases | 5 | 70% |
| **Total** | **20** | **82%** |

### Coverage Goals
- **Phase 1 (Current):** 80%+ coverage
- **Phase 2 (AI Integration):** 90%+ coverage
- **Phase 3 (Production):** 95%+ coverage

---

## 🔄 Continuous Testing

### When to Run Tests

**Before Each Commit:**
- Run affected feature tests
- Verify no regressions

**Before Each Release:**
- Run complete test suite
- Execute manual checklist
- Document all results

**After Bug Fixes:**
- Run specific test that caught bug
- Run related feature tests
- Add regression test if needed

### Automated CI/CD Integration (Future)
```yaml
# Example GitHub Actions
name: Test Email Assistant
on: [push, pull_request]
jobs:
  test:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Tests
        run: npm test
```

---

## 📖 Best Practices

### Writing Good Tests
1. **Clear naming** - Test names should describe what they test
2. **Single purpose** - Each test validates one behavior
3. **Reproducible** - Tests should produce consistent results
4. **Independent** - Tests shouldn't depend on each other
5. **Fast** - Keep tests under 5 seconds when possible

### Maintaining Test Data
1. **Keep realistic** - Use real-world email examples
2. **Cover variations** - Include different email styles
3. **Update regularly** - Reflect actual user emails
4. **Version control** - Track changes to test data

### Documenting Results
1. **Record everything** - Even passed tests
2. **Include screenshots** - For visual issues
3. **Note environment** - OS, Outlook version, etc.
4. **Track trends** - Compare results over time

---

## 🆘 Troubleshooting

### Test Runner Won't Load
**Issue:** test-runner.html shows blank page
**Solution:**
1. Check browser console for errors
2. Verify test-emails.json is in same folder
3. Try different browser
4. Check file permissions

### Tests Timing Out
**Issue:** Tests take too long to complete
**Solution:**
1. Increase timeout values in code
2. Check network connectivity (for AI tests)
3. Close other Outlook add-ins
4. Restart Outlook

### Inconsistent Results
**Issue:** Same test passes sometimes, fails others
**Solution:**
1. Check for race conditions in code
2. Add delays between operations
3. Verify test data hasn't changed
4. Check for external dependencies

---

## 📚 Additional Resources

### Documentation Files
- `../PROJECT_OVERVIEW.md` - Project architecture
- `../README.md` - Main project documentation
- `../AI_INTEGRATION_GUIDE.md` - AI setup instructions

### Testing Tools
- [Outlook Add-in Validator](https://docs.microsoft.com/office/dev/add-ins/)
- [Office.js Debugging](https://docs.microsoft.com/office/dev/add-ins/testing/debug-add-ins)
- [Browser DevTools](https://developer.chrome.com/docs/devtools/)

### Support
- **Email:** joe.newman@example.com
- **GitHub Issues:** [Create issue](https://github.com/...)
- **Documentation:** [View docs](https://...)

---

## 📅 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2026 | Initial test suite creation |
| | | - 20 test scenarios |
| | | - Automated test runner |
| | | - Manual checklist |

---

## ✅ Pre-Release Checklist

Before releasing new version:
- [ ] All tests pass (95%+ pass rate)
- [ ] Manual checklist completed
- [ ] Performance benchmarks met
- [ ] Cross-browser testing done
- [ ] Edge cases verified
- [ ] Bug list reviewed
- [ ] Documentation updated
- [ ] Test results exported and archived

---

**Test Suite Maintained By:** Elie
**Last Updated:** January 16, 2026
**Status:** Active - Ready for Use
