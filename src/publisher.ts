import axios from 'axios';
import { config } from './config';

export class TeamsPublisher {
    async publish(title: string, summary: string, link: string = '') {
        if (!config.PUBLISH_TO_TEAMS) {
            return;
        }

        if (!config.TEAMS_WEBHOOK_URL) {
            console.warn('⚠️ PUBLISH_TO_TEAMS is true, but TEAMS_WEBHOOK_URL is missing. Skipping Teams post.');
            return;
        }

        console.log('📨 Posting summary to Microsoft Teams...');

        try {
            // Create a simple MessageCard (Legacy) or AdaptiveCard. 
            // MessageCard is easiest for simple webhooks.
            const card = {
                "@type": "MessageCard",
                "@context": "http://schema.org/extensions",
                "themeColor": "0076D7",
                "summary": title,
                "sections": [{
                    "activityTitle": title,
                    "activitySubtitle": "AI Newsletter Summary",
                    "activityImage": "https://img.icons8.com/color/48/000000/artificial-intelligence.png", // Optional generic AI icon
                    "text": summary
                }],
                "potentialAction": link ? [{
                    "@type": "OpenUri",
                    "name": "View Full Newsletter",
                    "targets": [{ "os": "default", "uri": link }]
                }] : []
            };

            await axios.post(config.TEAMS_WEBHOOK_URL, card);
            console.log('✅ Posted to Microsoft Teams successfully.');
        } catch (error: any) {
            console.error('❌ Error posting to Teams:', error.message);
        }
    }
}
