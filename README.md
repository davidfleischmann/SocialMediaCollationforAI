# Social Media Collation for AI

A comprehensive tool to aggregate, filter, and summarize recent AI-related discussions from LinkedIn. It utilizes Google Custom Search to safely discover public posts and OpenAI's GPT-4 to generate a cohesive daily newsletter.

## Features
-   **Automated Discovery**: Searches LinkedIn public posts for specified keywords (e.g., "Generative AI", "LLM") using Google Custom Search API.
-   **Smart Summarization**: Uses OpenAI to synthesize fragmented posts into a readable narrative.
-   **Daily Newsletter**: Generates a clean Markdown report with a high-level summary and links to source content.
-   **No Scraping Risks**: Relies on official Search APIs rather than brittle/risky HTML scraping.

## Prerequisites
-   Node.js (v18+)
-   Google Custom Search API Key & Search Engine ID
-   OpenAI API Key

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

### OpenAI 429
*Note: OpenAI integration has been replaced by Gemini. If you see OpenAI errors, ensure you have pulled the latest code and updated your `.env`.*

## Usage

Run the tool to generate today's newsletter:

```bash
npx ts-node src/index.ts
```

The output will be saved in the `output/` directory, e.g., `output/newsletter_2025-12-10.md`.

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
