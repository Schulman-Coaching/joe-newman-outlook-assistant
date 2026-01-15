#!/usr/bin/env python3

"""
Writing Style Analysis

Analyzes Joe's writing style from processed emails:
1. Greeting patterns
2. Sign-off preferences
3. Tone and formality
4. Sentence structure
5. Common phrases and vocabulary
6. Response patterns

Usage: python3 analyze-style.py
"""

import json
import re
import os
from collections import Counter, defaultdict
from datetime import datetime
from typing import Dict, List, Any, Tuple

class StyleAnalyzer:
    def __init__(self, input_file='output/cleaned-emails.json', output_file='output/style-profile.json'):
        self.input_file = input_file
        self.output_file = output_file
        self.training_output = 'output/training-data.txt'
        self.emails = []

    def load_emails(self) -> List[Dict[str, Any]]:
        """Load processed emails."""
        if not os.path.exists(self.input_file):
            raise FileNotFoundError(f"Input file not found: {self.input_file}")

        with open(self.input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        return data.get('emails', [])

    def analyze_greetings(self) -> Dict[str, Any]:
        """Analyze greeting patterns."""
        greeting_patterns = [
            (r'^Hi\s+\[Customer\],?', "Hi [Name],"),
            (r'^Hello\s+\[Customer\],?', "Hello [Name],"),
            (r'^Hey\s+\[Customer\],?', "Hey [Name],"),
            (r'^Dear\s+\[Customer\],?', "Dear [Name],"),
            (r'^\[Customer\],?', "[Name],"),
            (r'^Good\s+(?:morning|afternoon|evening)\s+\[Customer\],?', "Good [time] [Name],"),
        ]

        greeting_counts = Counter()

        for email in self.emails:
            body = email['body']
            # Check first 100 characters for greeting
            first_line = body[:100].strip()

            for pattern, label in greeting_patterns:
                if re.search(pattern, first_line, re.IGNORECASE):
                    greeting_counts[label] += 1
                    break

        total = sum(greeting_counts.values())

        if total == 0:
            return {
                "most_common": "Hi [Name],",
                "variations": [],
                "usage_percentages": {}
            }

        # Calculate percentages
        percentages = {
            greeting: round((count / total) * 100, 2)
            for greeting, count in greeting_counts.items()
        }

        return {
            "most_common": greeting_counts.most_common(1)[0][0] if greeting_counts else "Hi [Name],",
            "variations": [g for g, _ in greeting_counts.most_common()],
            "usage_percentages": percentages,
        }

    def analyze_signoffs(self) -> Dict[str, Any]:
        """Analyze sign-off patterns."""
        signoff_patterns = [
            (r'Thanks,?\s*(?:Joe|Joe Newman)', "Thanks,\nJoe"),
            (r'Best,?\s*(?:Joe|Joe Newman)', "Best,\nJoe"),
            (r'Best regards,?\s*(?:Joe|Joe Newman)', "Best regards,\nJoe"),
            (r'Regards,?\s*(?:Joe|Joe Newman)', "Regards,\nJoe"),
            (r'Sincerely,?\s*(?:Joe|Joe Newman)', "Sincerely,\nJoe"),
            (r'Cheers,?\s*(?:Joe|Joe Newman)', "Cheers,\nJoe"),
            (r'(?:^|\n)Joe(?:\s+Newman)?$', "Joe"),
        ]

        signoff_counts = Counter()

        for email in self.emails:
            body = email['body']
            # Check last 150 characters for sign-off
            last_part = body[-150:].strip()

            for pattern, label in signoff_patterns:
                if re.search(pattern, last_part, re.IGNORECASE | re.MULTILINE):
                    signoff_counts[label] += 1
                    break

        total = sum(signoff_counts.values())

        if total == 0:
            return {
                "most_common": "Thanks,\nJoe",
                "variations": [],
                "usage_percentages": {}
            }

        percentages = {
            signoff: round((count / total) * 100, 2)
            for signoff, count in signoff_counts.items()
        }

        return {
            "most_common": signoff_counts.most_common(1)[0][0] if signoff_counts else "Thanks,\nJoe",
            "variations": [s for s, _ in signoff_counts.most_common()],
            "usage_percentages": percentages,
        }

    def analyze_tone(self) -> Dict[str, Any]:
        """Analyze overall tone and formality."""
        formal_indicators = [
            'dear', 'sincerely', 'regards', 'please find', 'i am writing to',
            'hereby', 'pursuant to', 'kindly', 'appreciate your', 'furthermore'
        ]

        friendly_indicators = [
            'hey', 'thanks', 'great', 'awesome', 'love', 'excited',
            'looking forward', '!', 'happy to', 'glad to'
        ]

        professional_indicators = [
            'please', 'thank you', 'appreciate', 'per our discussion',
            'as discussed', 'following up', 'wanted to', 'just checking'
        ]

        formal_count = 0
        friendly_count = 0
        professional_count = 0

        for email in self.emails:
            body_lower = email['body'].lower()

            formal_count += sum(1 for ind in formal_indicators if ind in body_lower)
            friendly_count += sum(1 for ind in friendly_indicators if ind in body_lower)
            professional_count += sum(1 for ind in professional_indicators if ind in body_lower)

        total_emails = len(self.emails)

        # Calculate scores (0-10 scale)
        formality_score = min(10, (formal_count / total_emails) * 2)
        warmth_score = min(10, (friendly_count / total_emails) * 1.5)
        professionalism_score = min(10, (professional_count / total_emails) * 1.5)

        # Determine overall tone
        if formality_score > 7:
            overall_tone = "Formal"
        elif warmth_score > 7:
            overall_tone = "Friendly"
        elif professionalism_score > 6:
            overall_tone = "Professional-Friendly"
        else:
            overall_tone = "Casual-Professional"

        return {
            "overall_tone": overall_tone,
            "formality_score": round(formality_score, 1),
            "warmth_score": round(warmth_score, 1),
            "professionalism_score": round(professionalism_score, 1),
        }

    def analyze_writing_characteristics(self) -> Dict[str, Any]:
        """Analyze sentence and paragraph structure."""
        email_lengths = []
        sentence_lengths = []
        paragraph_lengths = []

        for email in self.emails:
            body = email['body']
            words = body.split()
            email_lengths.append(len(words))

            # Count sentences (rough approximation)
            sentences = re.split(r'[.!?]+', body)
            sentences = [s.strip() for s in sentences if s.strip()]

            for sentence in sentences:
                sentence_lengths.append(len(sentence.split()))

            # Count paragraphs
            paragraphs = [p.strip() for p in body.split('\n\n') if p.strip()]
            paragraph_lengths.append(len(paragraphs))

        return {
            "avg_email_length": round(sum(email_lengths) / len(email_lengths)) if email_lengths else 0,
            "avg_sentence_length": round(sum(sentence_lengths) / len(sentence_lengths)) if sentence_lengths else 0,
            "avg_paragraph_count": round(sum(paragraph_lengths) / len(paragraph_lengths), 1) if paragraph_lengths else 0,
        }

    def extract_common_phrases(self, min_length=3, max_length=8, top_n=15) -> List[str]:
        """Extract commonly used phrases."""
        phrase_counter = Counter()

        for email in self.emails:
            body = email['body'].lower()
            # Remove punctuation for phrase extraction
            body = re.sub(r'[^\w\s]', ' ', body)
            words = body.split()

            # Extract n-grams
            for n in range(min_length, max_length + 1):
                for i in range(len(words) - n + 1):
                    phrase = ' '.join(words[i:i+n])
                    # Skip if contains customer placeholder
                    if '[customer]' not in phrase:
                        phrase_counter[phrase] += 1

        # Filter to phrases that appear at least 3 times
        common_phrases = [
            phrase for phrase, count in phrase_counter.most_common(top_n * 3)
            if count >= 3
        ]

        return common_phrases[:top_n]

    def categorize_emails(self) -> Dict[str, List[Dict[str, Any]]]:
        """Categorize emails by type based on subject and content."""
        categories = defaultdict(list)

        quote_keywords = ['quote', 'pricing', 'price', 'cost', 'estimate']
        delivery_keywords = ['delivery', 'schedule', 'ship', 'pickup']
        order_keywords = ['order', 'purchase', 'buy', 'need']
        question_keywords = ['question', 'wondering', 'inquiry', 'ask']

        for email in self.emails:
            subject_lower = email['subject'].lower()
            body_lower = email['body'].lower()

            if any(kw in subject_lower or kw in body_lower[:200] for kw in quote_keywords):
                categories['quote_requests'].append(email)
            elif any(kw in subject_lower or kw in body_lower[:200] for kw in delivery_keywords):
                categories['delivery_scheduling'].append(email)
            elif any(kw in subject_lower or kw in body_lower[:200] for kw in order_keywords):
                categories['orders'].append(email)
            elif any(kw in subject_lower or kw in body_lower[:200] for kw in question_keywords):
                categories['questions'].append(email)
            else:
                categories['general'].append(email)

        return categories

    def analyze_response_patterns(self, categories: Dict[str, List[Dict[str, Any]]]) -> Dict[str, Dict[str, Any]]:
        """Analyze response patterns by email type."""
        patterns = {}

        for category, emails in categories.items():
            if not emails:
                continue

            lengths = [email['wordCount'] for email in emails]
            avg_length = round(sum(lengths) / len(lengths)) if lengths else 0

            patterns[category] = {
                "count": len(emails),
                "avg_length": avg_length,
                "sample": emails[0]['body'][:200] + "..." if emails else ""
            }

        return patterns

    def save_training_data(self, categories: Dict[str, List[Dict[str, Any]]]):
        """Save representative samples for AI training."""
        os.makedirs(os.path.dirname(self.training_output), exist_ok=True)

        with open(self.training_output, 'w', encoding='utf-8') as f:
            f.write("# Joe Newman Writing Style - Training Samples\n")
            f.write("# Generated: " + datetime.now().isoformat() + "\n\n")
            f.write("=" * 80 + "\n\n")

            for category, emails in categories.items():
                if not emails:
                    continue

                f.write(f"\n{'=' * 80}\n")
                f.write(f"CATEGORY: {category.upper().replace('_', ' ')}\n")
                f.write(f"{'=' * 80}\n\n")

                # Take up to 5 samples per category
                for i, email in enumerate(emails[:5], 1):
                    f.write(f"--- Sample {i} ---\n")
                    f.write(f"Subject: {email['subject']}\n")
                    f.write(f"Length: {email['wordCount']} words\n\n")
                    f.write(email['body'])
                    f.write("\n\n")

        print(f"💾 Training samples saved to {self.training_output}")

    def run(self):
        """Run complete style analysis."""
        print("📊 Writing Style Analysis")
        print("=" * 50 + "\n")

        try:
            # Load emails
            print(f"📂 Reading {self.input_file}...")
            self.emails = self.load_emails()
            print(f"✅ Loaded {len(self.emails)} emails\n")

            if len(self.emails) < 10:
                print("⚠️  Warning: Less than 10 emails. Analysis may not be accurate.")
                print("   Consider extracting more emails for better results.\n")

            print("🔍 Analyzing writing style...\n")

            # Analyze components
            print("   Analyzing greetings...")
            greetings = self.analyze_greetings()

            print("   Analyzing sign-offs...")
            signoffs = self.analyze_signoffs()

            print("   Analyzing tone...")
            tone = self.analyze_tone()

            print("   Analyzing writing characteristics...")
            characteristics = self.analyze_writing_characteristics()

            print("   Extracting common phrases...")
            common_phrases = self.extract_common_phrases()

            print("   Categorizing emails...")
            categories = self.categorize_emails()

            print("   Analyzing response patterns...")
            response_patterns = self.analyze_response_patterns(categories)

            # Build style profile
            style_profile = {
                "generated_at": datetime.now().isoformat(),
                "total_emails_analyzed": len(self.emails),
                "greeting_patterns": greetings,
                "sign_offs": signoffs,
                "tone_analysis": tone,
                "writing_characteristics": characteristics,
                "common_phrases": common_phrases,
                "response_patterns": response_patterns,
            }

            # Save profile
            os.makedirs(os.path.dirname(self.output_file), exist_ok=True)
            with open(self.output_file, 'w', encoding='utf-8') as f:
                json.dump(style_profile, f, indent=2, ensure_ascii=False)

            print(f"\n💾 Style profile saved to {self.output_file}")

            # Save training samples
            self.save_training_data(categories)

            # Print summary
            print("\n" + "=" * 50)
            print("📊 STYLE ANALYSIS SUMMARY")
            print("=" * 50 + "\n")

            print(f"📧 Emails analyzed: {len(self.emails)}\n")

            print("👋 Greeting:")
            print(f"   Most common: {greetings['most_common']}")
            if greetings['usage_percentages']:
                top_greeting = list(greetings['usage_percentages'].items())[0]
                print(f"   Used {top_greeting[1]}% of the time\n")

            print("✍️  Sign-off:")
            print(f"   Most common: {signoffs['most_common']}")
            if signoffs['usage_percentages']:
                top_signoff = list(signoffs['usage_percentages'].items())[0]
                print(f"   Used {top_signoff[1]}% of the time\n")

            print("🎭 Tone:")
            print(f"   Overall: {tone['overall_tone']}")
            print(f"   Formality: {tone['formality_score']}/10")
            print(f"   Warmth: {tone['warmth_score']}/10")
            print(f"   Professionalism: {tone['professionalism_score']}/10\n")

            print("✏️  Writing Style:")
            print(f"   Avg email length: {characteristics['avg_email_length']} words")
            print(f"   Avg sentence length: {characteristics['avg_sentence_length']} words")
            print(f"   Avg paragraphs: {characteristics['avg_paragraph_count']}\n")

            print("📂 Email Categories:")
            for category, pattern in response_patterns.items():
                print(f"   {category.replace('_', ' ').title()}: {pattern['count']} emails")

            print("\n✅ Analysis complete!")
            print("\n📝 Next steps:")
            print("   1. Review output/style-profile.json")
            print("   2. Copy to: ../src/config/joe-newman-style.json")
            print("   3. Update Email Assistant to use personalized style\n")

        except Exception as e:
            print(f"\n❌ Error: {str(e)}")
            raise


if __name__ == "__main__":
    analyzer = StyleAnalyzer()
    analyzer.run()
