import { BaseAPIClient } from './BaseAPIClient';

export interface QuoteData {
    content: string;
    author: string;
    tags: string[];
}

interface ZenQuoteResponse {
    q: string;  // quote text
    a: string;  // author
    h: string;  // HTML version
}

const FALLBACK_QUOTES: QuoteData[] = [
    { content: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', tags: ['motivation'] },
    { content: "Code is like humor. When you have to explain it, it's bad.", author: 'Cory House', tags: ['programming'] },
    { content: 'First, solve the problem. Then, write the code.', author: 'John Johnson', tags: ['programming'] },
    { content: 'In order to be irreplaceable, one must always be different.', author: 'Coco Chanel', tags: ['wisdom'] },
    { content: "Life is what happens to you while you're busy making other plans.", author: 'John Lennon', tags: ['life'] },
];

export class QuoteClient extends BaseAPIClient {
    constructor() {
        super('https://zenquotes.io');
    }

    async getRandomQuote(_tags?: string): Promise<QuoteData> {
        try {
            const results = await this.get<ZenQuoteResponse[]>('/api/random');
            const zen = results[0];
            return {
                content: zen.q,
                author: zen.a,
                tags: ['inspirational'],
            };
        } catch {
            // Graceful fallback to local quotes if API is unreachable
            const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
            return FALLBACK_QUOTES[randomIndex];
        }
    }
}
