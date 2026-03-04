import { Command as CommanderCommand } from 'commander';
import chalk from 'chalk';
import { Logger } from '../utils/logger';
import { Validator } from '../utils/validator';

export class TimeCommand {
    register(program: CommanderCommand): void {
        program
            .command('time <timezone>')
            .description('Show current date and time in a specified timezone (e.g. America/New_York)')
            .option('-f, --format <fmt>', 'Format: 12 or 24 hour clock', '24')
            .action((timezone: string, options: { format: string }) => {
                Validator.isNonEmpty(timezone, 'Timezone');

                if (!Validator.isValidTimezone(timezone)) {
                    Logger.error(`Invalid timezone: "${timezone}"`);
                    Logger.info('Examples: America/New_York, Europe/London, Asia/Kolkata, Asia/Tokyo');
                    Logger.info('Full list: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones');
                    process.exit(1);
                }

                const use12hr = options.format === '12';
                const now = new Date();

                const timeStr = now.toLocaleTimeString('en-US', {
                    timeZone: timezone,
                    hour12: use12hr,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                const dateStr = now.toLocaleDateString('en-US', {
                    timeZone: timezone,
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });

                const utcOffset = this.getUTCOffset(timezone);

                Logger.header(`🌍  World Clock`);
                Logger.label('Timezone:', chalk.yellow(timezone));
                Logger.label('UTC Offset:', chalk.cyan(utcOffset));
                Logger.divider();
                Logger.label('Date:', chalk.whiteBright(dateStr));
                Logger.label('Time:', chalk.greenBright(timeStr));
                Logger.blank();

                // Also show local time comparison
                const localNow = now.toLocaleTimeString('en-US', { hour12: use12hr, hour: '2-digit', minute: '2-digit' });
                Logger.info(`Your local time: ${localNow}`);
                Logger.blank();
            });
    }

    private getUTCOffset(timezone: string): string {
        const now = new Date();
        const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        const diffMs = tzDate.getTime() - utcDate.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.abs(Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60)));
        const sign = diffHrs >= 0 ? '+' : '';
        return `UTC${sign}${diffHrs}:${diffMins.toString().padStart(2, '0')}`;
    }
}
