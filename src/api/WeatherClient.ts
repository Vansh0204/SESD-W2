import { BaseAPIClient } from './BaseAPIClient';

export interface WeatherMain {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
}

export interface WeatherDescription {
    main: string;
    description: string;
    icon: string;
}

export interface WeatherData {
    name: string;
    sys: { country: string; sunrise: number; sunset: number };
    main: WeatherMain;
    weather: WeatherDescription[];
    wind: { speed: number; deg: number };
    visibility: number;
}

export interface ForecastItem {
    dt_txt: string;
    main: WeatherMain;
    weather: WeatherDescription[];
}

export interface ForecastData {
    city: { name: string; country: string };
    list: ForecastItem[];
}

export class WeatherClient extends BaseAPIClient {
    private readonly apiKey: string;

    constructor(apiKey: string) {
        super('https://api.openweathermap.org/data/2.5');
        this.apiKey = apiKey;
    }

    async getCurrentWeather(city: string): Promise<WeatherData> {
        return this.get<WeatherData>('/weather', {
            q: city,
            appid: this.apiKey,
            units: 'metric',
        });
    }

    async getForecast(city: string): Promise<ForecastData> {
        return this.get<ForecastData>('/forecast', {
            q: city,
            appid: this.apiKey,
            units: 'metric',
            cnt: '18', // ~3 days of 3h intervals
        });
    }
}
