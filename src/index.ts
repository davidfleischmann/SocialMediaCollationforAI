import schedule from 'node-cron';
import { Collector } from './collector';
import { Processor } from './processor';
import { Generator } from './generator';
import { config } from './config';

async function main() {
    console.log('🚀 Starting AI Newsletter Generator...');

    const runTask = async (dateRange?: { start: string, end: string }) => {
        const collector = new Collector();
        const processor = new Processor();
        const generator = new Generator();

        try {
            // 1. Collect
            const posts = await collector.fetchPosts(dateRange);
            console.log(`Found ${posts.length} posts.`);

            // 2. Process
            const summary = await processor.summarize(posts, dateRange);
            console.log('Summary generated.');

            // 3. Generate
            await generator.createNewsletter(summary, posts, dateRange);
            console.log('Done!');
        } catch (error) {
            console.error('Error in main execution:', error);
        }
    };

    // Check for schedule mode
    const isScheduleMode = process.argv.includes('--schedule') || process.env.RUN_MODE === 'schedule';

    // Check for date ranges
    let dateRange: { start: string, end: string } | undefined;
    const args = process.argv.slice(2);
    const weeklyIndex = args.indexOf('--weekly');
    const fromIndex = args.indexOf('--from');
    const toIndex = args.indexOf('--to');

    if (weeklyIndex !== -1) {
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        dateRange = {
            start: lastWeek.toISOString().split('T')[0],
            end: today.toISOString().split('T')[0]
        };
        console.log(`📅 Date Range: Weekly (${dateRange.start} to ${dateRange.end})`);
    } else if (fromIndex !== -1) {
        const fromDate = args[fromIndex + 1];
        let toDate = new Date().toISOString().split('T')[0];

        if (toIndex !== -1) {
            toDate = args[toIndex + 1];
        }

        if (fromDate) {
            dateRange = { start: fromDate, end: toDate };
            console.log(`📅 Date Range: Custom (${dateRange.start} to ${dateRange.end})`);
        }
    }

    if (isScheduleMode) {
        console.log(`🕒 Running in SCHEDULE mode. Cron: "${config.SCHEDULE_CRON}"`);
        schedule.schedule(config.SCHEDULE_CRON, () => {
            console.log('\n⏰ Triggering scheduled run...');
            runTask(dateRange); // Pass dateRange if defined (though schedule usually implies daily)
        });
        // Keep process alive
    } else {
        // Run immediately
        await runTask(dateRange);
    }
}

main();
