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
    LINKEDIN_KEYWORDS=Artificial Intelligence, Generative AI, LLM
    ```

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
