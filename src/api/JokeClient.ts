import { BaseAPIClient } from './BaseAPIClient';

export interface SingleJoke {
    type: 'single';
    joke: string;
    category: string;
    flags: Record<string, boolean>;
}

export interface TwoPartJoke {
    type: 'twopart';
    setup: string;
    delivery: string;
    category: string;
    flags: Record<string, boolean>;
}

export type JokeData = SingleJoke | TwoPartJoke;

export class JokeClient extends BaseAPIClient {
    constructor() {
        super('https://v2.jokeapi.dev');
    }

    async getJoke(category: 'Programming' | 'Misc' | 'Dark' | 'Any' = 'Any'): Promise<JokeData> {
        return this.get<JokeData>(`/joke/${category}`, {
            blacklistFlags: 'nsfw,racist,sexist,explicit',
            safe: 'true',
        });
    }
}
