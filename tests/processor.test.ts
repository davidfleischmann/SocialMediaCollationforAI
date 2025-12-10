import { Processor } from '../src/processor';
import { config } from '../src/config';

// Mock @google/generative-ai
const mockGenerateContent = jest.fn();
const mockGetGenerativeModel = jest.fn().mockReturnValue({
    generateContent: mockGenerateContent,
});

jest.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: jest.fn().mockImplementation(() => {
            return {
                getGenerativeModel: mockGetGenerativeModel,
            };
        }),
    };
});

describe('Processor', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        config.GEMINI_API_KEY = 'test-key';
    });

    it('should return static summary if no API key', async () => {
        config.GEMINI_API_KEY = '';
        const processor = new Processor();
        const summary = await processor.summarize([{ title: 't', link: 'l', snippet: 's', source: 'src' }]);

        expect(summary).toContain('(Mock)');
        expect(mockGetGenerativeModel).not.toHaveBeenCalled();
    });

    it('should call Gemini and return summary', async () => {
        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => 'Gemini Summary',
            },
        });

        const processor = new Processor();
        const summary = await processor.summarize([{ title: 't', link: 'l', snippet: 's', source: 'src' }]);

        expect(summary).toBe('Gemini Summary');
        expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-flash' });
        expect(mockGenerateContent).toHaveBeenCalled();
    });

    it('should handle Gemini errors', async () => {
        mockGenerateContent.mockRejectedValue(new Error('Gemini Error'));

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
