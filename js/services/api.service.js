import { map } from './api-key.js'

export const apiService = {
    getWeather,
}


function getWeather({ lat, lng }) {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${map.WEATHER_API_KEY}`)
        .then(({ data }) => prepareData(data))
}

function prepareData(weatherData) {
    const { weather, main, name } = weatherData
    const { temp, humidity } = main
    const { description } = weather[0]

    return [
        `Place Name: ${name}`,
        `Temp in celsius: ${temp} `,
        `Humidity: ${humidity}`,
        `Description: ${description}`,
    ]
}