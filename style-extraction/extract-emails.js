#!/usr/bin/env node

/**
 * Email Extraction from Microsoft Graph API
 *
 * Extracts sent emails from Joe's Outlook account using Microsoft Graph API.
 * Filters by date range and saves to JSON for processing.
 *
 * Usage:
 *   node extract-emails.js --months 6
 *   node extract-emails.js --months 3 --limit 50
 *   node extract-emails.js --output custom-output.json
 */

require('dotenv').config();
const { Client } = require('@microsoft/microsoft-graph-client');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
    .option('months', {
        alias: 'm',
        type: 'number',
        description: 'Number of months to look back',
        default: parseInt(process.env.DEFAULT_MONTHS_BACK) || 6,
    })
    .option('limit', {
        alias: 'l',
        type: 'number',
        description: 'Maximum number of emails to extract',
        default: parseInt(process.env.DEFAULT_MAX_EMAILS) || 1000,
    })
    .option('output', {
        alias: 'o',
        type: 'string',
        description: 'Output file path',
        default: 'output/raw-emails.json',
    })
    .help()
    .argv;

// Load access token
function loadToken() {
    if (!fs.existsSync('.token.json')) {
        console.error('❌ No authentication token found');
        console.error('📝 Please run: node auth.js\n');
        process.exit(1);
    }

    const tokenData = JSON.parse(fs.readFileSync('.token.json', 'utf8'));

    // Check if token is expired
    const expiresOn = new Date(tokenData.expiresOn);
    if (expiresOn < new Date()) {
        console.error('❌ Access token has expired');
        console.error('📝 Please re-authenticate: node auth.js\n');
        process.exit(1);
    }

    return tokenData.accessToken;
}

// Create Graph API client
function createClient(accessToken) {
    return Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        },
    });
}

// Calculate date range
function getDateRange(monthsBack) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);

    return {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        startFormatted: startDate.toLocaleDateString(),
        endFormatted: endDate.toLocaleDateString(),
    };
}

// Extract emails from Sent Items
async function extractEmails(client, options) {
    const { months, limit } = options;
    const dateRange = getDateRange(months);

    console.log(`📧 Extracting emails from Microsoft Graph API...`);
    console.log(`📅 Date range: ${dateRange.startFormatted} to ${dateRange.endFormatted}`);
    console.log(`🔍 Looking back: ${months} months`);
    console.log(`📊 Limit: ${limit === 1000 ? 'No limit' : limit} emails\n`);

    try {
        // Get Sent Items folder
        console.log('🔍 Searching Sent Items folder...');

        // Query for sent emails
        const filterQuery = `sentDateTime ge ${dateRange.start} and sentDateTime le ${dateRange.end}`;

        let allMessages = [];
        let nextLink = null;
        let requestCount = 0;

        do {
            requestCount++;
            console.log(`📥 Fetching batch ${requestCount}...`);

            let request = client
                .api('/me/mailFolders/SentItems/messages')
                .top(100) // Max per request
                .select('subject,sentDateTime,body,from,toRecipients,importance')
                .orderby('sentDateTime desc');

            if (!nextLink) {
                request = request.filter(filterQuery);
            }

            const response = nextLink
                ? await client.api(nextLink).get()
                : await request.get();

            const messages = response.value || [];
            allMessages = allMessages.concat(messages);

            console.log(`   Found ${messages.length} emails in this batch (total: ${allMessages.length})`);

            nextLink = response['@odata.nextLink'];

            // Stop if we've reached the limit
            if (allMessages.length >= limit) {
                allMessages = allMessages.slice(0, limit);
                break;
            }

        } while (nextLink);

        console.log(`\n✅ Extracted ${allMessages.length} emails`);

        // Process and format emails
        const processedEmails = allMessages.map((email, index) => ({
            id: index + 1,
            subject: email.subject || '(no subject)',
            sentDate: email.sentDateTime,
            body: email.body.content,
            bodyType: email.body.contentType, // Text or HTML
            from: email.from?.emailAddress?.address || 'unknown',
            toRecipients: (email.toRecipients || []).map(r => r.emailAddress.address),
            importance: email.importance || 'normal',
            wordCount: countWords(email.body.content),
        }));

        return processedEmails;

    } catch (error) {
        console.error('❌ Error extracting emails:', error.message);

        if (error.statusCode === 401) {
            console.error('\n📝 Authentication error. Please re-authenticate:');
            console.error('   node auth.js\n');
        } else if (error.statusCode === 403) {
            console.error('\n📝 Permission error. Please check:');
            console.error('   1. API permissions in Azure portal');
            console.error('   2. Admin consent granted');
            console.error('   3. User has access to mailbox\n');
        }

        throw error;
    }
}

// Count words in text
function countWords(text) {
    if (!text) return 0;
    // Remove HTML tags and count words
    const plainText = text.replace(/<[^>]*>/g, ' ');
    return plainText.trim().split(/\s+/).length;
}

// Save emails to file
function saveEmails(emails, outputPath) {
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create output object with metadata
    const output = {
        extractedAt: new Date().toISOString(),
        totalEmails: emails.length,
        dateRange: {
            oldest: emails[emails.length - 1]?.sentDate,
            newest: emails[0]?.sentDate,
        },
        emails: emails,
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`💾 Saved to ${outputPath}`);

    // Print summary
    console.log('\n📊 Summary:');
    console.log(`   Total emails: ${emails.length}`);
    console.log(`   Average length: ${Math.round(emails.reduce((sum, e) => sum + e.wordCount, 0) / emails.length)} words`);
    console.log(`   Date range: ${output.dateRange.oldest?.split('T')[0]} to ${output.dateRange.newest?.split('T')[0]}`);
}

// Main function
async function main() {
    try {
        console.log('🚀 Email Style Extractor\n');
        console.log('═'.repeat(50) + '\n');

        // Load authentication token
        const accessToken = loadToken();
        console.log('✅ Authentication token loaded\n');

        // Create Graph API client
        const client = createClient(accessToken);

        // Extract emails
        const emails = await extractEmails(client, {
            months: argv.months,
            limit: argv.limit,
        });

        // Save to file
        saveEmails(emails, argv.output);

        console.log('\n🎉 Extraction complete!');
        console.log('\n📝 Next steps:');
        console.log('   1. Review output file to verify contents');
        console.log('   2. Run: python3 process-emails.py');
        console.log('   3. Run: python3 analyze-style.py\n');

    } catch (error) {
        console.error('\n❌ Extraction failed:', error.message);
        process.exit(1);
    }
}

// Run
main();
