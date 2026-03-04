import { Command as CommanderCommand } from 'commander';
import chalk from 'chalk';
import { evaluate } from 'mathjs';
import { Logger } from '../utils/logger';
import { Validator } from '../utils/validator';

export class CalcCommand {
    register(program: CommanderCommand): void {
        program
            .command('calc <expression>')
            .description('Safely evaluate a mathematical expression')
            .option('--precision <n>', 'Decimal precision for result', '4')
            .action((expression: string, options: { precision: string }) => {
                Validator.isNonEmpty(expression, 'Expression');

                try {
                    const precision = parseInt(options.precision, 10) || 4;
                    const result = evaluate(expression);

                    Logger.header(`🧮  Calculator`);
                    Logger.label('Expression:', chalk.yellow(expression));
                    Logger.divider();

                    if (typeof result === 'number') {
                        const formatted = Number.isInteger(result)
                            ? result.toString()
                            : result.toFixed(precision);
                        Logger.label('Result:', chalk.greenBright(`${formatted}`));
                    } else {
                        Logger.label('Result:', chalk.greenBright(`${result}`));
                    }
                    Logger.blank();
                } catch (err: unknown) {
                    Logger.error(`Invalid expression: ${(err as Error).message}`);
                    Logger.info('Examples: "2 + 3 * 4", "sqrt(16)", "sin(pi/2)", "2^10"');
                    process.exit(1);
                }
            });
    }
}
