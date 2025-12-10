import { Collector } from './collector';
import { Processor } from './processor';
import { Generator } from './generator';

async function main() {
    console.log('🚀 Starting AI Newsletter Generator...');

    const collector = new Collector();
    const processor = new Processor();
    const generator = new Generator();

    // 1. Collect
    const posts = await collector.fetchPosts();
    console.log(`Found ${posts.length} posts.`);

    // 2. Process
    const summary = await processor.summarize(posts);
    console.log('Summary generated.');

    // 3. Generate
    await generator.createNewsletter(summary, posts);
    console.log('Done!');
}

main().catch(console.error);
