import { Command as CommanderCommand } from 'commander';
import chalk from 'chalk';
import { GreetCommand } from './commands/GreetCommand';
import { FileInfoCommand } from './commands/FileInfoCommand';
import { GitHubCommand } from './commands/GitHubCommand';
import { WeatherCommand } from './commands/WeatherCommand';
import { QuoteCommand } from './commands/QuoteCommand';
import { JokeCommand } from './commands/JokeCommand';
import { CalcCommand } from './commands/CalcCommand';
import { TimeCommand } from './commands/TimeCommand';

export class App {
    private readonly program: CommanderCommand;
    private readonly commands: Array<{ register(p: CommanderCommand): void }>;

    constructor() {
        this.program = new CommanderCommand();
        this.commands = [
            new GreetCommand(),
            new FileInfoCommand(),
            new GitHubCommand(),
            new WeatherCommand(),
            new QuoteCommand(),
            new JokeCommand(),
            new CalcCommand(),
            new TimeCommand(),
        ];
    }

    private setup(): void {
        this.program
            .name('nexus')
            .description(
                chalk.bold.magentaBright('nexus-cli') +
                chalk.gray(' — A powerful CLI tool for developers\n') +
                chalk.gray('  Built with Node.js + TypeScript | SESD Workshop 2\n')
            )
            .version('1.0.0', '-v, --version', 'Show current version')
            .addHelpText(
                'beforeAll',
                chalk.bold.magenta('\n  ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗\n') +
                chalk.bold.magenta('  ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝\n') +
                chalk.bold.magenta('  ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗\n') +
                chalk.bold.magenta('  ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║\n') +
                chalk.bold.magenta('  ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║\n') +
                chalk.bold.magenta('  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝\n')
            );
    }

    private registerCommands(): void {
        for (const command of this.commands) {
            command.register(this.program);
        }
    }

    run(argv: string[]): void {
        this.setup();
        this.registerCommands();
        this.program.parse(argv);

        // Show help if no arguments provided
        if (argv.length <= 2) {
            this.program.outputHelp();
        }
    }
}
