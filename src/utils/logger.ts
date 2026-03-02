import chalk from 'chalk';

export class Logger {
    static success(message: string): void {
        console.log(chalk.green('✔ ') + chalk.greenBright(message));
    }

    static error(message: string): void {
        console.log(chalk.red('✖ ') + chalk.redBright(message));
    }

    static info(message: string): void {
        console.log(chalk.cyan('ℹ ') + chalk.cyanBright(message));
    }

    static warn(message: string): void {
        console.log(chalk.yellow('⚠ ') + chalk.yellowBright(message));
    }

    static header(message: string): void {
        console.log('\n' + chalk.bold.magenta('━'.repeat(50)));
        console.log(chalk.bold.whiteBright('  ' + message));
        console.log(chalk.bold.magenta('━'.repeat(50)) + '\n');
    }

    static label(key: string, value: string): void {
        console.log(chalk.bold.cyan(key.padEnd(20)) + chalk.white(value));
    }

    static divider(): void {
        console.log(chalk.gray('─'.repeat(50)));
    }

    static blank(): void {
        console.log('');
    }
}
