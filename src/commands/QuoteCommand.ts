import { Command as CommanderCommand } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { QuoteClient } from '../api/QuoteClient';
import { Logger } from '../utils/logger';

export class QuoteCommand {
    private readonly client: QuoteClient;

    constructor() {
        this.client = new QuoteClient();
    }

    register(program: CommanderCommand): void {
        program
            .command('quote')
            .description('Fetch a random inspirational quote')
            .option('-t, --tag <tag>', 'Filter by tag (e.g. motivational, wisdom, happiness)')
            .option('-c, --copy', 'Copy quote to clipboard (macOS only)')
            .action(async (options: { tag?: string; copy?: boolean }) => {
                const spinner = ora('Fetching an inspiring quote...').start();
                try {
                    const quote = await this.client.getRandomQuote(options.tag);
                    spinner.succeed(chalk.green('Quote received!'));

                    Logger.blank();
                    console.log(chalk.bold.magenta('  ❝'));
                    console.log(chalk.italic.whiteBright(`  ${quote.content}`));
                    console.log(chalk.bold.magenta('  ❞'));
                    Logger.blank();
                    console.log(chalk.bold.cyan(`      — ${quote.author}`));
                    if (quote.tags.length > 0) {
                        Logger.blank();
                        console.log(chalk.gray(`  Tags: `) + chalk.yellow(quote.tags.join(', ')));
                    }
                    Logger.blank();
                } catch (err: unknown) {
                    spinner.fail(chalk.red('Failed to fetch quote.'));
                    Logger.error((err as Error).message);
                    process.exit(1);
                }
            });
    }
}
