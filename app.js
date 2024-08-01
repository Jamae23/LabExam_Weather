document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "VpLFMRAmpA5zP8nNDATzA05GoYVPbIsi"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const currentWeatherDiv = document.getElementById("currentWeather");
    const hourlyForecastDiv = document.getElementById("hourlyForecast");
    const dailyForecastDiv = document.getElementById("dailyForecast");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(locationUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchHourlyForecast(locationKey);
                    fetchDailyForecast(locationKey);
                } else {
                    currentWeatherDiv.innerHTML = "<p>City not found.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                currentWeatherDiv.innerHTML = "<p>Error fetching location data.</p>";
            });
    }

    function fetchWeatherData(locationKey) {
        const currentWeatherUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayCurrentWeather(data[0]);
                } else {
                    currentWeatherDiv.innerHTML = "<p>No current weather data available.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching current weather data:", error);
                currentWeatherDiv.innerHTML = "<p>Error fetching current weather data.</p>";
            });
    }

    function displayCurrentWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        currentWeatherDiv.innerHTML = weatherContent;
    }

    function fetchHourlyForecast(locationKey) {
        const hourlyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${apiKey}&details=true`;

        fetch(hourlyForecastUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    hourlyForecastDiv.innerHTML = "<p>No hourly forecast data available.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                hourlyForecastDiv.innerHTML = "<p>Error fetching hourly forecast data.</p>";
            });
    }

    function displayHourlyForecast(data) {

        const temperature = data[0].Temperature.Value;
        const weather = data[0].IconPhrase;
        const forecastTime = new Date(data[0].DateTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

        const forecastContent = `
            <h2>Next Hour Forecast</h2>
            <p>Time: ${forecastTime}</p>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        hourlyForecastDiv.innerHTML = forecastContent;
    }

    function fetchDailyForecast(locationKey) {
        const dailyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&details=true`;

        fetch(dailyForecastUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayDailyForecast(data.DailyForecasts);
                } else {
                    dailyForecastDiv.innerHTML = "<p>No daily forecast data available.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast data:", error);
                dailyForecastDiv.innerHTML = "<p>Error fetching daily forecast data.</p>";
            });
    }

    function displayDailyForecast(forecasts) {
        let forecastContent = "<h2>Next 5 Days Forecast</h2>";
        forecasts.forEach(forecast => {
            const date = new Date(forecast.Date);
            const maxTemp = forecast.Temperature.Maximum.Value;
            const minTemp = forecast.Temperature.Minimum.Value;
            const dayWeather = forecast.Day.IconPhrase;
            const nightWeather = forecast.Night.IconPhrase;

            forecastContent += `
                <div class="daily-forecast">
                    <p>Date: ${date.toDateString()}</p>
                    <p>Day Weather: ${dayWeather}</p>
                    <p>Night Weather: ${nightWeather}</p>
                    <p>Temperature Range: ${minTemp}°C - ${maxTemp}°C</p>
                </div>
            `;
        });

        dailyForecastDiv.innerHTML = forecastContent;
    }
});
