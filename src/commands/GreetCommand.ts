import { Command as CommanderCommand } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import { Logger } from '../utils/logger';
import { Validator } from '../utils/validator';

export class GreetCommand {
    register(program: CommanderCommand): void {
        program
            .command('greet <name>')
            .description('Display a personalized greeting with ASCII art')
            .option('-l, --lang <language>', 'Language of greeting (en/hi/es/fr)', 'en')
            .action((name: string, options: { lang: string }) => {
                Validator.isNonEmpty(name, 'Name');

                const greetings: Record<string, string> = {
                    en: `Hello, ${name}!`,
                    hi: `Namaste, ${name}!`,
                    es: `¡Hola, ${name}!`,
                    fr: `Bonjour, ${name}!`,
                    de: `Hallo, ${name}!`,
                    jp: `Konnichiwa, ${name}!`,
                };

                const lang = options.lang.toLowerCase();
                const message = greetings[lang] || greetings['en'];

                console.log(
                    chalk.magentaBright(
                        figlet.textSync('NEXUS', { font: 'Standard', horizontalLayout: 'fitted' })
                    )
                );
                Logger.header(`👋  ${message}`);
                Logger.info(`Welcome to nexus-cli. You have ${Math.floor(Math.random() * 10) + 1} new suggestions today!`);
                Logger.blank();
                console.log(chalk.gray(`  Tip: Run `) + chalk.cyan(`nexus --help`) + chalk.gray(` to see all available commands.`));
                Logger.blank();
            });
    }
}
