import schedule from 'node-cron';
import { Collector } from './collector';
import { Processor } from './processor';
import { Generator } from './generator';
import { config } from './config';

async function main() {
    console.log('🚀 Starting AI Newsletter Generator...');

    const runTask = async () => {
        const collector = new Collector();
        const processor = new Processor();
        const generator = new Generator();

        try {
            // 1. Collect
            const posts = await collector.fetchPosts();
            console.log(`Found ${posts.length} posts.`);

            // 2. Process
            const summary = await processor.summarize(posts);
            console.log('Summary generated.');

            // 3. Generate
            await generator.createNewsletter(summary, posts);
            console.log('Done!');
        } catch (error) {
            console.error('Error in main execution:', error);
        }
    };

    // Check for schedule mode
    const isScheduleMode = process.argv.includes('--schedule') || process.env.RUN_MODE === 'schedule';

    if (isScheduleMode) {
        console.log(`🕒 Running in SCHEDULE mode.Cron: "${config.SCHEDULE_CRON}"`);
        schedule.schedule(config.SCHEDULE_CRON, () => {
            console.log('\n⏰ Triggering scheduled run...');
            runTask();
        });
        // Keep process alive
    } else {
        // Run immediately
        await runTask();
    }
}

main();
