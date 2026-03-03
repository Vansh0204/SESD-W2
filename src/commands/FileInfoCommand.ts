import { Command as CommanderCommand } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { Logger } from '../utils/logger';
import { Validator } from '../utils/validator';

export class FileInfoCommand {
    register(program: CommanderCommand): void {
        program
            .command('fileinfo <filepath>')
            .description('Display detailed metadata about a file')
            .option('-s, --size-only', 'Show only file size')
            .action((filepath: string, options: { sizeOnly?: boolean }) => {
                Validator.isNonEmpty(filepath, 'File path');

                const resolved = path.resolve(filepath);

                if (!fs.existsSync(resolved)) {
                    Logger.error(`File not found: ${resolved}`);
                    process.exit(1);
                }

                const stats = fs.statSync(resolved);

                if (options.sizeOnly) {
                    Logger.info(`Size: ${this.formatBytes(stats.size)}`);
                    return;
                }

                Logger.header(`📄  File Information`);
                Logger.label('Name:', path.basename(resolved));
                Logger.label('Path:', resolved);
                Logger.label('Type:', stats.isDirectory() ? 'Directory' : stats.isSymbolicLink() ? 'Symbolic Link' : 'File');
                Logger.label('Size:', this.formatBytes(stats.size));
                Logger.label('Created:', new Date(stats.birthtime).toLocaleString());
                Logger.label('Modified:', new Date(stats.mtime).toLocaleString());
                Logger.label('Accessed:', new Date(stats.atime).toLocaleString());
                Logger.label('Permissions:', `${stats.mode.toString(8).slice(-3)} (octal)`);
                Logger.label('Extension:', path.extname(resolved) || '(none)');

                if (stats.isFile() && stats.size < 10 * 1024) {
                    Logger.blank();
                    Logger.divider();
                    const lineCount = fs.readFileSync(resolved, 'utf8').split('\n').length;
                    Logger.label('Lines:', lineCount.toString());
                }
                Logger.blank();
            });
    }

    private formatBytes(bytes: number): string {
        if (bytes === 0) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
    }
}
