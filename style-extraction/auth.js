#!/usr/bin/env node

/**
 * Microsoft Graph API Authentication
 *
 * This script handles OAuth 2.0 authentication with Microsoft Graph API
 * using the Authorization Code Flow with PKCE.
 *
 * Usage: node auth.js
 *
 * Output: Saves access token to .token.json
 */

require('dotenv').config();
const msal = require('@azure/msal-node');
const http = require('http');
const url = require('url');
const fs = require('fs');
const { exec } = require('child_process');

// Configuration from environment variables
const config = {
    auth: {
        clientId: process.env.CLIENT_ID,
        authority: `${process.env.AUTHORITY || 'https://login.microsoftonline.com'}/${process.env.TENANT_ID}`,
        clientSecret: process.env.CLIENT_SECRET,
    },
};

const redirectUri = process.env.REDIRECT_URI || 'http://localhost:3000/auth/callback';
const scopes = ['User.Read', 'Mail.Read'];

// Validate configuration
function validateConfig() {
    const required = ['CLIENT_ID', 'CLIENT_SECRET', 'TENANT_ID'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.error('❌ Error: Missing required environment variables:');
        missing.forEach(key => console.error(`   - ${key}`));
        console.error('\n📝 Please copy .env.example to .env and fill in your Azure credentials');
        process.exit(1);
    }
}

// Create MSAL application
const pca = new msal.ConfidentialClientApplication(config);

// Generate authorization URL
function getAuthCodeUrl() {
    const authCodeUrlParameters = {
        scopes: scopes,
        redirectUri: redirectUri,
    };

    return pca.getAuthCodeUrl(authCodeUrlParameters);
}

// Exchange authorization code for token
async function getTokenFromCode(authCode) {
    const tokenRequest = {
        code: authCode,
        scopes: scopes,
        redirectUri: redirectUri,
    };

    try {
        const response = await pca.acquireTokenByCode(tokenRequest);
        return response;
    } catch (error) {
        console.error('❌ Token acquisition failed:', error.message);
        throw error;
    }
}

// Save token to file
function saveToken(tokenResponse) {
    const tokenData = {
        accessToken: tokenResponse.accessToken,
        expiresOn: tokenResponse.expiresOn,
        account: tokenResponse.account,
        scopes: tokenResponse.scopes,
        tokenType: tokenResponse.tokenType,
    };

    fs.writeFileSync('.token.json', JSON.stringify(tokenData, null, 2));
    console.log('✅ Access token saved to .token.json');
}

// Open URL in default browser
function openBrowser(authUrl) {
    const platform = process.platform;
    let command;

    if (platform === 'darwin') {
        command = `open "${authUrl}"`;
    } else if (platform === 'win32') {
        command = `start "${authUrl}"`;
    } else {
        command = `xdg-open "${authUrl}"`;
    }

    exec(command, (error) => {
        if (error) {
            console.error('❌ Could not open browser automatically');
            console.log('\n🌐 Please open this URL manually:');
            console.log(authUrl);
        }
    });
}

// Start local server to receive callback
function startCallbackServer() {
    return new Promise((resolve, reject) => {
        const server = http.createServer(async (req, res) => {
            const queryObject = url.parse(req.url, true).query;

            if (queryObject.code) {
                // Success - got authorization code
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <head><title>Authentication Successful</title></head>
                        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                            <h1 style="color: #4CAF50;">✅ Authentication Successful!</h1>
                            <p>You can close this window and return to the terminal.</p>
                        </body>
                    </html>
                `);

                server.close();
                resolve(queryObject.code);
            } else if (queryObject.error) {
                // Error from authorization server
                res.writeHead(400, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <head><title>Authentication Failed</title></head>
                        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                            <h1 style="color: #f44336;">❌ Authentication Failed</h1>
                            <p>Error: ${queryObject.error}</p>
                            <p>Description: ${queryObject.error_description || 'Unknown error'}</p>
                            <p>Please check your configuration and try again.</p>
                        </body>
                    </html>
                `);

                server.close();
                reject(new Error(`${queryObject.error}: ${queryObject.error_description}`));
            }
        });

        server.listen(3000, () => {
            console.log('🌐 Callback server running on http://localhost:3000');
        });

        // Timeout after 5 minutes
        setTimeout(() => {
            server.close();
            reject(new Error('Authentication timeout - no response received'));
        }, 5 * 60 * 1000);
    });
}

// Main authentication flow
async function authenticate() {
    console.log('🔐 Starting Microsoft Graph authentication...\n');

    // Validate configuration
    validateConfig();

    try {
        // Generate authorization URL
        const authUrl = await getAuthCodeUrl();

        console.log('🌐 Opening browser for sign-in...');
        console.log('📝 Please sign in with Joe\'s Microsoft 365 account\n');

        // Start callback server
        const authCodePromise = startCallbackServer();

        // Open browser
        openBrowser(authUrl);

        // Wait for authorization code
        console.log('⏳ Waiting for authentication...\n');
        const authCode = await authCodePromise;

        console.log('✅ Authorization code received');

        // Exchange code for token
        console.log('🔄 Acquiring access token...');
        const tokenResponse = await getTokenFromCode(authCode);

        console.log('✅ Authentication successful!');
        console.log(`👤 Signed in as: ${tokenResponse.account.username}`);

        // Save token
        saveToken(tokenResponse);

        console.log('\n🎉 Setup complete! You can now run:');
        console.log('   node extract-emails.js\n');

    } catch (error) {
        console.error('\n❌ Authentication failed:', error.message);
        console.error('\n📝 Troubleshooting:');
        console.error('   1. Check your .env file has correct credentials');
        console.error('   2. Verify redirect URI matches Azure portal');
        console.error('   3. Ensure API permissions are granted in Azure');
        console.error('   4. Check that admin consent was provided\n');
        process.exit(1);
    }
}

// Check if token already exists
if (fs.existsSync('.token.json')) {
    console.log('⚠️  Existing token found in .token.json');
    console.log('This will overwrite the existing token.');
    console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');

    setTimeout(() => {
        authenticate();
    }, 3000);
} else {
    authenticate();
}
