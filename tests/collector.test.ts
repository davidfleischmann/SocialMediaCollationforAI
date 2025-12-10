import { Collector } from '../src/collector';
import axios from 'axios';
import { config } from '../src/config';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Collector', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        config.SEARCH_API_KEY = 'test-key';
        config.SEARCH_ENGINE_ID = 'test-engine';
    });

    it('should fetch posts successfully when API keys are present', async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                items: [
                    {
                        title: 'Test Post',
                        link: 'http://linkedin.com/post/1',
                        snippet: 'Test Snippet',
                    },
                ],
            },
        });

        const collector = new Collector();
        const posts = await collector.fetchPosts();

        expect(posts).toHaveLength(1);
        expect(posts[0].title).toBe('Test Post');
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('should return mock data when API keys are missing', async () => {
        config.SEARCH_API_KEY = '';

        const collector = new Collector();
        const posts = await collector.fetchPosts();

        expect(posts).toHaveLength(2); // Mock data has 2 items
        expect(posts[0].source).toBe('Mock Data');
        expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
        mockedAxios.get.mockRejectedValue(new Error('API Error'));

        const collector = new Collector();
        const posts = await collector.fetchPosts();

        expect(posts).toEqual([]);
    });
});
