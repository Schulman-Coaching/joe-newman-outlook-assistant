/* global Office */

let currentEmailContent = '';
let currentEmailSubject = '';
let currentSender = '';

Office.onReady((info) => {
    if (info.host === Office.HostType.Outlook) {
        initializeAddin();
    }
});

function initializeAddin() {
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });
    
    // Responses tab
    document.getElementById('generate-quick-reply').addEventListener('click', () => generateResponse('quick'));
    document.getElementById('generate-detailed-reply').addEventListener('click', () => generateResponse('detailed'));
    document.getElementById('generate-meeting-response').addEventListener('click', () => generateResponse('meeting'));
    document.getElementById('regenerate-response').addEventListener('click', () => regenerateResponse());
    document.getElementById('insert-response').addEventListener('click', insertResponse);
    
    // Tasks tab
    document.getElementById('extract-tasks').addEventListener('click', extractTasks);
    
    // Summary tab
    document.getElementById('summarize-email').addEventListener('click', () => summarizeContent('email'));
    document.getElementById('summarize-thread').addEventListener('click', () => summarizeContent('thread'));
    
    // Meetings tab
    document.getElementById('detect-meeting-request').addEventListener('click', detectMeetingRequest);
    
    // Load current email
    loadEmailContent();
}

function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName + '-tab').classList.add('active');
}

function loadEmailContent() {
    Office.context.mailbox.item.body.getAsync(
        Office.CoercionType.Text,
        (result) => {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                currentEmailContent = result.value;
            }
        }
    );
    
    Office.context.mailbox.item.subject.getAsync((result) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
            currentEmailSubject = result.value;
        }
    });
    
    const sender = Office.context.mailbox.item.from;
    if (sender) {
        currentSender = sender.displayName || sender.emailAddress;
    }
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = 'status ' + type;
    setTimeout(() => {
        status.textContent = '';
        status.className = 'status';
    }, 5000);
}

