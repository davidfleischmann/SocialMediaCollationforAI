# Testing Guide

This document outlines the test plans and verification steps for the **SocialMediaCollationforAI** tool.

## Automated Tests
Run unit tests using Jest:
```bash
npm test
```
This checks:
-   `Collector`: API key validation and mock data fallback.
-   `Processor`: Gemini API interaction and error handling.

## Manual Verification Plans

### 1. Basic Functionality (Markdown)
**Scenario**: Generate a standard newsletter.
1.  Ensure `.env` has valid keys.
2.  Set `OUTPUT_FORMAT=markdown`, `GENERATE_AUDIO=false`.
3.  Run: `npm start`
4.  **Verify**: `output/newsletter_YYYY-MM-DD.md` is created and contains a summary + links.

### 2. HTML Output
**Scenario**: Generate an HTML newsletter.
1.  Set `OUTPUT_FORMAT=html`.
2.  Run: `npm start`
3.  **Verify**: `output/newsletter_YYYY-MM-DD.html` is created and renders correctly in a browser.

### 3. Extended Summary
**Scenario**: Generate a detailed report.
1.  Set `DETAIL_LEVEL=extended`.
2.  Run: `npm start`
3.  **Verify**: The summary text in the output file is significantly longer and structured with deeper analysis.

### 4. Audio Overview
**Scenario**: Generate an MP3 summary.
1.  Set `GENERATE_AUDIO=true`.
2.  Run: `npm start`
3.  **Verify**: `output/newsletter_YYYY-MM-DD.mp3` is created. Play it to ensure the TTS worked and matches the summary text.

### 5. Scheduling
**Scenario**: Run on a schedule.
1.  Run: `npm start -- --schedule`
2.  **Verify**: Console shows "Running in SCHEDULE mode".
3.  (Optional) Edit `SCHEDULE_CRON` to `* * * * *` (every minute) to see it trigger immediately.

### 6. Date Ranges
**Scenario 1: Weekly Summary**
1.  Run: `npm start -- --weekly`
2.  **Verify**: Log shows "Date Range: Weekly".
3.  **Verify**: Output filename is like `newsletter_2025-12-03_to_2025-12-10.md` (assuming today is the 10th).

**Scenario 2: Custom Range**
1.  Run: `npm start -- --from 2025-01-01 --to 2025-01-31`
2.  **Verify**: Log shows "Date Range: Custom (2025-01-01 to 2025-01-31)".
3.  **Verify**: Output filename matches the range.

### 7. Pagination / Max Posts
**Scenario**: Verify fetching more than 10 posts.
1.  In `.env`, set `MAX_POSTS=20` (or leave default).
2.  Run: `npm start -- --weekly` (or any command).
3.  **Verify**: Log shows "[Max: 20]".
4.  **Verify**: Log shows "Found 20 posts" (if enough data exists).

### 8. Microsoft Ecosystem Focus
**Scenario**: Verify search keywords.
1.  Check `src/config.ts` or run the tool and observe logs.
2.  **Verify**: Default keywords include "Microsoft AI", "Azure AI", "Copilot".
