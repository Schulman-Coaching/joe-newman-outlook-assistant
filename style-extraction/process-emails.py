#!/usr/bin/env python3

"""
Email Processing and Anonymization

Processes raw emails extracted from Microsoft Graph API:
1. Removes quoted text (replies)
2. Removes signatures
3. Anonymizes customer information
4. Removes sensitive data
5. Extracts only Joe's original writing

Usage: python3 process-emails.py
"""

import json
import re
import os
from datetime import datetime
from typing import Dict, List, Any

# Regular expressions for anonymization
PATTERNS = {
    'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
    'phone': r'\b(?:\+?1[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}\b',
    'ssn': r'\b\d{3}-\d{2}-\d{4}\b',
    'account_number': r'\b[Aa]ccount\s*#?\s*:?\s*\d{4,}\b',
    'currency': r'\$\s*\d+(?:,\d{3})*(?:\.\d{2})?',
    'credit_card': r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',
    'address': r'\b\d+\s+[\w\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way)\b',
}

# Replacements
REPLACEMENTS = {
    'email': '[email removed]',
    'phone': '[phone removed]',
    'ssn': '[SSN removed]',
    'account_number': '[account removed]',
    'currency': '$[amount]',
    'credit_card': '[card number removed]',
    'address': '[address removed]',
}

