import { BaseAPIClient } from './BaseAPIClient';

export interface GitHubUser {
    login: string;
    name: string;
    bio: string;
    company: string;
    location: string;
    blog: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    avatar_url: string;
    html_url: string;
}

export interface GitHubRepo {
    name: string;
    description: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    html_url: string;
    updated_at: string;
}

export class GitHubClient extends BaseAPIClient {
    constructor() {
        super('https://api.github.com', {
            'User-Agent': 'nexus-cli/1.0.0',
        });
    }

    async getUser(username: string): Promise<GitHubUser> {
        return this.get<GitHubUser>(`/users/${encodeURIComponent(username)}`);
    }

    async getRepos(username: string): Promise<GitHubRepo[]> {
        return this.get<GitHubRepo[]>(`/users/${encodeURIComponent(username)}/repos`, {
            sort: 'stars',
            direction: 'desc',
            per_page: 5,
        });
    }
}
