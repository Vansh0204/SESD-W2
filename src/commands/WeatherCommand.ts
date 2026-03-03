import { Command as CommanderCommand } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { WeatherClient, WeatherData, ForecastData } from '../api/WeatherClient';
import { Logger } from '../utils/logger';
import { Validator } from '../utils/validator';

const WEATHER_EMOJIS: Record<string, string> = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️',
    Wind: '💨',
};

function getEmoji(main: string): string {
    return WEATHER_EMOJIS[main] || '🌡️';
}

export class WeatherCommand {
    private client: WeatherClient | null = null;

    private getClient(): WeatherClient {
        if (!this.client) {
            const apiKey = process.env['OPENWEATHER_API_KEY'];
            if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
                Logger.error('Missing OPENWEATHER_API_KEY. Add it to your .env file.');
                Logger.info('Get a free key at: https://openweathermap.org/api');
                process.exit(1);
            }
            this.client = new WeatherClient(apiKey);
        }
        return this.client;
    }

    register(program: CommanderCommand): void {
        const weather = program
            .command('weather')
            .description('Get weather information for any city');

        weather
            .command('current <city>')
            .alias('now')
            .description('Show current weather for a city')
            .option('-u, --units <system>', 'Unit system: metric (°C) or imperial (°F)', 'metric')
            .action(async (city: string, _opts: unknown) => {
                Validator.isNonEmpty(city, 'City');
                const spinner = ora(`Fetching weather for ${chalk.cyan(city)}...`).start();
                try {
                    const data: WeatherData = await this.getClient().getCurrentWeather(city);
                    spinner.succeed(chalk.green(`Weather data loaded`));

                    const condition = data.weather[0];
                    const emoji = getEmoji(condition.main);

                    Logger.header(`${emoji}  Weather in ${data.name}, ${data.sys.country}`);
                    Logger.label('Condition:', `${condition.main} — ${condition.description}`);
                    Logger.label('Temperature:', `${data.main.temp.toFixed(1)}°C`);
                    Logger.label('Feels Like:', `${data.main.feels_like.toFixed(1)}°C`);
                    Logger.label('Humidity:', `${data.main.humidity}%`);
                    Logger.label('Pressure:', `${data.main.pressure} hPa`);
                    Logger.label('Wind Speed:', `${data.wind.speed} m/s`);
                    Logger.label('Visibility:', `${(data.visibility / 1000).toFixed(1)} km`);
                    Logger.divider();
                    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
                    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
                    Logger.label('Sunrise:', `🌅 ${sunriseTime}`);
                    Logger.label('Sunset:', `🌇 ${sunsetTime}`);
                    Logger.blank();
                } catch (err: unknown) {
                    spinner.fail(chalk.red('Failed to fetch weather.'));
                    Logger.error((err as Error).message);
                    process.exit(1);
                }
            });

        weather
            .command('forecast <city>')
            .description('Show 3-day weather forecast for a city')
            .action(async (city: string) => {
                Validator.isNonEmpty(city, 'City');
                const spinner = ora(`Fetching forecast for ${chalk.cyan(city)}...`).start();
                try {
                    const data: ForecastData = await this.getClient().getForecast(city);
                    spinner.succeed(chalk.green(`Forecast loaded for ${data.city.name}, ${data.city.country}`));

                    Logger.header(`📅  3-Day Forecast: ${data.city.name}`);

                    // Group by date (pick midday items)
                    const days: Record<string, typeof data.list[0]> = {};
                    for (const item of data.list) {
                        const date = item.dt_txt.split(' ')[0];
                        const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0], 10);
                        if (!days[date] || Math.abs(hour - 12) < Math.abs(parseInt(Object.keys(days).includes(date) ? days[date].dt_txt.split(' ')[1].split(':')[0] : '99', 10) - 12)) {
                            days[date] = item;
                        }
                    }

                    Object.entries(days).slice(0, 3).forEach(([date, item]) => {
                        const emoji = getEmoji(item.weather[0].main);
                        console.log(chalk.bold.yellow(`  ${date}`));
                        console.log(`    ${emoji} ${chalk.white(item.weather[0].main)} — ${chalk.cyan(item.main.temp.toFixed(1) + '°C')} | Humidity: ${item.main.humidity}%`);
                        Logger.blank();
                    });
                } catch (err: unknown) {
                    spinner.fail(chalk.red('Failed to fetch forecast.'));
                    Logger.error((err as Error).message);
                    process.exit(1);
                }
            });
    }
}
