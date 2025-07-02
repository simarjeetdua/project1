document.addEventListener("DOMContentLoaded", function () {
    const weatherForm = document.querySelector(".weatherForm");
    const cityInput = document.querySelector("#input-city");
    const searchButton = document.querySelector(".Search-btn");
    const displayCards = document.querySelector(".cards");

    const ApiKey = "e20d820bd849c36170b03539f6173011";

    weatherForm.addEventListener('submit', async event => {
        event.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            try {
                const weatherData = await getWeatherData(city);
                getWeatherInfo(weatherData);
            } catch (error) {
                console.error(error);
                displayError(error);
            }
        } else {
            displayError("please enter the city name ");
        }
    });

    async function getWeatherData(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${ApiKey}&units=metric`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("invalid details");
        }
        return await response.json();
    }

   function getWeatherInfo(data) {
    const {
        name: city,
        main: { temp, humidity },
        weather: [{ description, id }]
    } = data;

    const emoji = weatherEmoji(id);

    displayCards.textContent = "";
    displayCards.style.display = "flex";

    const weatherCard = document.createElement("div");
    weatherCard.innerHTML = `
        <h2>${city}</h2>
        <p>${emoji}</p>
        <p>Description: ${description}</p>
        <p>Temperature: ${temp}°C</p>
        <p>Humidity: ${humidity}%</p>
    `;
    displayCards.appendChild(weatherCard);
}


    function weatherEmoji(weatherId) {
    if (weatherId >= 200 && weatherId < 300) {
        return "⛈️ Thunderstorm";
    } else if (weatherId >= 300 && weatherId < 500) {
        return "🌦️ Drizzle";
    } else if (weatherId >= 500 && weatherId < 600) {
        return "🌧️ Rain";
    } else if (weatherId >= 600 && weatherId < 700) {
        return "❄️ Snow";
    } else if (weatherId >= 700 && weatherId < 800) {
        return "🌫️ Atmosphere (mist, smoke)";
    } else if (weatherId === 800) {
        return "☀️ Clear Sky";
    } else if (weatherId > 800 && weatherId < 900) {
        return "☁️ Clouds";
    } else {
        return "🌍 Weather";
    }
}


    function displayError(message) {
        const errorDisplay = document.createElement("p");
        errorDisplay.textContent = message;
        errorDisplay.classList.add("errorDisplay");

        displayCards.textContent = "";
        displayCards.style.display = "flex";
        displayCards.appendChild(errorDisplay);
    }
});