// Response Generation
async function generateResponse(responseType) {
    showLoading(true);
    
    try {
        const response = await analyzeAndGenerateResponse(currentEmailContent, currentEmailSubject, responseType);
        
        document.getElementById('response-text').value = response;
        document.getElementById('response-output').style.display = 'block';
        showStatus('Response generated successfully!', 'success');
    } catch (error) {
        showStatus('Error generating response: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function analyzeAndGenerateResponse(emailContent, subject, type) {
    const tone = document.getElementById('tone-selector').value;
    let response = '';
    
    if (type === 'quick') {
        response = 'Hi ' + currentSender + ',\n\nThank you for your email regarding "' + subject + '".\n\n';
        
        if (emailContent.toLowerCase().includes('question')) {
            response += 'I have received your questions and will review them carefully. I will get back to you with detailed answers shortly.\n\n';
        } else if (emailContent.toLowerCase().includes('meeting')) {
            response += 'I have noted your meeting request. Let me check my calendar and I will propose some times that work.\n\n';
        } else {
            response += 'I have reviewed your message and will respond with more details soon.\n\n';
        }
        
        response += 'Best regards,\nJoe Newman';
    } else if (type === 'detailed') {
        response = 'Dear ' + currentSender + ',\n\nThank you for reaching out regarding "' + subject + '".\n\n';
        response += 'I appreciate you taking the time to share this information. Based on your message, here are my thoughts:\n\n';
        response += '1. [Point addressing main concern]\n';
        response += '2. [Additional relevant information]\n';
        response += '3. [Next steps or action items]\n\n';
        response += 'Please let me know if you need any clarification or have additional questions.\n\n';
        response += 'Best regards,\nJoe Newman';
    } else if (type === 'meeting') {
        response = 'Hi ' + currentSender + ',\n\nThank you for your email about "' + subject + '".\n\n';
        response += 'I think a meeting would be beneficial to discuss this further. I have availability:\n\n';
        response += '- [Option 1: Date/Time]\n';
        response += '- [Option 2: Date/Time]\n';
        response += '- [Option 3: Date/Time]\n\n';
        response += 'Please let me know which time works best for you, or suggest an alternative.\n\n';
        response += 'Best regards,\nJoe Newman';
    }
    
    return applyTone(response, tone);
}

function applyTone(text, tone) {
    switch(tone) {
        case 'friendly':
            return text.replace(/Dear/g, 'Hi').replace(/Best regards/g, 'Cheers');
        case 'formal':
            return text.replace(/Hi/g, 'Dear').replace(/Cheers/g, 'Sincerely');
        case 'casual':
            return text.replace(/Dear/g, 'Hey').replace(/Best regards/g, 'Thanks');
        default:
            return text;
    }
}

function regenerateResponse() {
    const responseOutputVisible = document.getElementById('response-output').style.display !== 'none';
    if (responseOutputVisible) {
        generateResponse('quick');
    }
}

function insertResponse() {
    const responseText = document.getElementById('response-text').value;
    
    Office.context.mailbox.item.displayReplyAllForm({
        htmlBody: responseText.replace(/\n/g, '<br>')
    });
    
    showStatus('Response inserted into new reply!', 'success');
}

// Task Extraction
async function extractTasks() {
    showLoading(true);
    
    try {
        const tasks = await analyzeEmailForTasks(currentEmailContent, currentEmailSubject);
        
        const tasksList = document.getElementById('tasks-list');
        tasksList.innerHTML = '';
        
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            const dueDateHtml = task.dueDate ? '<div style="font-size: 12px; color: #666;">Due: ' + task.dueDate + '</div>' : '';
            
            li.innerHTML = '<div class="task-item">' +
                '<input type="checkbox" class="task-checkbox" id="task-' + index + '">' +
                '<div class="task-text">' +
                '<label for="task-' + index + '">' + task.text + '</label>' +
                dueDateHtml +
                '</div>' +
                '<span class="task-priority priority-' + task.priority + '">' + task.priority.toUpperCase() + '</span>' +
                '</div>';
            tasksList.appendChild(li);
        });
        
        document.getElementById('tasks-output').style.display = 'block';
        
        const exportBtn = document.getElementById('export-tasks');
        if (exportBtn && !exportBtn.hasListener) {
            exportBtn.addEventListener('click', exportTasks);
            exportBtn.hasListener = true;
        }
        
        showStatus('Found ' + tasks.length + ' action item(s)!', 'success');
    } catch (error) {
        showStatus('Error extracting tasks: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function analyzeEmailForTasks(content, subject) {
    const tasks = [];
    const actionWords = ['need to', 'please', 'can you', 'would you', 'could you', 'review', 'complete', 'send', 'prepare', 'schedule'];
    const lines = content.split('\n');
    
    lines.forEach(line => {
        const lowerLine = line.toLowerCase();
        if (actionWords.some(word => lowerLine.includes(word))) {
            let priority = 'medium';
            if (lowerLine.includes('urgent') || lowerLine.includes('asap')) {
                priority = 'high';
            } else if (lowerLine.includes('when you can') || lowerLine.includes('no rush')) {
                priority = 'low';
            }
            
            tasks.push({
                text: line.trim(),
                priority: priority,
                dueDate: extractDueDate(line)
            });
        }
    });
    
    if (tasks.length === 0) {
        tasks.push({
            text: 'Follow up on: ' + subject,
            priority: 'medium',
            dueDate: null
        });
    }
    
    return tasks.slice(0, 10);
}

function extractDueDate(text) {
    const datePatterns = [
        /by\s+(\w+\s+\d{1,2})/i,
        /due\s+(\w+\s+\d{1,2})/i,
        /(\d{1,2}\/\d{1,2}\/\d{2,4})/
    ];
    
    for (let i = 0; i < datePatterns.length; i++) {
        const match = text.match(datePatterns[i]);
        if (match) {
            return match[1];
        }
    }
    return null;
}

function exportTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const label = item.querySelector('label');
        if (!checkbox.checked) {
            tasks.push(label.textContent);
        }
    });
    
    const taskText = tasks.join('\n');
    const blob = new Blob([taskText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.txt';
    a.click();
    
    showStatus('Tasks exported successfully!', 'success');
}

// Summarization
async function summarizeContent(type) {
    showLoading(true);
    
    try {
        const summary = await generateSummary(currentEmailContent, currentEmailSubject, type === 'thread');
        
        document.getElementById('summary-text').innerHTML = summary;
        document.getElementById('summary-output').style.display = 'block';
        
        const copyBtn = document.getElementById('copy-summary');
        if (copyBtn && !copyBtn.hasListener) {
            copyBtn.addEventListener('click', copySummary);
            copyBtn.hasListener = true;
        }
        
        showStatus('Summary generated!', 'success');
    } catch (error) {
        showStatus('Error generating summary: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function generateSummary(content, subject, isThread) {
    const wordCount = content.split(' ').length;
    const hasAttachments = Office.context.mailbox.item.attachments.length > 0;
    
    let summary = '<p><strong>Subject:</strong> ' + subject + '</p>';
    summary += '<p><strong>From:</strong> ' + currentSender + '</p>';
    summary += '<p><strong>Length:</strong> ' + wordCount + ' words</p>';
    
    if (hasAttachments) {
        summary += '<p><strong>Attachments:</strong> ' + Office.context.mailbox.item.attachments.length + ' file(s)</p>';
    }
    
    summary += '<p><strong>Key Points:</strong></p><ul>';
    
    const sentences = content.split('.').filter(s => s.trim().length > 20);
    const keyPoints = sentences.slice(0, 3);
    
    keyPoints.forEach(point => {
        summary += '<li>' + point.trim() + '.</li>';
    });
    
    summary += '</ul>';
    
    if (isThread) {
        summary += '<p><em>Note: Thread analysis would include previous messages in the conversation.</em></p>';
    }
    
    return summary;
}

function copySummary() {
    const summaryText = document.getElementById('summary-text').innerText;
    navigator.clipboard.writeText(summaryText).then(() => {
        showStatus('Summary copied to clipboard!', 'success');
    });
}

// Meeting Detection
async function detectMeetingRequest() {
    showLoading(true);
    
    try {
        const meetingInfo = await analyzeMeetingRequest(currentEmailContent, currentEmailSubject);
        
        if (meetingInfo.isMeetingRequest) {
            let html = '';
            html += '<div class="meeting-field"><label>Title:</label><input type="text" id="meeting-title" value="' + meetingInfo.title + '"></div>';
            html += '<div class="meeting-field"><label>Proposed Date/Time:</label><input type="text" id="meeting-datetime" value="' + meetingInfo.dateTime + '"></div>';
            html += '<div class="meeting-field"><label>Duration:</label><input type="text" id="meeting-duration" value="' + meetingInfo.duration + '"></div>';
            html += '<div class="meeting-field"><label>Attendees:</label><input type="text" id="meeting-attendees" value="' + meetingInfo.attendees + '"></div>';
            html += '<div class="meeting-field"><label>Location/Link:</label><input type="text" id="meeting-location" value="' + meetingInfo.location + '"></div>';
            
            document.getElementById('meeting-details').innerHTML = html;
            document.getElementById('meeting-output').style.display = 'block';
            
            const createBtn = document.getElementById('create-calendar-event');
            if (createBtn && !createBtn.hasListener) {
                createBtn.addEventListener('click', createCalendarEvent);
                createBtn.hasListener = true;
            }
            
            showStatus('Meeting request detected!', 'success');
        } else {
            showStatus('No meeting request detected in this email.', 'info');
        }
    } catch (error) {
        showStatus('Error detecting meeting: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function analyzeMeetingRequest(content, subject) {
    const lowerContent = content.toLowerCase();
    const lowerSubject = subject.toLowerCase();
    
    const meetingKeywords = ['meeting', 'call', 'discussion', 'sync', 'catch up', 'chat', 'conference'];
    const isMeetingRequest = meetingKeywords.some(keyword => 
        lowerContent.includes(keyword) || lowerSubject.includes(keyword)
    );
    
    if (!isMeetingRequest) {
        return { isMeetingRequest: false };
    }
    
    return {
        isMeetingRequest: true,
        title: subject.includes('RE:') ? subject.replace('RE:', '').trim() : subject,
        dateTime: extractDateTime(content) || 'To be determined',
        duration: extractDuration(content) || '30 minutes',
        attendees: currentSender,
        location: extractLocation(content) || 'To be determined'
    };
}

function extractDateTime(text) {
    const patterns = [
        /(\w+day,?\s+\w+\s+\d{1,2}(?:st|nd|rd|th)?\s+at\s+\d{1,2}:\d{2}\s*(?:AM|PM)?)/i,
        /(\w+\s+\d{1,2}(?:st|nd|rd|th)?\s+at\s+\d{1,2}:\d{2}\s*(?:AM|PM)?)/i,
        /(\d{1,2}\/\d{1,2}\/\d{2,4}\s+at\s+\d{1,2}:\d{2}\s*(?:AM|PM)?)/i
    ];
    
    for (let i = 0; i < patterns.length; i++) {
        const match = text.match(patterns[i]);
        if (match) return match[1];
    }
    return null;
}

function extractDuration(text) {
    const match = text.match(/(\d+)\s*(?:minute|min|hour|hr)/i);
    return match ? match[0] : null;
}

function extractLocation(text) {
    if (text.includes('zoom') || text.includes('zoom.us')) return 'Zoom';
    if (text.includes('teams') || text.includes('microsoft teams')) return 'Microsoft Teams';
    if (text.includes('meet.google') || text.includes('google meet')) return 'Google Meet';
    if (text.includes('webex')) return 'Webex';
    
    const roomMatch = text.match(/(?:room|conference room|office)\s+(\w+|\d+)/i);
    if (roomMatch) return roomMatch[0];
    
    return null;
}

function createCalendarEvent() {
    const title = document.getElementById('meeting-title').value;
    const location = document.getElementById('meeting-location').value;
    const attendees = document.getElementById('meeting-attendees').value;
    
    Office.context.mailbox.displayNewAppointmentForm({
        subject: title,
        body: 'Meeting regarding: ' + currentEmailSubject + '\n\nOrganized based on email from ' + currentSender,
        requiredAttendees: [attendees],
        location: location,
        start: new Date(),
        end: new Date(Date.now() + 30 * 60000)
    });
    
    showStatus('Opening calendar to create event...', 'success');
}
