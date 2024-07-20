import { fetchWeatherApi } from 'openmeteo';
	
const params = {
	"latitude": 32.0809,
	"longitude": 34.7806,
	"hourly": "temperature_2m"
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
        hourly: {
            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            temperature: hourly.variables(0)!.valuesArray()!,
        },
    };

    return weatherData
    
    // `weatherData` now contains a simple structure with arrays for datetime and weather data
    // for (let i = 0; i < weatherData.hourly.time.length; i++) {
    //     console.log(
    //         weatherData.hourly.time[i].toISOString(),
    //         weatherData.hourly.temperature2m[i]
    //     );
    // }
}

const range = (start: number, stop: number, step: number) =>
	Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export default getWeather



