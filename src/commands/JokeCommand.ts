import { Command as CommanderCommand } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { JokeClient, JokeData } from '../api/JokeClient';
import { Logger } from '../utils/logger';

export class JokeCommand {
    private readonly client: JokeClient;

    constructor() {
        this.client = new JokeClient();
    }

    register(program: CommanderCommand): void {
        program
            .command('joke')
            .description('Fetch a random joke')
            .option('-c, --category <cat>', 'Category: Programming, Misc, Dark, Any', 'Any')
            .action(async (options: { category: 'Programming' | 'Misc' | 'Dark' | 'Any' }) => {
                const validCategories = ['Programming', 'Misc', 'Dark', 'Any'];
                const category = validCategories.includes(options.category) ? options.category : 'Any';
                const spinner = ora(`Finding a ${chalk.cyan(category)} joke...`).start();

                try {
                    const joke: JokeData = await this.client.getJoke(category);
                    spinner.succeed(chalk.green('Got one! 😄'));

                    Logger.blank();
                    Logger.header(`😂  ${joke.category} Joke`);

                    if (joke.type === 'single') {
                        console.log(chalk.whiteBright(`  ${joke.joke}`));
                    } else {
                        console.log(chalk.yellowBright(`  🎤 ${joke.setup}`));
                        Logger.blank();
                        setTimeout(() => {
                            console.log(chalk.greenBright(`  💡 ${joke.delivery}`));
                            Logger.blank();
                        }, 1200);
                    }
                    Logger.blank();
                } catch (err: unknown) {
                    spinner.fail(chalk.red('Failed to fetch joke.'));
                    Logger.error((err as Error).message);
                    process.exit(1);
                }
            });
    }
}
