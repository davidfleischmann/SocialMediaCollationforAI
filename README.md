# SocialMediaCollationforAI

A tool to search for LinkedIn posts about **Microsoft AI, Azure, and Copilot**, summarize them using Google Gemini, and generate a daily newsletter (Markdown/HTML).

## Features
-   **Automated Discovery**: Searches LinkedIn public posts# Default: "Microsoft AI, Azure AI, Microsoft Copilot, .NET AI, Semantic Kernel, GitHub Copilot"
LINKEDIN_KEYWORDS="Microsoft AI, Azure AI, Microsoft Copilot, .NET AI, Semantic Kernel"PI.
-   **Smart Summarization**: Uses Google Gemini to synthesize fragmented posts into a readable narrative.
-   **Daily Newsletter**: Generates a clean Markdown report with a high-level summary and links to source content.
-   **No Scraping Risks**: Relies on official Search APIs rather than brittle/risky HTML scraping.

## Prerequisites
-   Node.js (v18+)
-   Google Custom Search API Key & Search Engine ID
-   Google Gemini API Key

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/davidfleischmann/SocialMediaCollationforAI.git
    cd SocialMediaCollationforAI
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment:
    Copy `.env.example` to `.env` and fill in your keys:
    ```bash
    cp .env.example .env
    ```
    
    ```properties
    # .env
    SEARCH_API_KEY=your_google_key
    SEARCH_ENGINE_ID=your_engine_id
    OPENAI_API_KEY=your_openai_key
    ```

### Detailed Setup: Getting the Search Engine ID
To use the Google Custom Search API, you need a Programmable Search Engine that includes LinkedIn.

1.  Go to the [Programmable Search Engine Console](https://programmablesearchengine.google.com/).
2.  Click **Add**.
3.  **Name**: e.g., "LinkedIn AI Search".
4.  **What to search?**: Select **Search specific sites or pages**.
5.  **Sites to Search**: Add `www.linkedin.com/posts/*`.
6.  Click **Create**.
7.  Copy the **search engine ID** (it looks like `cx=...` or a long string) and paste it into your `.env` as `SEARCH_ENGINE_ID`.
8.  *Note: Ensure your Google Cloud Project associated with the API Key has the "Custom Search API" enabled.*

8.  *Note: Ensure your Google Cloud Project associated with the API Key has the "Custom Search API" enabled.*

### Detailed Setup: Getting the Gemini API Key
To utilize the summarization features, you need a Google Gemini API Key.

1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Click **Create API Key**.
3.  Copy the key and paste it into your `.env` as `GEMINI_API_KEY`.
4.  *Note: This API is currently free (within rate limits) for many regions.*

## Troubleshooting

### Gemini Errors
If you see Gemini errors (e.g., 429), it means you have exceeded the free tier quota. Wait for a minute or upgrade your plan.

### debug-models.ts
If you encounter 404 errors with the Gemini API, run the debug script to test model connectivity:
```bash
npx ts-node src/debug-models.ts
```

## Usage

### Run Once
Run the tool to generate today's newsletter immediately:
```bash
npm start
```

### Date Ranges
Run for a quick weekly summary (past 7 days):
```bash
npm start -- --weekly
```

Run for a specific custom date range:
```bash
npm start -- --from 2025-01-01 --to 2025-01-31
```
*(Filename will be `newsletter_2025-01-01_to_2025-01-31.md`)*

### Run on Schedule
Run the tool in scheduler mode (keeps running and triggers based on cron):
```bash
npm start -- --schedule
```

Configuration via `.env`:
```env
# Default: 0 8 * * * (Every day at 8:00 AM)
SCHEDULE_CRON="0 8 * * *"

# Output Format: markdown (default) or html
OUTPUT_FORMAT="markdown"

# Detail Level: brief (default) or extended
DETAIL_LEVEL="brief"

# Audio Overview: true or false (default: false)
GENERATE_AUDIO="false"

# Max posts to collect (pagination).
MAX_POSTS="20"

# Microsoft Teams Integration
PUBLISH_TO_TEAMS="true"
TEAMS_WEBHOOK_URL="https://outlook.office.com/webhook/..."
```

The output will be saved in the `output/` directory, e.g.:
- `newsletter_2025-12-10.md` (or `.html`)
- `newsletter_2025-12-10.mp3` (if enabled)

## Testing

Run the unit test suite:

```bash
npm test
```

## Architecture
-   **Collector**: Fetches search results.
-   **Processor**: Formats prompt and queries LLM.
-   **Generator**: Creates file artifacts.

## License
ISC
