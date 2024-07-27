import { fetchWeatherApi } from 'openmeteo';
	
const params = {
    // long and lat of Rishon LeZion
	"latitude": 31.971,
    "longitude": 34.7894,
	"hourly": "temperature_2m",
    "forecast_days": 1
};
const url = "https://api.open-meteo.com/v1/forecast";


const getWeather = async () => {
    const responses = await fetchWeatherApi(url, params);

    const response = responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();
    const hourly = response.hourly()!;

    const weatherData = {
        time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
            (t) => new Date((t + utcOffsetSeconds) * 1000)
        ),
        temperature: hourly.variables(0)!.valuesArray()!,
    };

    return weatherData
}

const range = (start: number, stop: number, step: number) =>
	Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export default getWeather