class EmailProcessor:
    def __init__(self, input_file='output/raw-emails.json', output_file='output/cleaned-emails.json'):
        self.input_file = input_file
        self.output_file = output_file
        self.stats = {
            'total_processed': 0,
            'anonymization_counts': {key: 0 for key in PATTERNS.keys()},
            'quoted_text_removed': 0,
            'empty_after_cleaning': 0,
        }

    def load_emails(self) -> Dict[str, Any]:
        """Load emails from JSON file."""
        if not os.path.exists(self.input_file):
            raise FileNotFoundError(f"Input file not found: {self.input_file}")

        with open(self.input_file, 'r', encoding='utf-8') as f:
            return json.load(f)

    def remove_html_tags(self, text: str) -> str:
        """Remove HTML tags and decode entities."""
        if not text:
            return ""

        # Remove HTML tags
        text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL | re.IGNORECASE)
        text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.DOTALL | re.IGNORECASE)
        text = re.sub(r'<[^>]+>', ' ', text)

        # Decode common HTML entities
        text = text.replace('&nbsp;', ' ')
        text = text.replace('&amp;', '&')
        text = text.replace('&lt;', '<')
        text = text.replace('&gt;', '>')
        text = text.replace('&quot;', '"')
        text = text.replace('&#39;', "'")

        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text)

        return text.strip()

    def remove_quoted_text(self, text: str) -> str:
        """Remove quoted replies from email body."""
        # Common quote patterns
        quote_patterns = [
            r'On .+ wrote:.*$',  # "On Mon, Jan 1, 2024 at 10:00 AM, Name wrote:"
            r'From:.*?Sent:.*?To:.*?Subject:.*$',  # Outlook quote header
            r'>.*$',  # Lines starting with >
            r'_{5,}',  # Separator lines
            r'[-]{3,}.*?[-]{3,}',  # --- quote ---
        ]

        for pattern in quote_patterns:
            text = re.sub(pattern, '', text, flags=re.MULTILINE | re.DOTALL)

        # Remove everything after common quote indicators
        quote_indicators = [
            'wrote:',
            'From:',
            'Sent:',
            '-----Original Message-----',
            '________________________________',
        ]

        for indicator in quote_indicators:
            if indicator in text:
                self.stats['quoted_text_removed'] += 1
                text = text.split(indicator)[0]

        return text.strip()

    def anonymize_text(self, text: str) -> str:
        """Anonymize sensitive information in text."""
        if not text:
            return ""

        anonymized = text

        # Apply each pattern
        for pattern_name, pattern in PATTERNS.items():
            matches = re.findall(pattern, anonymized, re.IGNORECASE)
            if matches:
                self.stats['anonymization_counts'][pattern_name] += len(matches)
                replacement = REPLACEMENTS.get(pattern_name, '[removed]')
                anonymized = re.sub(pattern, replacement, anonymized, flags=re.IGNORECASE)

        return anonymized

    def extract_sender_names(self, text: str) -> List[str]:
        """Extract likely customer names for anonymization."""
        # This is a simplified approach - in production, you'd want more sophisticated NER
        names = []

        # Look for "Hi/Hello [Name]," patterns
        greeting_pattern = r'(?:Hi|Hello|Hey|Dear)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)'
        matches = re.findall(greeting_pattern, text)
        names.extend(matches)

        return list(set(names))  # Remove duplicates

    def anonymize_names(self, text: str, names: List[str]) -> str:
        """Replace customer names with [Customer]."""
        anonymized = text

        for name in names:
            # Only replace if it's not "Joe" or "Newman"
            if name.lower() not in ['joe', 'newman', 'joe newman']:
                anonymized = anonymized.replace(name, '[Customer]')

        return anonymized

    def clean_email_body(self, email: Dict[str, Any]) -> str:
        """Clean and process a single email body."""
        body = email.get('body', '')

        if not body:
            return ""

        # Remove HTML if present
        if email.get('bodyType') == 'html':
            body = self.remove_html_tags(body)

        # Remove quoted text
        body = self.remove_quoted_text(body)

        # Extract and anonymize names
        names = self.extract_sender_names(body)
        body = self.anonymize_names(body, names)

        # Anonymize sensitive data
        body = self.anonymize_text(body)

        # Final cleanup
        body = re.sub(r'\n\s*\n\s*\n+', '\n\n', body)  # Remove excessive newlines
        body = body.strip()

        return body

    def process_emails(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process all emails in the dataset."""
        print(f"🔧 Processing {len(data['emails'])} emails...\n")

        cleaned_emails = []

        for i, email in enumerate(data['emails'], 1):
            if i % 10 == 0 or i == 1:
                print(f"   [{i}/{len(data['emails'])}] Processing...")

            cleaned_body = self.clean_email_body(email)

            if not cleaned_body or len(cleaned_body) < 20:
                self.stats['empty_after_cleaning'] += 1
                continue  # Skip empty or very short emails

            cleaned_email = {
                'id': email['id'],
                'subject': email.get('subject', ''),
                'sentDate': email.get('sentDate', ''),
                'body': cleaned_body,
                'wordCount': len(cleaned_body.split()),
                'originalWordCount': email.get('wordCount', 0),
            }

            cleaned_emails.append(cleaned_email)
            self.stats['total_processed'] += 1

        return {
            'processedAt': datetime.now().isoformat(),
            'totalEmails': len(cleaned_emails),
            'dateRange': data.get('dateRange', {}),
            'processingStats': self.stats,
            'emails': cleaned_emails,
        }

    def save_output(self, data: Dict[str, Any]):
        """Save processed emails to file."""
        os.makedirs(os.path.dirname(self.output_file), exist_ok=True)

        with open(self.output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"\n💾 Saved to {self.output_file}")

    def print_stats(self):
        """Print processing statistics."""
        print("\n📊 Processing Statistics:")
        print(f"   Total emails processed: {self.stats['total_processed']}")
        print(f"   Empty after cleaning: {self.stats['empty_after_cleaning']}")
        print(f"\n🔒 Anonymization:")
        for key, count in self.stats['anonymization_counts'].items():
            if count > 0:
                print(f"   {key.replace('_', ' ').title()}: {count} replaced")
        print(f"   Quoted text removed: {self.stats['quoted_text_removed']} emails")

    def run(self):
        """Run the complete processing pipeline."""
        print("🔧 Email Processing and Anonymization")
        print("=" * 50 + "\n")

        try:
            # Load emails
            print(f"📂 Reading {self.input_file}...")
            data = self.load_emails()
            print(f"✅ Loaded {len(data.get('emails', []))} emails\n")

            # Process
            processed_data = self.process_emails(data)

            # Save
            self.save_output(processed_data)

            # Print stats
            self.print_stats()

            print("\n✅ Processing complete!")
            print("\n📝 Next step:")
            print("   python3 analyze-style.py\n")

        except Exception as e:
            print(f"\n❌ Error: {str(e)}")
            raise


if __name__ == "__main__":
    processor = EmailProcessor()
    processor.run()
