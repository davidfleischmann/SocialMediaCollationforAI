import { Processor } from '../src/processor';
import OpenAI from 'openai';
import { config } from '../src/config';

// Mock OpenAI
const mockCreate = jest.fn();
jest.mock('openai', () => {
    return jest.fn().mockImplementation(() => {
        return {
            chat: {
                completions: {
                    create: mockCreate,
                },
            },
        };
    });
});

describe('Processor', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        config.OPENAI_API_KEY = 'test-key';
    });

    it('should return static summary if no API key', async () => {
        config.OPENAI_API_KEY = '';
        const processor = new Processor();
        const summary = await processor.summarize([{ title: 't', link: 'l', snippet: 's', source: 'src' }]);

        expect(summary).toContain('(Mock)');
        expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should call OpenAI and return summary', async () => {
        mockCreate.mockResolvedValue({
            choices: [{ message: { content: 'Generated Summary' } }],
        });

        const processor = new Processor();
        const summary = await processor.summarize([{ title: 't', link: 'l', snippet: 's', source: 'src' }]);

        expect(summary).toBe('Generated Summary');
        expect(mockCreate).toHaveBeenCalled();
    });

    it('should handle OpenAI errors', async () => {
        mockCreate.mockRejectedValue(new Error('OpenAI Error'));

        const processor = new Processor();
        const summary = await processor.summarize([{ title: 't', link: 'l', snippet: 's', source: 'src' }]);

        expect(summary).toContain('Error generating summary');
    });

    it('should handle empty posts list', async () => {
        const processor = new Processor();
        const summary = await processor.summarize([]);
        expect(summary).toBe('No posts found to summarize.');
    });
});
