import { Command as CommanderCommand } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { GitHubClient, GitHubUser, GitHubRepo } from '../api/GitHubClient';
import { Logger } from '../utils/logger';
import { Validator } from '../utils/validator';

export class GitHubCommand {
    private readonly client: GitHubClient;

    constructor() {
        this.client = new GitHubClient();
    }

    register(program: CommanderCommand): void {
        const github = program
            .command('github')
            .description('Fetch information from GitHub API');

        github
            .command('user <username>')
            .description('Show detailed GitHub user profile')
            .option('-j, --json', 'Output raw JSON')
            .action(async (username: string, options: { json?: boolean }) => {
                Validator.isNonEmpty(username, 'Username');
                const spinner = ora(`Fetching GitHub profile for ${chalk.cyan(username)}...`).start();
                try {
                    const user: GitHubUser = await this.client.getUser(username);
                    spinner.succeed(chalk.green(`Fetched profile for ${user.login}`));

                    if (options.json) {
                        console.log(JSON.stringify(user, null, 2));
                        return;
                    }

                    Logger.header(`🐙  GitHub Profile: @${user.login}`);
                    Logger.label('Name:', user.name || '—');
                    Logger.label('Bio:', user.bio || '—');
                    Logger.label('Company:', user.company || '—');
                    Logger.label('Location:', user.location || '—');
                    Logger.label('Website:', user.blog || '—');
                    Logger.divider();
                    Logger.label('Public Repos:', user.public_repos.toString());
                    Logger.label('Followers:', user.followers.toString());
                    Logger.label('Following:', user.following.toString());
                    Logger.label('Joined:', new Date(user.created_at).toDateString());
                    Logger.divider();
                    Logger.info(`Profile URL: ${chalk.underline(user.html_url)}`);
                    Logger.blank();
                } catch (err: unknown) {
                    spinner.fail(chalk.red('Failed to fetch GitHub user.'));
                    Logger.error((err as Error).message);
                    process.exit(1);
                }
            });

        github
            .command('repos <username>')
            .description('Show top 5 starred repositories of a GitHub user')
            .option('--limit <n>', 'Number of repos to show (1-10)', '5')
            .action(async (username: string, options: { limit: string }) => {
                Validator.isNonEmpty(username, 'Username');
                const limit = Math.min(10, Math.max(1, parseInt(options.limit, 10) || 5));
                const spinner = ora(`Fetching repositories for ${chalk.cyan(username)}...`).start();
                try {
                    const repos: GitHubRepo[] = await this.client.getRepos(username);
                    spinner.succeed(chalk.green(`Found ${repos.length} repositories`));

                    Logger.header(`📦  Top Repositories: @${username}`);
                    repos.slice(0, limit).forEach((repo, i) => {
                        console.log(chalk.bold.yellow(`  ${i + 1}. ${repo.name}`));
                        console.log(chalk.gray(`     ${repo.description || 'No description'}`));
                        console.log(
                            chalk.cyan(`     ⭐ ${repo.stargazers_count}  🍴 ${repo.forks_count}  ` +
                                `🔤 ${repo.language || 'N/A'}`)
                        );
                        console.log(chalk.gray(`     🔗 ${repo.html_url}`));
                        Logger.blank();
                    });
                } catch (err: unknown) {
                    spinner.fail(chalk.red('Failed to fetch repositories.'));
                    Logger.error((err as Error).message);
                    process.exit(1);
                }
            });
    }
}
