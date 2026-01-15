#!/bin/bash

echo "🤖 AI Integration Setup for Joe's Email Assistant"
echo "=================================================="
echo ""
echo "This script will help you add AI to your Outlook add-in."
echo ""

# Check if user wants OpenAI or Anthropic
echo "Which AI provider would you like to use?"
echo "1) OpenAI (GPT-4)"
echo "2) Anthropic (Claude)"
read -p "Enter your choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "Setting up OpenAI..."
    echo ""
    echo "Please enter your OpenAI API key (starts with sk-):"
    npx vercel env add OPENAI_API_KEY
    
    echo ""
    echo "Setting AI provider to 'openai'..."
    echo "openai" | npx vercel env add AI_PROVIDER
    
    echo ""
    echo "✅ OpenAI configured!"
    
elif [ "$choice" = "2" ]; then
    echo ""
    echo "Setting up Anthropic Claude..."
    echo ""
    echo "Please enter your Anthropic API key (starts with sk-ant-):"
    npx vercel env add ANTHROPIC_API_KEY
    
    echo ""
    echo "Setting AI provider to 'anthropic'..."
    echo "anthropic" | npx vercel env add AI_PROVIDER
    
    echo ""
    echo "✅ Anthropic Claude configured!"
else
    echo "Invalid choice. Exiting."
    exit 1
fi

echo ""
echo "🚀 Deploying AI-enabled version..."
npx vercel --prod

echo ""
echo "✅ AI Integration Complete!"
echo ""
echo "Test it now:"
echo "1. Open Outlook"
echo "2. Open any email"
echo "3. Click 'Joe's Email Assistant'"
echo "4. Click 'Quick Reply' or 'Detailed Response'"
echo "5. Watch AI generate a personalized response!"
echo ""
echo "💰 Cost: ~$0.01-0.03 per email"
echo "📊 Monitor usage in your AI provider dashboard"
echo ""
